import fs from 'fs';
import {makeDependabotFile} from './make-dependabot-file';
import {commitFiles} from './commit-file';
import {getContext} from './get-context';

export const updateDependabotFile = async (): Promise<void> => {
	console.log('Checking for dependabot updates...');
	const context = getContext();
	if (context.ref !== 'heads/master') {
		console.log(
			'Not checking for dependabot file because we are not on master.'
		);
		return;
	}
	const dependabotFilePath = '.dependabot/config.yml';
	const fileExists = fs.existsSync(dependabotFilePath);
	const fileBefore = fileExists
		? await fs.promises.readFile(dependabotFilePath, 'utf8')
		: '';
	const fileAfter = makeDependabotFile();
	if (fileBefore === fileAfter) {
		console.log('Dependabot file is up to date!');
		return;
	}
	if (fileBefore !== fileAfter) {
		await commitFiles(
			[
				{
					content: fileAfter,
					path: dependabotFilePath,
				},
			],
			'improved the dependabot file for you 🤖'
		);
		console.log('Updated the dependabot file with the newest improvements.');
	}
};
