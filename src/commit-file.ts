import {getOctokit} from './get-octokit';
import {getContext} from './get-context';

import github = require('@actions/github');

export type FileUpdate = {
	path: string;
	content: string;
};

export const commitFiles = async (
	files: FileUpdate[],
	message: string
): Promise<void> => {
	const octokit = getOctokit();
	const {owner, repo, ref} = getContext();
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
		tree: files.map((f) => {
			return {
				content: f.content,
				path: f.path,
				type: 'blob',
				mode: '100644',
			};
		}),
	});
	const commit = await octokit.git.createCommit({
		repo: github.context.repo.repo,
		owner: github.context.repo.owner,
		message,
		tree: tree.data.sha,
		parents: [curentRef.data.object.sha],
	});
	await octokit.git.updateRef({
		repo,
		owner,
		ref,
		sha: commit.data.sha,
	});
};
