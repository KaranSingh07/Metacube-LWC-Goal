import TeamsMemberList from 'c/teamsMemberList';
import { createElement } from 'lwc';
import { axe, toHaveNoViolations } from 'jest-axe';
import { setImmediate } from 'timers';
import { LABELS } from '../labels';
import getAllTeamMembers from '@salesforce/apex/TeamController.getAllTeamMembers';

jest.mock(
	'@salesforce/apex/TeamController.getAllTeamMembers',
	() => {
		return {
			default: jest.fn(),
		};
	},
	{ virtual: true }
);

expect.extend(toHaveNoViolations);

const mockTeams = require('./data/teams.json');
const mockTeamMembers = require('./data/teamMembers.json');
const LIGHTNING_SHOWTOAST_EVENT_NAME = 'lightning__showtoast';
const flushPromises = () => new Promise((resolve) => setImmediate(resolve));

const createComponent = () => {
	return createElement('c-teams-member-list', {
		is: TeamsMemberList,
	});
};

describe('TeamsMemberList Component', () => {
	afterEach(() => {
		while (document.body.firstChild) {
			document.body.removeChild(document.body.firstChild);
		}
		jest.clearAllMocks();
	});

	it('Should be accessible', async () => {
		// Given
		getAllTeamMembers.mockResolvedValue(mockTeamMembers);
		const component = createComponent();
		component.teams = mockTeams;

		// When
		document.body.appendChild(component);

		// Then
		expect(await axe(component)).toHaveNoViolations();
	});

	it('Should populate teams in memberTeam combobox when component is loaded', async () => {
		// Given
		getAllTeamMembers.mockResolvedValue(mockTeamMembers);
		const component = createComponent();
		component.teams = mockTeams;

		// When
		document.body.appendChild(component);
		await flushPromises();

		// Then
		const memberTeamCombobox = component.shadowRoot.querySelector(
			'lightning-combobox[data-id="memberTeam"]'
		);
		expect(memberTeamCombobox.options).toStrictEqual(mockTeams);
	});

	it('Should show correct default warning message when no team is selected, should not show team members', async () => {
		// Given
		getAllTeamMembers.mockResolvedValue(mockTeamMembers);
		const component = createComponent();
		component.teams = mockTeams;

		// When
		document.body.appendChild(component);
		await flushPromises();

		// Then
		const warningMessageComponent = component.shadowRoot.querySelector(
			'label[data-id="warningMessage"]'
		);
		const teamMembers = component.shadowRoot.querySelectorAll('div[data-id="teamMember"]');

		expect(getAllTeamMembers).toHaveBeenCalledTimes(1);
		expect(warningMessageComponent.innerHTML).toBe(LABELS.NoTeamSelectedWarning);
		expect(teamMembers.length).toBe(0);
	});

	it('Should show correct warning message when a team is selected that do not have any members, should not show team members', async () => {
		// Given
		getAllTeamMembers.mockResolvedValue(mockTeamMembers);
		const component = createComponent();
		component.teams = mockTeams;

		document.body.appendChild(component);
		await flushPromises();

		// When
		const selectTeamCombobox = component.shadowRoot.querySelector(
			'lightning-combobox[data-id="memberTeam"]'
		);
		selectTeamCombobox.dispatchEvent(new CustomEvent('change', { detail: { value: 'aus' } }));
		await flushPromises();

		// Then
		const warningMessageComponent = component.shadowRoot.querySelector(
			'label[data-id="warningMessage"]'
		);
		const teamMembers = component.shadowRoot.querySelectorAll('div[data-id="teamMember"]');

		expect(getAllTeamMembers).toHaveBeenCalledTimes(1);
		expect(warningMessageComponent.innerHTML).toBe(LABELS.NoTeamMembersExistsWarning);
		expect(teamMembers.length).toBe(0);
	});

});
