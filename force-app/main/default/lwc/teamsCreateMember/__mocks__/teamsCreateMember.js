/*
 * @copyright 2022 FinancialForce.com, inc. All rights reserved.
 */
import { LightningElement, api } from 'lwc';
import HTML from './teamsCreateMember.tmpl.html';

export default class TeamsCreateMember extends LightningElement {
	render() {
		return HTML;
	}

	@api teams = [];
}
