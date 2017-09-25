import { Component, OnInit } from '@angular/core';
import { TeamService } from "../team.service";
import { Team } from "../team";

@Component({
  selector: 'app-dashboard',
  templateUrl: './dashboard.component.html',
  styleUrls: ['./dashboard.component.css']
})
export class DashboardComponent implements OnInit {
  private teams: Team[];

  constructor(private teamService: TeamService) { }

  getTeams () {
    this.teamService.getTeams().then(teams => this.teams = teams.slice(0, 4));
  }

  ngOnInit(): void {
    this.getTeams();
  }

}
