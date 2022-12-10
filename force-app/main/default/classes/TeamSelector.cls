public with sharing class TeamSelector {
	private static TeamSelector instance;

	public static TeamSelector getInstance() {
		if (instance == null)
			instance = new TeamSelector();
		return instance;
	}

	public List<Team__c> getTeams() {
		return (List<Team__c>) [SELECT Id, Name FROM Team__c];
	}

	public List<TeamMember__c> getTeamMembersWithTeams() {
		return (List<TeamMember__c>) [
			SELECT Id, Name, Skills__c, Team__r.Id, Team__r.Name
			FROM TeamMember__c
			ORDER BY Name ASC
		];
	}
}
