import {xns} from 'xns';
import {fixEslint} from './fix-eslint';
import {fixCocoaPods} from './fix-cocoapods';
import {updateDependabotFile} from './update-dependabot-file';
import {triggerRepositoryDispatch} from './trigger-repository-dispatch';

xns(async () => {
	await triggerRepositoryDispatch();
	await updateDependabotFile();
	await fixEslint();
	await fixCocoaPods();
});
