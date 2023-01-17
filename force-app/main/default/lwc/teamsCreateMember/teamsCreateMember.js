import { api, LightningElement, track } from 'lwc';
import { createRecord } from 'lightning/uiRecordApi';
import TEAM_MEMBER_OBJECT from '@salesforce/schema/TeamMember__c';
import TEAM_MEMBER_NAME_FIELD from '@salesforce/schema/TeamMember__c.Name';
import TEAM_MEMBER_SKILLS_FIELD from '@salesforce/schema/TeamMember__c.Skills__c';
import TEAM_MEMBER_TEAM_FIELD from '@salesforce/schema/TeamMember__c.Team__c';
import { ShowToastEvent } from 'lightning/platformShowToastEvent';
import { LABELS } from './labels';

export default class TeamsCreateMember extends LightningElement {
	@api teams;

	@track state = {
		newMember: {
			name: '',
			skills: '',
			teamId: '',
		},
		isLoading: false,
		isError: false,
	};

	async handleCreateMember() {
		this.showSpinner(true);

		const fields = {};
		fields[TEAM_MEMBER_NAME_FIELD.fieldApiName] = this.newMember.name;
		fields[TEAM_MEMBER_SKILLS_FIELD.fieldApiName] = this.newMember.skills;
		fields[TEAM_MEMBER_TEAM_FIELD.fieldApiName] = this.newMember.teamId;

		await createRecord({ apiName: TEAM_MEMBER_OBJECT.objectApiName, fields })
			.then(() => {
				this.showSuccessToast(LABELS.ToastSuccessTitle, LABELS.TeamMemberCreated);
				this.dispatchCustomEvent('syncdata');
			})
			.catch((error) => {
				this.isError = true;
				this.showErrorToast(LABELS.ToastErrorTitle, JSON.stringify(error));
			})
			.finally(() => {
				this.showSpinner(false);
			});
	}

	createPicklistOption(label, value) {
		return { label: label, value: value };
	}

	showSpinner(value) {
		this.state.isLoading = value;
	}

	showSuccessToast(title, message) {
		this.dispatchEvent(
			new ShowToastEvent({
				title: title,
				message: message,
				variant: 'success',
			})
		);
	}

	showErrorToast(title, message) {
		this.dispatchEvent(
			new ShowToastEvent({
				title: title,
				message: message,
				variant: 'error',
			})
		);
	}

	dispatchCustomEvent(name, detail = undefined) {
		this.dispatchEvent(
			new CustomEvent(name, {
				detail: detail,
			})
		);
	}

	handleMemberNameChange(event) {
		this.state.newMember.name = event.detail.value;
	}

	handleMemberSkillsChange(event) {
		this.state.newMember.skills = event.detail.value;
	}

	handleMemberTeamChange(event) {
		this.state.newMember.teamId = event.detail.value;
	}

	get newMember() {
		return this.state.newMember;
	}

	get isLoading() {
		return this.state.isLoading;
	}

	get showContent() {
		return !(this.state.isLoading || this.state.isError);
	}
}
