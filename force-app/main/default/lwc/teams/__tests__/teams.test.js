import Teams from 'c/teams';
import { createElement } from 'lwc';
import { axe, toHaveNoViolations } from 'jest-axe';
import { setImmediate } from 'timers';
import { ShowToastEventName } from 'lightning/platformShowToastEvent';
import { LABELS } from '../labels.js';
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
const flushPromises = () => new Promise((resolve) => setImmediate(resolve));

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

	it('Should load child components when teams are received', async () => {
		// Given
		getTeams.mockResolvedValue(mockTeams);
		const component = createComponent();

		// When
		document.body.appendChild(component);
		await flushPromises();

		// Then
		const teamsCreateMemberComponent =
			component.shadowRoot.querySelector('c-teams-create-member');
		expect(teamsCreateMemberComponent).not.toBe(null);

		const teamsMemberListComponent = component.shadowRoot.querySelector('c-teams-member-list');
		expect(teamsMemberListComponent).not.toBe(null);
	});

	it('Should not load child components when error is received and show error toast', async () => {
		// Given
		const mockError = {
			status: 500,
			body: {
				exceptionType: '',
				isUserDefinedException: false,
				message: 'Something went wrong fetching the teams.',
			},
			headers: {},
			ok: false,
			statusText: 'Server Error',
		};
		getTeams.mockRejectedValue(mockError);
		const component = createComponent();

		// When
		document.body.appendChild(component);
		const mockShowToastHandler = jest.fn();
		component.addEventListener(ShowToastEventName, mockShowToastHandler);

		await flushPromises();

		// Then
		const teamsCreateMemberComponent =
			component.shadowRoot.querySelector('c-teams-create-member');
		expect(teamsCreateMemberComponent).toBe(null);

		const teamsMemberListComponent = component.shadowRoot.querySelector('c-teams-member-list');
		expect(teamsMemberListComponent).toBe(null);

		expect(mockShowToastHandler).toHaveBeenCalledTimes(1);
		expect(mockShowToastHandler.mock.calls[0][0].detail).toStrictEqual({
			message: mockError.body.message,
			title: LABELS.ToastErrorTitle,
			variant: 'error',
		});
	});

	it('Should handle syncdata event when received', async () => {
		// Given
		getTeams.mockResolvedValue(mockTeams);
		const component = createComponent();
		document.body.appendChild(component);

		const mockSyncDataEventHandler = jest.fn();
		component.addEventListener('syncdata', mockSyncDataEventHandler);

		await flushPromises();

		// When
		component.dispatchEvent(new CustomEvent('syncdata'));

		// Then
		expect(mockSyncDataEventHandler).toHaveBeenCalledTimes(1);
	});
});
