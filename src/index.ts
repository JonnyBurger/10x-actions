import {xns} from 'xns';
import {fixEslint} from './fix-eslint';
import {fixCocoaPods} from './fix-cocoapods';
import {updateDependabotFile} from './update-dependabot-file';

xns(async () => {
	await updateDependabotFile();
	await fixEslint();
	await fixCocoaPods();
});
