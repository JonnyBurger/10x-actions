import fs from 'fs';
import {commitFiles} from './commit-file';
import {getContext} from './get-context';

export const updatePrettierFile = async (): Promise<void> => {
	console.log('Checking for prettier updates...');
	const context = getContext();
	if (context.ref !== 'heads/master') {
		console.log('Not checking for prettier file because we are not on master.');
		return;
	}
	const prettierRcPath = '.prettierrc';
	const fileExists = fs.existsSync(prettierRcPath);
	const fileBefore = fileExists
		? await fs.promises.readFile(prettierRcPath, 'utf8')
		: '';
	const fileAfter = JSON.stringify(
		{
			singleQuote: true,
			bracketSpacing: false,
			jsxBracketSameLine: false,
			useTabs: true,
			overrides: [
				{
					files: ['*.yml'],
					options: {
						singleQuote: false,
					},
				},
			],
		},
		null,
		'\t'
	);
	if (fileBefore === fileAfter) {
		console.log('.prettierrc file is up to date!');
		return;
	}
	if (fileBefore !== fileAfter) {
		await commitFiles(
			[
				{
					content: fileAfter,
					path: prettierRcPath,
				},
			],
			'improved the .prettierrc file for you 🤖'
		);
		console.log('Updated the .prettierrc file with the newest improvements.');
	}
};
