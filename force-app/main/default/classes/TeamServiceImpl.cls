public with sharing class TeamServiceImpl implements TeamService.API {
	public List<TeamService.TeamWrapper> getTeams() {
		List<TeamService.TeamWrapper> teams = new List<TeamService.TeamWrapper>();
		for (Team__c team : TeamSelector.getInstance().getTeams()) {
			teams.add(new TeamService.TeamWrapper(team));
		}
		return teams;
	}

	public static List<TeamService.TeamMemberWrapper> getAllTeamMembers() {
		List<TeamService.TeamMemberWrapper> teamMembers = new List<TeamService.TeamMemberWrapper>();
		for (TeamMember__c teamMember : TeamSelector.getInstance().getTeamMembersWithTeams()) {
			teamMembers.add(new TeamService.TeamMemberWrapper(teamMember));
		}
		return teamMembers;
	}
}
