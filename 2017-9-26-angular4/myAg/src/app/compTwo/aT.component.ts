import { Component, Input } from '@angular/core';

import { Hero } from './hero'; // 引入自己的文件类

@Component({
 selector: 'hero-detail',
 template: `
	 <div *ngIf="aacc">
		 <h2>{{aacc.name}} details!</h2>
		 <div><label>id: </label>{{aacc.id}}</div>
		 <div>
			 <label>name: </label>
			 <input [(ngModel)]="aacc.name" placeholder="name"/>
		 </div>
	 </div>
 `
})
export class HeroDetailComponent {
 @Input() aacc: Hero;
}