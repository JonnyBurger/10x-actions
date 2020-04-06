import fs from "fs";
import { xns } from "xns";

import core = require("@actions/core");
import github = require("@actions/github");
import exec = require("@actions/exec");

const isPodfileTheSame = (file1: string, file2: string) => {
  const exceptions = ["DoubleConversion", "Folly", "glog"];
  const split1 = file1.split("\n");
  const split2 = file2.split("\n");

  if (split2.length !== split1.length) {
    return false;
  }
  for (let i = 0; i < split1.length; i++) {
    const line1 = split1[i];
    const line2 = split2[i];
    if (line1.toLowerCase() !== line2.toLowerCase()) {
      if (!exceptions.some((e) => split1.includes(e) && split2.includes(e))) {
        return false;
      }
    }
  }
  return true;
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
    !isPodfileTheSame(podfileLockBefore, podfileLockAfter) ||
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
    console.log("Fixed the fucking Podfile.");
  } else {
    console.log("Pod file is up to date!");
  }
});
