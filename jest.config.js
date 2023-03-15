const { jestConfig } = require('@salesforce/sfdx-lwc-jest/config');

module.exports = {
	...jestConfig,
	moduleNameMapper: {
		'^lightning/platformShowToastEvent$':
			'<rootDir>/force-app/test/jest-mocks/lightning/platformShowToastEvent',
	},
	collectCoverage: true,
	collectCoverageFrom: ['force-app/main/**/lwc/**/*.js', '!**/__tests__/**', '!**/__mocks__/**'],
	modulePathIgnorePatterns: ['<rootDir>/.localdevserver'],
};
