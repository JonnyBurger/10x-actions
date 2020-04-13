export const isPodfileTheSame = (file1: string, file2: string): boolean => {
	const exceptions = ['DoubleConversion', 'Folly', 'glog'];
	const split1 = file1.split('\n');
	const split2 = file2.split('\n');

	if (split2.length !== split1.length) {
		return false;
	}
	for (let i = 0; i < split1.length; i++) {
		const line1 = split1[i];
		const line2 = split2[i];
		if (line1.toLowerCase() !== line2.toLowerCase()) {
			if (!exceptions.some((e) => line1.includes(e) && line2.includes(e))) {
				return false;
			}
		}
	}
	return true;
};
