public with sharing class TeamServiceImpl implements TeamService.API {
	public List<TeamService.TeamWrapper> getTeams() {
		List<TeamService.TeamWrapper> teams = new List<TeamService.TeamWrapper>();
		for (Team__c team : TeamSelector.getInstance().getTeams()) {
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
		for (TeamMember__c teamMember : TeamSelector.getInstance().getTeamMembersWithTeams()) {
			teamMembers.add(new TeamService.TeamMemberWrapper(teamMember));
		}
		return teamMembers;
	}
}
