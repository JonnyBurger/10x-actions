import fs from 'fs';
import {commitFiles} from './commit-file';

import exec = require('@actions/exec');

export const removeExtraneousDependencies = async (
	packageNames: string[]
): Promise<void> => {
	const packageJsonPath = 'package.json';
	const packageLockPath = 'package-lock.json';
	const yarnLockPath = 'yarn.lock';

	const packageJsonExists = fs.existsSync(packageJsonPath);
	if (!packageJsonExists) {
		throw new Error('No package.json exists. This is very strange');
	}

	const packageJson = await fs.promises.readFile(packageJsonPath, 'utf-8');
	const parsedPackageJson = JSON.parse(packageJson);
	const deps = {
		...parsedPackageJson.dependencies,
		...parsedPackageJson.devDependencies,
	};

	if (packageNames.every((p) => !deps[p])) {
		console.log(packageNames.join(',') + ' is not installed.');
		return;
	}

	const uninstalled = packageNames.filter((p) => deps[p]);
	for (const pack of uninstalled) {
		if (fs.existsSync(packageLockPath)) {
			await exec.exec('npm', ['i', 'uninstall', pack]);
			await commitFiles(
				[
					{
						path: packageLockPath,
						content: fs.readFileSync(packageLockPath, 'utf8'),
					},
					{
						path: packageJsonPath,
						content: fs.readFileSync(packageJsonPath, 'utf8'),
					},
				],
				`🤖 Removed ${pack} in devDependencies`
			);
		} else {
			await exec.exec('yarn', ['remove', pack]);
			await commitFiles(
				[
					{
						path: yarnLockPath,
						content: fs.readFileSync(yarnLockPath, 'utf8'),
					},
					{
						path: packageJsonPath,
						content: fs.readFileSync(packageJsonPath, 'utf8'),
					},
				],
				`🤖 Removed ${pack} in devDependencies`
			);
		}
	}
};
