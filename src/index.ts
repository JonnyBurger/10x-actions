import {xns} from 'xns';
import {addMissingDependencies} from './add-missing-dependencies';
import {fixCocoaPods} from './fix-cocoapods';
import {fixEslint} from './fix-eslint';
import {triggerRepositoryDispatch} from './trigger-repository-dispatch';
import {updateDependabotFile} from './update-dependabot-file';

xns(async () => {
	await addMissingDependencies(['prettier-plugin-organize-imports']);
	await triggerRepositoryDispatch();
	await updateDependabotFile();
	await fixEslint();
	await fixCocoaPods();
});
