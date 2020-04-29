import fs from 'fs';
import {commitFiles} from './commit-file';
import core = require('@actions/core');
import exec = require('@actions/exec');

export const addMissingDependencies = async (
	packageNames: string[]
): Promise<void> => {
	const cwd = core.getInput('pod-dir');

	const packageJsonPath = `${cwd}/package.json`;
	const packageLockPath = `${cwd}/package-lock.json`;
	const yarnLockPath = `${cwd}/yarn.lock`;

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

	if (packageNames.every((p) => deps[p])) {
		console.log(packageNames.join(',') + ' is installed.');
		return;
	}

	const uninstalled = packageNames.filter((p) => !deps[p]);
	for (const pack of uninstalled) {
		if (fs.existsSync(packageLockPath)) {
			await exec.exec('npm', ['i', '--save-dev', ''], {cwd});
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
				`🤖 Installed ${pack} in devDependencies`
			);
		} else {
			await exec.exec('yarn', ['add', '-D'], {cwd});
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
				`🤖 Installed ${pack} in devDependencies`
			);
		}
	}
};
