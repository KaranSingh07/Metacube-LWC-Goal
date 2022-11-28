import { LightningElement, track } from 'lwc';

export default class Teams extends LightningElement {
	@track state = {
		teams: [],
	};

	handleUpdateTeams(event) {
		this.state.teams = event.detail.teams;
	}

	handleSyncData() {
		const teamsMemberListComponent = this.template.querySelector('c-teams-member-list');
		if (teamsMemberListComponent) teamsMemberListComponent.syncData();
	}

	get teams() {
		return this.state.teams;
	}
}
