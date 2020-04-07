import fs from 'fs';
import {xns} from 'xns';
import {commitFiles} from './commit-file';
import {fixEslint} from './fix-eslint';

import core = require('@actions/core');
import exec = require('@actions/exec');

const isPodfileTheSame = (file1: string, file2: string): boolean => {
	const exceptions = ['DoubleConversion', 'Folly', 'glog'];
	const split1 = file1.split('\n');
	const split2 = file2.split('\n');

	if (split2.length !== split1.length) {
		return false;
	}
	for (let i = 0; i < split1.length; i++) {
		const line1 = split1[i];
		const line2 = split2[i];
		if (line1.toLowerCase() !== line2.toLowerCase()) {
			if (!exceptions.some((e) => split1.includes(e) && split2.includes(e))) {
				return false;
			}
		}
	}
	return true;
};

xns(async () => {
	await fixEslint();
	const cwd = core.getInput('pod-dir');

	const podfileBefore = await fs.promises.readFile(`${cwd}/Podfile`, 'utf-8');
	const podfileLockBefore = await fs.promises.readFile(
		`${cwd}/Podfile.lock`,
		'utf-8'
	);
	const podfilePath = `${cwd}/Podfile`;
	const podfileLockPath = `${cwd}/Podfile.lock`;
	console.log('Got Podfile before, now running pod install...');
	await exec.exec('pod', ['install'], {
		cwd,
	});
	const podfileAfter = await fs.promises.readFile(podfilePath, 'utf-8');
	const podfileLockAfter = await fs.promises.readFile(podfileLockPath, 'utf-8');
	console.log('Got Podfile before, now running pod install...');
	if (
		!isPodfileTheSame(podfileLockBefore, podfileLockAfter) ||
		podfileBefore !== podfileAfter
	) {
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
	} else {
		console.log('Pod file is up to date!');
	}
});
