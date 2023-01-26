import Teams from 'c/teams';
import { createElement } from 'lwc';
import { axe, toHaveNoViolations } from 'jest-axe';
import { getTeams } from '@salesforce/apex/TeamController.getTeams';

expect.extend(toHaveNoViolations);

jest.mock(
	'@salesforce/apex/TeamController.getTeams',
	() => {
		return {
			default: jest.fn(),
		};
	},
	{ virtual: true }
);

const teams = require('./data/teams.json');
const createComponent = () => {
	return createElement('c-teams', {
		is: Teams,
	});
};

describe('Teams Component', () => {
	afterEach(() => {
		while (document.body.firstChild) {
			document.body.removeChild(document.body.firstChild);
		}
	});

	it('Should be accessible', async () => {
		// Given
		getTeams.mockResolvedValue(teams);
		const component = createComponent();

		// When
		document.body.appendChild(component);

		// Then
		expect(await axe(component)).toHaveNoViolations();
	});
});
