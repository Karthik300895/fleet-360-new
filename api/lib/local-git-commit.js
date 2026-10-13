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

export function sanitizeGitErrorForClient(message) {
  return String(message)
    .replace(/https:\/\/(?:[^@\s/]+)@github\.com/gi, 'https://***@github.com')
    .replace(/(x-access-token:|oauth2:)[^@\s]+@/gi, '$1***@')
    .replace(/\bghp_[A-Za-z0-9]+\b/g, 'ghp_***')
    .replace(/\bgithub_pat_[A-Za-z0-9_]+\b/g, 'github_pat_***')
    .replace(/\bglpat-[A-Za-z0-9]+\b/g, 'glpat-***');
}

function resolveGithubPushToken() {
  return (
    process.env.ACL_GITHUB_TOKEN ||
    process.env.GITHUB_TOKEN ||
    process.env.GH_TOKEN ||
    process.env.GITHUB_PAT ||
    ''
  ).trim();
}

function assertGithubPushToken(token) {
  if (!token) return;
  if (token.startsWith('glpat-')) {
    throw new Error(
      'ACL_GITHUB_TOKEN looks like a GitLab token (glpat-…). Use a GitHub token from github.com → Settings → Developer settings → Personal access tokens (classic, ghp_…) or fine-grained (github_pat_…), with repo write access to Karthik300895/fleet-360-new.',
    );
  }
}

function parseGithubOwnerRepo(remoteUrl) {
  const url = (remoteUrl || '').trim();
  const sshMatch = url.match(/git@github\.com:([^/]+)\/(.+?)(?:\.git)?$/i);
  if (sshMatch) {
    return { owner: sshMatch[1], repo: sshMatch[2].replace(/\.git$/, '') };
  }
  const httpsMatch = url.match(/github\.com[/:]([^/]+)\/(.+?)(?:\.git)?$/i);
  if (httpsMatch) {
    return { owner: httpsMatch[1], repo: httpsMatch[2].replace(/\.git$/, '') };
  }
  return null;
}

function authenticatedGithubRemoteUrl(owner, repo, token) {
  assertGithubPushToken(token);
  // GitHub HTTPS PAT (classic or fine-grained)
  return `https://oauth2:${encodeURIComponent(token)}@github.com/${owner}/${repo}.git`;
}

async function getOriginRemote(cwd) {
  try {
    const { stdout } = await execFileAsync('git', ['remote', 'get-url', 'origin'], { cwd });
    return stdout.trim();
  } catch {
    return '';
  }
}

async function getCurrentBranch(cwd, env) {
  const { stdout } = await execFileAsync('git', ['rev-parse', '--abbrev-ref', 'HEAD'], { cwd, env });
  return stdout.trim() || 'main';
}

async function runGitPush(cwd, env, pushArgs) {
  const { stdout } = await execFileAsync('git', pushArgs, { cwd, env });
  return (stdout || '').trim();
}

function isAuthPushError(detail) {
  return /could not read Username|terminal prompts disabled|authentication failed|invalid credentials|403|401/i.test(
    detail,
  );
}

async function countUnpushedCommits(cwd, env, branch) {
  try {
    const { stdout } = await execFileAsync('git', ['rev-list', '--count', `origin/${branch}..HEAD`], {
      cwd,
      env,
    });
    return Number.parseInt(stdout.trim(), 10) || 0;
  } catch {
    return 0;
  }
}

function needsRebaseBeforePush(detail) {
  return /rejected|fetch first|non-fast-forward|failed to push/i.test(detail);
}

async function gitPullRebase(cwd, env, branch, authRemote) {
  if (authRemote) {
    await execFileAsync('git', ['pull', '--rebase', authRemote, branch], { cwd, env });
    return;
  }
  await execFileAsync('git', ['pull', '--rebase', 'origin', branch], { cwd, env });
}

async function gitPushWithRebase(cwd, env) {
  const branch = await getCurrentBranch(cwd, env);
  const token = resolveGithubPushToken();
  const origin = await getOriginRemote(cwd);
  const gh = parseGithubOwnerRepo(origin);
  const authRemote = token && gh ? authenticatedGithubRemoteUrl(gh.owner, gh.repo, token) : null;

  const pushOnce = async () => {
    if (authRemote) {
      return runGitPush(cwd, env, ['push', authRemote, `HEAD:${branch}`]);
    }
    try {
      return await runGitPush(cwd, env, ['push', 'origin', `HEAD:${branch}`]);
    } catch (err) {
      const detail = gitStderr(err);
      if (isAuthPushError(detail)) {
        throw new Error(
          'Git push needs ACL_GITHUB_TOKEN in ~/fleet-360-new/.env (GitHub PAT with repo write), or SSH origin.',
        );
      }
      throw err;
    }
  };

  try {
    const out = await pushOnce();
    return { pushed: true, pushOutput: out, usedTokenAuth: Boolean(authRemote) };
  } catch (err) {
    const detail = gitStderr(err);

    if (!needsRebaseBeforePush(detail)) {
      throw new Error(sanitizeGitErrorForClient(detail || 'git push failed'));
    }

    try {
      await gitPullRebase(cwd, env, branch, authRemote);
      const out = await pushOnce();
      return {
        pushed: true,
        rebased: true,
        pushOutput: out,
        usedTokenAuth: Boolean(authRemote),
      };
    } catch (rebaseErr) {
      throw new Error(
        sanitizeGitErrorForClient(
          `${gitStderr(rebaseErr)}\n\nHint: on the server run: cd ~/fleet-360-new && git pull --rebase origin main && git push`,
        ),
      );
    }
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

    const branch = await getCurrentBranch(cwd, gitEnv);
    const unpushed = await countUnpushedCommits(cwd, gitEnv, branch);
    if (unpushed > 0) {
      const pushResult = await gitPushWithRebase(cwd, gitEnv);
      return {
        ...pushResult,
        skippedCommit: true,
        message: `No new edits for ${repoFilePath}; pushed ${unpushed} existing local commit(s) to origin.`,
      };
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
      const branch = await getCurrentBranch(cwd, gitEnv);
      const unpushed = await countUnpushedCommits(cwd, gitEnv, branch);
      if (unpushed > 0) {
        const pushResult = await gitPushWithRebase(cwd, gitEnv);
        return {
          ...pushResult,
          skippedCommit: true,
          message: `No new changes; pushed ${unpushed} existing local commit(s).`,
        };
      }
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
      sanitizeGitErrorForClient(
        [detail, status ? `git status:\n${status}` : ''].filter(Boolean).join('\n\n') || 'git commit failed',
      ),
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
