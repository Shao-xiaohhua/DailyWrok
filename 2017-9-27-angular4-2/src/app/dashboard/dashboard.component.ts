import { Component, OnInit } from '@angular/core';

import { HeroService } from '../servic/hero.service';
import { Hero } from '../compTwo/hero';

@Component({
  selector: 'my-dashboard',
  templateUrl: './dashboard.component.html',
  styleUrls: [ './dashboard.component.css' ]
})

export class DashboardComponent implements OnInit {
    heroes: Hero[] = [];

    constructor(private heroService: HeroService) { }

    ngOnInit(): void {
    this.heroService.getHeroes()
        .then((heroes) => {
            console.log(heroes );
            return this.heroes = heroes.slice(1, 5);
        });
    }
}