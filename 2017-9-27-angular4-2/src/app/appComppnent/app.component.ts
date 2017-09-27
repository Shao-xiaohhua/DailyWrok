import { Component } from '@angular/core';

@Component({
 selector: 'my-app',
 template: `
   <h1>{{title}}</h1>
   <nav>
   <a routerLink="/dashboard" routerLinkActive="active">链接一</a>
   <a routerLink="/heroes" routerLinkActive="active">链接二</a>
  </nav>
   <router-outlet></router-outlet>
 `,
 styleUrls: ['./app.component.css']
})
export class AppComponent {
 title = 'Tour of Heroes';
}