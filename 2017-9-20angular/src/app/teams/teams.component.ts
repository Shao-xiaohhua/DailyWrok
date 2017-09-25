import { Component, OnInit } from '@angular/core';
import { Team } from "../team";
import { TeamService } from "../team.service";

@Component({
  selector: 'app-teams',
  templateUrl: './teams.component.html',
  styleUrls: ['./teams.component.scss']
})
export class TeamsComponent implements OnInit {
  private selectTeam: Team;
  private teams: Team[];

  constructor (private teamService: TeamService) {}

  getTeams (): void {
    this.teamService.getTeams().then(teams => this.teams = teams);
  }

  ngOnInit (): void {
    this.getTeams();
  }

  showDetail (team: Team): void {
    this.selectTeam = team;
  }
}
