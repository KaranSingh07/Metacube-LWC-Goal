public with sharing class TeamService {
	private static final Type impl = TeamServiceImpl.class;

	@TestVisible
	private static final API mockImpl;

	public interface API {
		List<TeamService.TeamWrapper> getTeams();
		void createTeamMember(TeamService.TeamMemberWrapper teamMember);
		List<TeamService.TeamMemberWrapper> getAllTeamMembers();
	}

	private static API service() {
		return mockImpl != null ? mockImpl : (API) impl.newInstance();
	}

	public static List<TeamService.TeamWrapper> getTeams() {
		return service().getTeams();
	}

	public static void createTeamMember(TeamService.TeamMemberWrapper teamMember) {
		service().createTeamMember(teamMember);
	}

	public static List<TeamService.TeamMemberWrapper> getAllTeamMembers() {
		return service().getAllTeamMembers();
	}

	public class TeamWrapper {
		@AuraEnabled
		public String Id;

		@AuraEnabled
		public String Name;

		public TeamWrapper(Team__c team) {
			this.Id = team.Id;
			this.Name = team.Name;
		}
	}

	public class TeamMemberWrapper {
		@AuraEnabled
		public String Id;

		@AuraEnabled
		public String Name;

		@AuraEnabled
		public String Skills;

		@AuraEnabled
		public String TeamId;

		@AuraEnabled
		public String TeamName;

		public TeamMemberWrapper(TeamMember__c teamMember) {
			this.Id = teamMember.Id;
			this.Name = teamMember.Name;
			this.Skills = teamMember.Skills__c;
			this.TeamId = teamMember.Team__r.Id;
			this.TeamName = teamMember.Team__r.Name;
		}
	}
}
