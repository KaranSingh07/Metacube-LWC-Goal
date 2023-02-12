/*
 * @copyright 2022 FinancialForce.com, inc. All rights reserved.
 */
import { LightningElement, api } from 'lwc';
import HTML from './teamsMemberList.tmpl.html';

export default class TeamsMemberList extends LightningElement {
	render() {
		return HTML;
	}

	state = {
		teams: [],
	};

	@api get teams() {
		return this.state.teams;
	}
	set teams(value) {
		this.state.teams = value;
	}
}
