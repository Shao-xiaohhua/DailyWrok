import { BrowserModule } from '@angular/platform-browser';
import { NgModule } from '@angular/core';
import { FormsModule } from "@angular/forms";
import { RouterModule } from "@angular/router";

import { AppComponent } from './app.component';
import { TeamDetailComponent } from './team-detail/team-detail.component';
import { TeamsComponent } from './teams/teams.component';
import { TeamService } from "./team.service";
import { DashboardComponent } from './dashboard/dashboard.component';

@NgModule({
  declarations: [
    AppComponent,
    TeamDetailComponent,
    TeamsComponent,
    DashboardComponent,
],
  imports: [
    BrowserModule,
    FormsModule,
    RouterModule.forRoot([
      {
        path: '',
        redirectTo: 'dashboard',
        pathMatch: 'full'
      },
      {
        path: 'dashboard',
        component: DashboardComponent
      },
      {
        path: 'teams',
        component: TeamsComponent
      }
    ])
  ],
  providers: [TeamService],
  bootstrap: [AppComponent]
})
export class AppModule { }
