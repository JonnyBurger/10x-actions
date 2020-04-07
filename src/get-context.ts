import github = require('@actions/github');

export const getContext = (): {ref: string; owner: string; repo: string} => {
	const {
		ref: wrongRef,
		repo: {owner, repo},
	} = github.context;

	const ref = wrongRef.replace('refs/', '');

	return {
		ref,
		owner,
		repo,
	};
};
