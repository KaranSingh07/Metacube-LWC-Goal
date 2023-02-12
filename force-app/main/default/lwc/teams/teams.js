import { LightningElement, track } from 'lwc';
import { ShowToastEvent } from 'lightning/platformShowToastEvent';
import { LABELS } from './labels';
import getTeams from '@salesforce/apex/TeamController.getTeams';

export default class Teams extends LightningElement {
	@track state = {
		teams: [],
		isLoading: true,
		isError: false,
	};

	async connectedCallback() {
		this.showSpinner(true);
		await this.populateTeamOptions();
	}

	async populateTeamOptions() {
		await getTeams()
			.then((data) => {
				this.createTeamOptions(data);
			})
			.catch((error) => {
				this.state.isError = true;
				this.showErrorToast(LABELS.ToastErrorTitle, error.body.message);
			})
			.finally(() => {
				this.showSpinner(false);
			});
	}

	createTeamOptions(teamData) {
		let teamOptions = [];
		teamData.forEach((team) => {
			teamOptions.push(this.createPicklistOption(team.Name, team.Id));
		});
		this.state.teams = teamOptions;
	}

	createPicklistOption(label, value) {
		return { label: label, value: value };
	}

	showSpinner(value) {
		this.state.isLoading = value;
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

	handleSyncData() {
		const teamsMemberListComponent = this.template.querySelector('c-teams-member-list');
		if (teamsMemberListComponent) teamsMemberListComponent.syncData();
	}

	get teams() {
		return this.state.teams;
	}

	get showContent() {
		return !(this.state.isLoading || this.state.isError);
	}
}
