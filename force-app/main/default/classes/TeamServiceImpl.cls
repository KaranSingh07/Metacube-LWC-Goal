public with sharing class TeamServiceImpl implements TeamService.API {
	public List<TeamService.TeamWrapper> getTeams() {
		List<TeamService.TeamWrapper> teams = new List<TeamService.TeamWrapper>();
		for (Team__c team : [SELECT Id, Name FROM Team__c]) {
			teams.add(new TeamService.TeamWrapper(team));
		}
		return teams;
	}

	public void createTeamMember(TeamService.TeamMemberWrapper teamMember) {
		insert new TeamMember__c(
			Name = teamMember.Name,
			Skills__c = teamMember.Skills,
			Team__c = teamMember.TeamId
		);
	}

	public static List<TeamService.TeamMemberWrapper> getAllTeamMembers() {
		List<TeamService.TeamMemberWrapper> teamMembers = new List<TeamService.TeamMemberWrapper>();
		for (TeamMember__c teamMember : [
			SELECT Id, Name, Skills__c, Team__r.Id, Team__r.Name
			FROM TeamMember__c
			ORDER BY Name ASC
		]) {
			teamMembers.add(new TeamService.TeamMemberWrapper(teamMember));
		}
		return teamMembers;
	}
}
