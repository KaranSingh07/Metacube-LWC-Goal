import { api, LightningElement, track } from 'lwc';
import { ShowToastEvent } from 'lightning/platformShowToastEvent';
import { LABELS } from './labels';
import createTeamMember from '@salesforce/apex/TeamController.createTeamMember';

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

		let teamMemberWrapper = {
			Name: this.newMember.name,
			Skills: this.newMember.skills,
			TeamId: this.newMember.teamId,
		};

		await createTeamMember({ teamMemberJson: JSON.stringify(teamMemberWrapper) })
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
