import TeamsCreateMember from 'c/teamsCreateMember';
import { createElement } from 'lwc';
import { axe, toHaveNoViolations } from 'jest-axe';
import { setImmediate } from 'timers';
import { createRecord } from 'lightning/uiRecordApi';
import { LABELS } from '../labels';
import { ShowToastEventName } from 'lightning/platformShowToastEvent';

expect.extend(toHaveNoViolations);

const mockTeams = require('./data/teams.json');
const flushPromises = () => new Promise((resolve) => setImmediate(resolve));

const createComponent = () => {
	return createElement('c-teams-create-member', {
		is: TeamsCreateMember,
	});
};

const mockFields = {
	Name: 'Sachin Tendulkar',
	Skills__c: 'Batting',
	Team__c: 'ind',
};

describe('TeamsCreateMember Component', () => {
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

	it('Should populate with correct UI', async () => {
		// Given
		const component = createComponent();
		component.teams = mockTeams;

		// When
		document.body.appendChild(component);
		await flushPromises();

		// Then
		expect(component).toMatchSnapshot();
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

	it('Should call createRecord API to save team member record with correct parameters', async () => {
		// Given
		const component = createComponent();
		component.teams = mockTeams;
		document.body.appendChild(component);
		await flushPromises();

		const mockCreateRecordInputParams = [{ apiName: 'TeamMember__c', fields: mockFields }];

		const memberNameInput = component.shadowRoot.querySelector(
			'lightning-input[data-id="memberName"]'
		);
		const memberSkillsInput = component.shadowRoot.querySelector(
			'lightning-input[data-id="memberSkills"]'
		);
		const memberTeamCombobox = component.shadowRoot.querySelector(
			'lightning-combobox[data-id="memberTeam"]'
		);

		memberNameInput.dispatchEvent(
			new CustomEvent('change', { detail: { value: mockFields.Name } })
		);
		memberSkillsInput.dispatchEvent(
			new CustomEvent('change', { detail: { value: mockFields.Skills__c } })
		);
		memberTeamCombobox.dispatchEvent(
			new CustomEvent('change', { detail: { value: mockFields.Team__c } })
		);

		// When
		const createMemberButton = component.shadowRoot.querySelector(
			'lightning-button[title="createMember"]'
		);
		createMemberButton.click();

		await flushPromises();

		// Then
		expect(createRecord).toHaveBeenCalledTimes(1);
		expect(createRecord.mock.calls[0]).toEqual(mockCreateRecordInputParams);
	});

	it('Should show success toast message when record is saved successfully and dispatch syncdata event', async () => {
		// Given
		const component = createComponent();
		component.teams = mockTeams;
		createRecord.mockResolvedValue({});

		document.body.appendChild(component);

		const mockToastHandler = jest.fn();
		const mockSyncDataHandler = jest.fn();
		component.addEventListener(ShowToastEventName, mockToastHandler);
		component.addEventListener('syncdata', mockSyncDataHandler);

		await flushPromises();

		const memberNameInput = component.shadowRoot.querySelector(
			'lightning-input[data-id="memberName"]'
		);
		const memberSkillsInput = component.shadowRoot.querySelector(
			'lightning-input[data-id="memberSkills"]'
		);
		const memberTeamCombobox = component.shadowRoot.querySelector(
			'lightning-combobox[data-id="memberTeam"]'
		);

		memberNameInput.dispatchEvent(
			new CustomEvent('change', { detail: { value: mockFields.Name } })
		);
		memberSkillsInput.dispatchEvent(
			new CustomEvent('change', { detail: { value: mockFields.Skills__c } })
		);
		memberTeamCombobox.dispatchEvent(
			new CustomEvent('change', { detail: { value: mockFields.Team__c } })
		);

		// When
		const createMemberButton = component.shadowRoot.querySelector(
			'lightning-button[title="createMember"]'
		);
		createMemberButton.click();
		await flushPromises();

		// Then
		expect(mockToastHandler).toHaveBeenCalled();
		expect(mockToastHandler.mock.calls[0][0].detail).toStrictEqual({
			message: LABELS.TeamMemberCreated,
			title: LABELS.ToastSuccessTitle,
			variant: 'success',
		});
		expect(mockSyncDataHandler).toHaveBeenCalled();
	});

	it('Should show error toast message when record save is failed and do not dispatch syncdata event', async () => {
		// Given
		const component = createComponent();
		component.teams = mockTeams;
		const errorResponse = { error: 'Something went wrong while Saving the record' };
		createRecord.mockRejectedValue(errorResponse);

		document.body.appendChild(component);

		const mockToastHandler = jest.fn();
		const mockSyncDataHandler = jest.fn();
		component.addEventListener(ShowToastEventName, mockToastHandler);
		component.addEventListener('syncdata', mockSyncDataHandler);

		await flushPromises();

		const memberNameInput = component.shadowRoot.querySelector(
			'lightning-input[data-id="memberName"]'
		);
		const memberSkillsInput = component.shadowRoot.querySelector(
			'lightning-input[data-id="memberSkills"]'
		);
		const memberTeamCombobox = component.shadowRoot.querySelector(
			'lightning-combobox[data-id="memberTeam"]'
		);

		memberNameInput.dispatchEvent(
			new CustomEvent('change', { detail: { value: mockFields.Name } })
		);
		memberSkillsInput.dispatchEvent(
			new CustomEvent('change', { detail: { value: mockFields.Skills__c } })
		);
		memberTeamCombobox.dispatchEvent(
			new CustomEvent('change', { detail: { value: mockFields.Team__c } })
		);

		// When
		const createMemberButton = component.shadowRoot.querySelector(
			'lightning-button[title="createMember"]'
		);
		createMemberButton.click();
		await flushPromises();

		// Then
		expect(mockToastHandler).toHaveBeenCalled();
		expect(mockToastHandler.mock.calls[0][0].detail).toStrictEqual({
			message: errorResponse,
			title: LABELS.ToastErrorTitle,
			variant: 'error',
		});
		expect(mockSyncDataHandler).not.toHaveBeenCalled();
	});
});
