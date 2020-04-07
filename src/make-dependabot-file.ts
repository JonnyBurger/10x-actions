import xns from 'xns';
import yaml from 'yaml';

const getIgnoredUpdates = (): string[] => {
	return ['uuid', '@types/uuid', 'react-native-bootsplash'];
};

xns(async () => {
	const input = {
		version: 1,
		update_configs: [
			{
				package_manager: 'javascript',
				directory: '/',
				update_schedule: 'live',
				ignored_updates: getIgnoredUpdates,
			},
		],
	};
	return yaml.stringify(input);
});
