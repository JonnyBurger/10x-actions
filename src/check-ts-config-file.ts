import fs from 'fs';
import commentJson from 'comment-json';
import {isReactNativeApp} from './is-react-native-app';
import {commitFiles} from './commit-file';
import {getContext} from './get-context';

const tsStyledPlugin = {
	name: 'typescript-styled-plugin',
	lint: {
		duplicateProperties: 'warning',
		universalSelector: 'warning',
		hexColorLength: 'error',
		argumentsInColorFunction: 'error',
		propertyIgnoredDueToDisplay: 'error',
		validProperties: [
			'shadow-color',
			'shadow-opacity',
			'shadow-offset',
			'shadow-radius',
			'padding-horizontal',
			'padding-vertical',
			'margin-vertical',
			'margin-horizontal',
			'tint-color',
			'aspect-ratio',
			'elevation',
		],
	},
};
export const checkTsConfigFile = async (): Promise<void> => {
	const context = getContext();
	const repo = `${context.owner}/${context.repo}`;
	const tsConfigPath = 'tsconfig.json';
	if (!fs.existsSync(tsConfigPath)) {
		throw new Error('No ts config exists');
	}

	const tsConfig = await fs.promises.readFile(tsConfigPath, 'utf-8');

	const parsedTsConfig = commentJson.parse(tsConfig, undefined, true);
	if (!parsedTsConfig.skipLibCheck) {
		parsedTsConfig.skipLibCheck = true;
	}
	if (isReactNativeApp(repo)) {
		if (
			!parsedTsConfig?.plugins?.find(
				(p: any) => p.name === 'typescript-styled-plugin'
			)
		) {
			if (!parsedTsConfig.plugins) {
				parsedTsConfig.plugins = [];
			}
			parsedTsConfig.plugins = [...parsedTsConfig.plugins, tsStyledPlugin];
		}
	}
	const newFile = JSON.stringify(parsedTsConfig, null, '\t');
	if (newFile !== tsConfig) {
		await commitFiles(
			[{content: newFile, path: tsConfigPath}],
			'Enabled skipLibCheck, it is not recommended anymore 🤖'
		);
		console.log('Updated the tsconfig.json file for you');
	}
};
