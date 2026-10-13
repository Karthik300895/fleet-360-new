import { execFile } from 'node:child_process';
import fs from 'node:fs';
import os from 'node:os';
import path from 'node:path';
import { promisify } from 'node:util';

const execFileAsync = promisify(execFile);

function isTruthyEnv(value) {
  if (!value) return false;
  const v = String(value).trim().toLowerCase();
  return v === '1' || v === 'true' || v === 'yes';
}

function gitStderr(err) {
  if (!err || typeof err !== 'object') return String(err);
  const parts = [err.stderr, err.stdout, err.message].filter(Boolean);
  return parts.map((p) => String(p).trim()).join('\n').trim();
}

export function shouldAutoGitPush(payload) {
  if (payload && payload.autoPush === true) return true;
  return isTruthyEnv(process.env.ACL_LOCAL_GIT_AUTO_PUSH) || isTruthyEnv(process.env.ACL_LOCAL_SERVER);
}

export function isLocalServerMode() {
  return isTruthyEnv(process.env.ACL_LOCAL_SERVER);
}

async function gitConfigGet(cwd, key) {
  try {
    const { stdout } = await execFileAsync('git', ['config', '--get', key], { cwd });
    return stdout.trim();
  } catch {
    return '';
  }
}

async function resolveGitIdentity(cwd) {
  let email = (process.env.ACL_GIT_USER_EMAIL || process.env.GIT_AUTHOR_EMAIL || '').trim();
  let name = (process.env.ACL_GIT_USER_NAME || process.env.GIT_AUTHOR_NAME || '').trim();

  if (!email) email = await gitConfigGet(cwd, 'user.email');
  if (!name) name = await gitConfigGet(cwd, 'user.name');

  if (!email) {
    throw new Error(
      'Git user.email is not set. On Ubuntu run: cd ~/fleet-360-new && git config user.email "you@company.com" && git config user.name "VelocityONE Studio" — then pm2 restart fleet-360',
    );
  }
  if (!name) {
    name = 'Markdown Studio';
  }

  return { email, name };
}

async function assertGitRepository(cwd) {
  try {
    await execFileAsync('git', ['rev-parse', '--show-toplevel'], { cwd });
  } catch (err) {
    throw new Error(
      `Not a git repository (${cwd}). PM2 must run from the full clone (~/fleet-360-new), not a dist-only folder. ${gitStderr(err)}`,
    );
  }
}

async function gitPushWithRebase(cwd, env) {
  try {
    const { stdout } = await execFileAsync('git', ['push'], { cwd, env });
    return { pushed: true, pushOutput: (stdout || '').trim() };
  } catch (err) {
    const detail = gitStderr(err);
    if (!/rejected|fetch first|non-fast-forward|failed to push/i.test(detail)) {
      throw new Error(detail || 'git push failed');
    }

    const branch =
      (process.env.ACL_GIT_BRANCH || process.env.GITHUB_BRANCH || 'main').trim() || 'main';
    await execFileAsync('git', ['pull', '--rebase', 'origin', branch], { cwd, env });
    const { stdout } = await execFileAsync('git', ['push'], { cwd, env });
    return { pushed: true, rebased: true, pushOutput: (stdout || '').trim() };
  }
}

/**
 * Stage, commit, and push a single file in the repo checkout (self-hosted runner / velocityone).
 */
export async function gitCommitAndPush(repoRoot, repoFilePath, commitMessage) {
  const cwd = repoRoot;
  const gitEnv = {
    ...process.env,
    GIT_TERMINAL_PROMPT: '0',
  };

  await assertGitRepository(cwd);
  const { email, name } = await resolveGitIdentity(cwd);

  await execFileAsync('git', ['add', '--', repoFilePath], { cwd, env: gitEnv });

  let staged = '';
  try {
    const { stdout } = await execFileAsync('git', ['diff', '--cached', '--name-only'], { cwd, env: gitEnv });
    staged = stdout.trim();
  } catch {
    staged = '';
  }

  if (!staged) {
    let ignoreInfo = '';
    try {
      const { stdout } = await execFileAsync('git', ['check-ignore', '-v', repoFilePath], { cwd, env: gitEnv });
      ignoreInfo = stdout.trim();
    } catch {
      ignoreInfo = '';
    }

    let status = '';
    try {
      const { stdout } = await execFileAsync('git', ['status', '--short', '--', repoFilePath], { cwd, env: gitEnv });
      status = stdout.trim();
    } catch {
      status = '';
    }

    if (ignoreInfo) {
      throw new Error(`File is gitignored and was not staged: ${ignoreInfo}`);
    }

    return {
      pushed: false,
      skippedCommit: true,
      message: `No git changes to commit for ${repoFilePath} (file matches HEAD). status: ${status || 'clean'}`,
    };
  }

  const msgFile = path.join(os.tmpdir(), `acl-git-msg-${Date.now()}.txt`);
  fs.writeFileSync(msgFile, commitMessage, 'utf8');

  try {
    await execFileAsync(
      'git',
      [
        '-c',
        `user.email=${email}`,
        '-c',
        `user.name=${name}`,
        '-c',
        'commit.gpgsign=false',
        'commit',
        '-F',
        msgFile,
      ],
      { cwd, env: gitEnv },
    );
  } catch (err) {
    const detail = gitStderr(err);
    if (/nothing to commit|no changes added/i.test(detail)) {
      return { pushed: false, skippedCommit: true, message: 'No git changes to commit (content unchanged).' };
    }

    let status = '';
    try {
      const { stdout } = await execFileAsync('git', ['status', '--short'], { cwd, env: gitEnv });
      status = stdout.trim();
    } catch {
      status = '';
    }

    throw new Error(
      [detail, status ? `git status:\n${status}` : ''].filter(Boolean).join('\n\n') || 'git commit failed',
    );
  } finally {
    try {
      fs.unlinkSync(msgFile);
    } catch {
      // ignore
    }
  }

  return gitPushWithRebase(cwd, gitEnv);
}
