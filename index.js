const core = require("@actions/core");
const github = require("@actions/github");
const exec = require("@actions/exec");
const fs = require("fs");

try {
  const myToken = core.getInput("github-token");
  const cwd = core.getInput("pod-dir");

  const octokit = new github.GitHub(myToken);

  const ref = await octokit.git.getRef(
    github.context.repo.owner,
    github.context.repo.repo,
    github.context.ref
  );
  const latestCommit = await octokit.git.getCommit(
    github.context.repo.owner,
    github.context.repo.repo,
    ref.data.object.sha
  );
  const podfileBefore = await fs.promises.readFile(`${cwd}/Podfile`, "utf-8");
  const podfileLockBefore = await fs.promises.readFile(
    `${cwd}/Podfile.lock`,
    "utf-8"
  );
  const podfilePath = `${cwd}/Podfile`;
  const podfileLockPath = `${cwd}/Podfile.lock`;
  console.log("Got Podfile before, now running pod install...");
  exec.exec("pod", ["install"], {
    cwd,
  });
  const podfileAfter = await fs.promises.readFile(podfilePath, "utf-8");
  const podfileLockAfter = await fs.promises.readFile(podfileLockPath, "utf-8");
  console.log("Got Podfile before, now running pod install...");
  if (podfileAfter !== podfileLockAfter || podfileBefore !== podfileAfter) {
    console.log("The Podfile is different, let me fix that");
    const podfileBlob = await octokit.git.createBlob({
      repo: github.context.repo.repo,
      owner: github.context.repo.owner,
      body: podfileAfter,
    });
    const commit = await octokit.git.createTree({
      repo: github.context.repo.repo,
      owner: github.context.repo.owner,
      base_tree: latestCommit.data.sha,
      tree: [
        {
          content: podfileAfter,
          path: podfilePath,
          sha: podfileBlob.data.sha,
          type: "blob",
          mode: "100644",
        },
      ],
    });
    await octokit.git.createCommit({
      repo: github.context.repo.repo,
      owner: github.context.repo.owner,
      committer: {
        email: "hi@jonny.io",
        name: "jonnybot",
      },
      message: "🤖 Fixing your fucking Podfile",
      tree: commit.data.sha,
      parents: [ref.data.object.sha],
    });
    await octokit.git.updateRef({
      repo: github.context.repo.repo,
      owner: github.context.repo.owner,
      ref: github.context.ref,
    });
  }
} catch (error) {
  core.setFailed(error.message);
}
