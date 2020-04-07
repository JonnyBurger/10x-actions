import {xns} from 'xns';
import {fixEslint} from './fix-eslint';
import {fixCocoaPods} from './fix-cocoapods';
import {updateDependabotFile} from './update-dependabot-file';
import {getContext} from './get-context';

xns(async () => {
	const context = getContext();
	console.log('REF:', context.ref);
	await updateDependabotFile();
	await fixEslint();
	await fixCocoaPods();
});
