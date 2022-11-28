public with sharing class TeamController {
	@AuraEnabled
	public static List<TeamService.TeamWrapper> getTeams() {
		return TeamService.getTeams();
	}

	@AuraEnabled
	public static void createTeamMember(String teamMemberJson) {
		TeamService.TeamMemberWrapper teamMember = (TeamService.TeamMemberWrapper) JSON.deserialize(
			teamMemberJson,
			TeamService.TeamMemberWrapper.class
		);
		TeamService.createTeamMember(teamMember);
	}

	@AuraEnabled
	public static List<TeamService.TeamMemberWrapper> getAllTeamMembers() {
		return TeamService.getAllTeamMembers();
	}
}
