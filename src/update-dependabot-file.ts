import fs from 'fs';
import {makeDependabotFile} from './make-dependabot-file';
import {commitFiles} from './commit-file';

export const updateDependabotFile = async (): Promise<void> => {
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
	}
};
