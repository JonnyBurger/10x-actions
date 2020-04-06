import fs from "fs";
import { xns } from "xns";

import core = require("@actions/core");
import github = require("@actions/github");
import exec = require("@actions/exec");

const areLockfilesTheSame = (file1: string, file2: string) => {
  if (file1.toLowerCase() !== file2.toLowerCase()) {
    return false;
  }
};

xns(async () => {
  const myToken = core.getInput("github-token");
  const cwd = core.getInput("pod-dir");

  const octokit = new github.GitHub(myToken);
  const {
    ref: wrongRef,
    repo: { owner, repo },
  } = github.context;

  const ref = wrongRef.replace("refs/", "");

  const podfileBefore = await fs.promises.readFile(`${cwd}/Podfile`, "utf-8");
  const podfileLockBefore = await fs.promises.readFile(
    `${cwd}/Podfile.lock`,
    "utf-8"
  );
  const podfilePath = `${cwd}/Podfile`;
  const podfileLockPath = `${cwd}/Podfile.lock`;
  console.log("Got Podfile before, now running pod install...");
  await exec.exec("pod", ["install"], {
    cwd,
  });
  const podfileAfter = await fs.promises.readFile(podfilePath, "utf-8");
  const podfileLockAfter = await fs.promises.readFile(podfileLockPath, "utf-8");
  console.log("Got Podfile before, now running pod install...");
  if (
    podfileLockBefore.toLowerCase() !== podfileLockAfter.toLowerCase() ||
    podfileBefore !== podfileAfter
  ) {
    console.log("The Podfile is different, let me fix that");
    const curentRef = await octokit.git.getRef({
      owner,
      repo,
      ref,
    });
    const latestCommit = await octokit.git.getCommit({
      owner,
      repo,
      commit_sha: curentRef.data.object.sha,
    });
    const tree = await octokit.git.createTree({
      repo: github.context.repo.repo,
      owner: github.context.repo.owner,
      base_tree: latestCommit.data.sha,
      tree: [
        {
          content: podfileAfter,
          path: podfilePath,
          type: "blob",
          mode: "100644",
        },
        {
          content: podfileLockAfter,
          path: podfileLockPath,
          type: "blob",
          mode: "100644",
        },
      ],
    });
    const commit = await octokit.git.createCommit({
      repo: github.context.repo.repo,
      owner: github.context.repo.owner,
      message: "🤖 Fixed your fucking Podfile",
      tree: tree.data.sha,
      parents: [curentRef.data.object.sha],
    });
    console.log({
      repo: repo,
      owner: owner,
      ref,
      sha: commit.data.sha,
    });
    await octokit.git.updateRef({
      repo: repo,
      owner: owner,
      ref,
      sha: commit.data.sha,
    });
    console.log(
      "Fixed the fucking Podfile. Failing this commit now, wait for the next one!"
    );
    throw new Error("Podfile is not up to date (commit fix was made)");
  } else {
    console.log("Pod file is up to date!");
  }
});
