import xns from 'xns';
import yaml from 'yaml';

const getIgnoredUpdates = (): string[] => {
	return ['uuid', '@types/uuid', 'react-native-bootsplash'];
};

const getAutomergedUpdates = (): string[] => {
	return ['aws-sdk'];
};

xns(async () => {
	const input = {
		version: 1,
		update_configs: [
			{
				package_manager: 'javascript',
				directory: '/',
				update_schedule: 'live',
				ignored_updates: getIgnoredUpdates().map((name) => {
					return {
						match: {
							dependency_name: name,
						},
					};
				}),
				automerged_updates: [
					{
						match: {
							dependency_type: 'all',
							update_type: 'all',
							dependency_name: '@types/*',
						},
					},
					...getAutomergedUpdates().map((name) => {
						return {
							match: {
								dependency_name: name,
							},
						};
					}),
				],
			},
		],
	};
	return yaml.stringify(input);
});
