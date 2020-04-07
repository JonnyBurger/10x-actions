import {xns} from 'xns';
import {fixEslint} from './fix-eslint';
import {fixCocoaPods} from './fix-cocoapods';

xns(async () => {
	await fixEslint();
	await fixCocoaPods();
});
