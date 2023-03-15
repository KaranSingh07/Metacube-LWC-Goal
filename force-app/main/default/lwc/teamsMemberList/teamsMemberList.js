import { LightningElement, track, api } from 'lwc';
import { ShowToastEvent } from 'lightning/platformShowToastEvent';
import { LABELS } from './labels';
import getAllTeamMembers from '@salesforce/apex/TeamController.getAllTeamMembers';

export default class TeamsMemberList extends LightningElement {
	@api get teams() {
		return this.state.teams;
	}
	set teams(value) {
		this.state.teams = value;
	}

	// If new team members are created from teamsCreateMember, then sync data from Apex.
	// Otherwise use the cached data to improve performance and reduce queries.
	@api async syncData() {
		this.showSpinner(true);
		this.resetComponent();
		await this.prepareTeamMembers().then(() => {
			this.showSuccessToast(LABELS.ToastSuccessTitle, LABELS.TeamMembersSynced);
		});
	}

	@track state = {
		teams: [],
		allTeamMembers: [],
		selectedTeamId: '',
		filteredTeamMembers: [],
		isLoading: true,
		isError: false,
	};

	async connectedCallback() {
		this.showSpinner(true);
		await this.prepareTeamMembers();
	}

	async prepareTeamMembers() {
		await getAllTeamMembers()
			.then((data) => {
				this.state.allTeamMembers = data;
			})
			.catch((error) => {
				this.state.isError = true;
				this.showErrorToast(LABELS.ToastErrorTitle, JSON.parse(JSON.stringify(error)));
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

	handleTeamChange(event) {
		this.state.selectedTeamId = event.detail.value;
		this.state.filteredTeamMembers = this.state.allTeamMembers.filter((teamMember) => {
			return teamMember.TeamId === this.state.selectedTeamId;
		});
	}

	resetComponent() {
		this.state.selectedTeamId = '';
		this.state.filteredTeamMembers = [];
	}

	get isTeamSelected() {
		return this.state.selectedTeamId && this.state.selectedTeamId.length;
	}

	get filteredTeamMembers() {
		return this.state.filteredTeamMembers;
	}

	get showTeamMembers() {
		return this.isTeamSelected && this.filteredTeamMembers && this.filteredTeamMembers.length;
	}

	get warningMessage() {
		return !this.isTeamSelected
			? LABELS.NoTeamSelectedWarning
			: LABELS.NoTeamMembersExistsWarning;
	}

	get isLoading() {
		return this.state.isLoading;
	}

	get showContent() {
		return !(this.state.isLoading || this.state.isError);
	}
}
