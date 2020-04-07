import fs from 'fs';
import {commitFiles} from './commit-file';

import exec = require('@actions/exec');

export const fixEslint = async (): Promise<void> => {
	const packageJson = await fs.promises.readFile('package.json', 'utf-8');
	const parsed = JSON.parse(packageJson);
	const testCommand = parsed.scripts.test as string;
	const splitByAnd = testCommand.split('&&').map((a) => a.trim());
	const eslintCommand = splitByAnd.find((s) => s.startsWith('eslint'));
	if (!eslintCommand) {
		console.log('Test script: ', testCommand);
		console.log('No ESLint command found. Quitting.');
		return;
	}
	const splittedEslintCommand = eslintCommand.split(' ');
	await exec.exec('eslint', ['--fix', ...splittedEslintCommand.slice(1)]);
	let gitStatus = '';
	await exec.exec('git', ['status'], {
		listeners: {
			stdout: (data: Buffer): void => {
				gitStatus += data.toString();
			},
		},
	});
	console.log('Git status:');
	console.log(gitStatus);
	const modifiedRaw = gitStatus
		.split('\n')
		.filter((f) => f.includes('modified:'));
	const modifiedFiles = modifiedRaw
		.map((m) => m.replace('modified:', '').trim())
		// Fix a maximum of 20 files
		.slice(0, 20);
	console.log('modified files:');
	console.log(modifiedFiles);
	const filesToChange = await Promise.all(
		modifiedFiles.map(async (path) => {
			return {
				content: await fs.promises.readFile(path, 'utf8'),
				path,
			};
		})
	);
	await commitFiles(filesToChange, '🤖 Fixed ESLint errors');
};
