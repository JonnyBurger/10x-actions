import xns from 'xns';
import yaml from 'yaml';
import {getContext} from './get-context';
import {truthy} from './truthy';
import {isReactNativeApp} from './is-react-native-app';

const getIgnoredUpdates = (repo: string): string[] => {
	return [
		repo === 'JonnyBurger/bestande' ? 'uuid' : null,
		repo === 'JonnyBurger/bestande' ? 'file-loader' : null,
		repo === 'JonnyBurger/bestande' ? '@types/uuid' : null,
		repo === 'JonnyBurger/anysticker-app' ? 'react-native-bootsplash' : null,
		'metro-react-native-babel-preset',
		'metro',
	].filter(truthy);
};

const getAutomergedUpdates = (repo: string): string[] => {
	return [
		'aws-sdk',
		'stripe',
		'tics',
		'semver',
		isReactNativeApp(repo) ? '@react-native-community/cli' : null,
		'ava',
		'polished',
		'prettier',
		'@jonny/eslint-config',
		'ts-node',
		'mongodb',
		'css-loader',
		'mongodb-memory-server',
		'@react-navigation/bottom-tabs',
		'@react-navigation/native',
		'@react-navigation/stack',
		'react-native-device-info',
		'react-native-redash',
		'typescript',
		'date-fns',
		'ts-unused-exports',
		'ts-loader',
		'react-native-screens',
		'@react-native-community/async-storage',
		'pg',
		'webpack-dev-middleware',
		'ts-jest',
		'jest',
		'babel-preset-react',
		'react-native-safe-area-context',
		'eslint',
		'ts-node-dev',
		'ms',
	].filter(truthy);
};

export const makeDependabotFile = xns(() => {
	const context = getContext();
	const repo = `${context.owner}/${context.repo}`;
	const ignoredUpdates = getIgnoredUpdates(repo).map((name) => {
		return {
			match: {
				dependency_name: name,
			},
		};
	});
	const input = {
		version: 1,
		update_configs: [
			{
				package_manager: 'javascript',
				directory: '/',
				update_schedule: 'live',
				...(ignoredUpdates.length > 0 ? {ignored_updates: ignoredUpdates} : {}),
				automerged_updates: [
					{
						match: {
							dependency_type: 'all',
							update_type: 'all',
							dependency_name: '@types/*',
						},
					},
					...getAutomergedUpdates(repo).map((name) => {
						return {
							match: {
								dependency_name: name,
							},
						};
					}),
				],
				version_requirement_updates: 'increase_versions',
			},
			isReactNativeApp(repo)
				? {
						package_manager: 'ruby:bundler',
						directory: '/',
						update_schedule: 'live',
						automerged_updates: [
							{
								match: {
									dependency_name: 'fastlane',
								},
							},
						],
				  }
				: null,
		].filter(Boolean),
	};
	return yaml.stringify(input, {});
});
