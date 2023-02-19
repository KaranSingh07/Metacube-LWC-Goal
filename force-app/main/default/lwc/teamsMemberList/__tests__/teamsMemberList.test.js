import TeamsMemberList from 'c/teamsMemberList';
import { createElement } from 'lwc';
import { axe, toHaveNoViolations } from 'jest-axe';
import { setImmediate } from 'timers';
import { createRecord } from 'lightning/uiRecordApi';

expect.extend(toHaveNoViolations);

const mockTeams = require('./data/teams.json');
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
		const component = createComponent();
		component.teams = mockTeams;

		// When
		document.body.appendChild(component);

		// Then
		expect(await axe(component)).toHaveNoViolations();
	});

	it('Should populate teams in memberTeam combobox when component is loaded', async () => {
		// Given
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
});
