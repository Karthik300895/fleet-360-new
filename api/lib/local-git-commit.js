import { execFile } from 'node:child_process';
import { promisify } from 'node:util';

const execFileAsync = promisify(execFile);

function isTruthyEnv(value) {
  if (!value) return false;
  const v = String(value).trim().toLowerCase();
  return v === '1' || v === 'true' || v === 'yes';
}

export function shouldAutoGitPush(payload) {
  if (payload && payload.autoPush === true) return true;
  return isTruthyEnv(process.env.ACL_LOCAL_GIT_AUTO_PUSH) || isTruthyEnv(process.env.ACL_LOCAL_SERVER);
}

export function isLocalServerMode() {
  return isTruthyEnv(process.env.ACL_LOCAL_SERVER);
}

/**
 * Stage, commit, and push a single file in the repo checkout (self-hosted runner / velocityone).
 */
export async function gitCommitAndPush(repoRoot, repoFilePath, commitMessage) {
  const cwd = repoRoot;
  const gitEnv = { ...process.env };

  await execFileAsync('git', ['add', '--', repoFilePath], { cwd, env: gitEnv });

  try {
    await execFileAsync('git', ['commit', '-m', commitMessage], { cwd, env: gitEnv });
  } catch (err) {
    const msg = err instanceof Error ? err.message : String(err);
    if (/nothing to commit|no changes added/i.test(msg)) {
      return { pushed: false, skippedCommit: true, message: 'No git changes to commit (content unchanged).' };
    }
    throw err;
  }

  const { stdout } = await execFileAsync('git', ['push'], { cwd, env: gitEnv });
  return { pushed: true, pushOutput: (stdout || '').trim() };
}
