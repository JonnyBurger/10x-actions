import fs from 'fs';
import {commitFiles} from './commit-file';

import exec = require('@actions/exec');

const findEslintCommand = (commandRaw: string): string | null => {
	const command = commandRaw.replace(/\$\((.*)\)/g, '');
	const splitByAnd = command.split('&&').map((a) => a.trim());
	const eslintCommand = splitByAnd.find((s) => s.startsWith('eslint'));
	return eslintCommand ?? null;
};

const findAnyEslintCommand = (scripts: {
	[key: string]: string;
}): string | null => {
	const keys = Object.keys(scripts);
	for (const key of keys) {
		const command = findEslintCommand(scripts[key]);
		if (command) {
			return command;
		}
	}
	return null;
};

export const fixEslint = async (): Promise<void> => {
	const packageJson = await fs.promises.readFile('package.json', 'utf-8');
	const parsed = JSON.parse(packageJson);
	const eslintCommand = findAnyEslintCommand(parsed.scripts);
	if (!eslintCommand) {
		console.log('No ESLint command found. Quitting.');
		return;
	}
	const splittedEslintCommand = eslintCommand.split(' ');
	await exec.exec('npx', [
		'eslint',
		'--fix',
		...splittedEslintCommand.slice(1).map((s) => {
			console.log(s);
			if (s.startsWith("'") && s.endsWith("'")) {
				return s.substr(1, s.length - 2);
			}
			return s;
		}),
	]);
	let gitStatus = '';
	await exec.exec('git', ['status'], {
		listeners: {
			stdout: (data: Buffer): void => {
				gitStatus += data.toString();
			},
		},
	});
	console.log('Git status:');
	const modifiedRaw = gitStatus
		.split('\n')
		.filter((f) => f.includes('modified:'));
	const modifiedFiles = modifiedRaw
		.map((m) => m.replace('modified:', '').trim())
		.filter((f) => f !== 'package-lock.json' && !f.includes('Podfile.lock'))
		// Fix a maximum of 20 files
		.slice(0, 20);
	console.log('modified files:');
	console.log(modifiedFiles.join('\n'));
	if (modifiedFiles.length === 0) {
		console.log('There are no ESLint errors (that can be fixed)! Well done!');
		return;
	}
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
