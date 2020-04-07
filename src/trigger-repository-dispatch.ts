import {getContext} from './get-context';
import {getOctokit} from './get-octokit';

import github = require('@actions/github');

export const triggerRepositoryDispatch = async (): Promise<void> => {
	const context = getContext();
	const octokit = getOctokit();

	const commit = await octokit.git.getCommit({
		repo: context.repo,
		owner: context.owner,
		commit_sha: github.context.sha,
	});
	const commitMessage = commit.data.message;
	if (commitMessage.includes('[android]')) {
		console.log(
			'Found [android] in build message, will trigger repository dispatch event'
		);
		await octokit.repos.createDispatchEvent({
			event_type: 'build-android',
			owner: context.owner,
			repo: context.repo,
		});
	}
	if (commitMessage.includes('[ios]')) {
		console.log(
			'Found [ios] in build message, will trigger repository dispatch event'
		);
		await octokit.repos.createDispatchEvent({
			event_type: 'build-ios',
			owner: context.owner,
			repo: context.repo,
		});
	}
};
