const path = require("node:path");

const appRoot = __dirname;

/** @type {import('pm2').StartOptions} */
module.exports = {
  apps: [
    {
      name: "fleet-360",
      cwd: appRoot,
      script: path.join(appRoot, "scripts/serve-with-markdown-api.mjs"),
      interpreter: "node",
      env: {
        NODE_ENV: "production",
        PORT: "3000",
        ACL_LOCAL_SERVER: "1",
        ACL_LOCAL_GIT_AUTO_PUSH: "1",
        ACL_REPO_ROOT: appRoot,
        // Set these on the server if git commit fails (required for git commit -m "...")
        ACL_GIT_USER_NAME: "Karthik300895",
        ACL_GIT_USER_EMAIL: "karthik.r@acldigital.com",
        // GitHub PAT for non-interactive push (HTTPS remote). Prefer server .env — do not commit tokens.
        // ACL_GITHUB_TOKEN: "ghp_...",
      },
    },
  ],
};
