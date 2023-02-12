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
jest.mock('c/teamsCreateMember');
jest.mock('c/teamsMemberList');

const mockTeams = require('./data/teams.json');
const flushPromises = () => new Promise((resolve) => setTimeout(resolve, 0));

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
		jest.clearAllMocks();
	});

	it('Should be accessible', async () => {
		// Given
		getTeams.mockResolvedValue(mockTeams);
		const component = createComponent();

		// When
		document.body.appendChild(component);

		// Then
		expect(await axe(component)).toHaveNoViolations();
	});

});
