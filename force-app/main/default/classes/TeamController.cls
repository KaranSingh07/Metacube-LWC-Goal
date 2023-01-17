public with sharing class TeamController {
	@AuraEnabled
	public static List<TeamService.TeamWrapper> getTeams() {
		return TeamService.getTeams();
	}

	@AuraEnabled
	public static List<TeamService.TeamMemberWrapper> getAllTeamMembers() {
		return TeamService.getAllTeamMembers();
	}
}
