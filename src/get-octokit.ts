import core = require('@actions/core');
import github = require('@actions/github');

export const getOctokit = (): github.GitHub => {
	const myToken = core.getInput('github-token');

	return new github.GitHub(myToken);
};
