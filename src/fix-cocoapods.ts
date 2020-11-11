import fs from 'fs';
import {isPodfileTheSame} from './is-podfile-the-same';
import {commitFiles} from './commit-file';

import core = require('@actions/core');
import exec = require('@actions/exec');

export const fixCocoaPods = async (): Promise<void> => {
	const cwd = core.getInput('pod-dir');

	const podfileExists = fs.existsSync(`${cwd}/Podfile`);
	if (!podfileExists) {
		console.log('No podfile exists. Nothing to update.');
		return;
	}

	const podfileBefore = await fs.promises.readFile(`${cwd}/Podfile`, 'utf-8');
	const podfileLockBefore = await fs.promises.readFile(
		`${cwd}/Podfile.lock`,
		'utf-8'
	);
	const podfilePath = `${cwd}/Podfile`;
	const podfileLockPath = `${cwd}/Podfile.lock`;
	console.log('Got Podfile before, now running pod install...');
	await exec.exec('pod', ['install', '--repo-update'], {
		cwd,
	});
	const podfileAfter = await fs.promises.readFile(podfilePath, 'utf-8');
	const podfileLockAfter = await fs.promises.readFile(podfileLockPath, 'utf-8');
	console.log('Got Podfile before, now running pod install...');
	if (
		isPodfileTheSame(podfileLockAfter, podfileLockBefore) &&
		podfileBefore === podfileAfter
	) {
		console.log('Podfile is up to date.');
		return;
	}
	console.log('The Podfile is different, let me fix that');
	await commitFiles(
		[
			{path: podfilePath, content: podfileAfter},
			{
				path: podfileLockPath,
				content: podfileLockAfter,
			},
		],
		'🤖 Fixed your fucking Podfile'
	);
	console.log('Fixed the fucking Podfile.');
};
