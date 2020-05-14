import {xns} from 'xns';
import {addMissingDependencies} from './add-missing-dependencies';
import {fixCocoaPods} from './fix-cocoapods';
import {fixEslint} from './fix-eslint';
import {triggerRepositoryDispatch} from './trigger-repository-dispatch';
import {updateDependabotFile} from './update-dependabot-file';
import {removeExtraneousDependencies} from './remove-extraneous-dependencies';
import {updatePrettierFile} from './update-prettier-file';
import {checkTsConfigFile} from './check-ts-config-file';

xns(async () => {
	await removeExtraneousDependencies([
		'@jonny/prettier-plugin-organize-imports',
	]);
	await addMissingDependencies([
		'prettier-plugin-organize-imports',
		'eslint',
		'prettier',
	]);
	await checkTsConfigFile();
	await triggerRepositoryDispatch();
	await updateDependabotFile();
	await updatePrettierFile();
	await fixEslint();
	await fixCocoaPods();
});
