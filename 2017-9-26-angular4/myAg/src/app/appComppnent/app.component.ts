import { Component } from '@angular/core';
import { HeroService } from '../servic/hero.service';
import { OnInit } from '@angular/core';
console.log(HeroService);

export class Hero {
  id: number;
  name: string;
}

const HEROES: Hero[] = [
  { id: 11, name: 'Mr. Nice' },
  { id: 12, name: 'Narco' },
  { id: 13, name: 'Bombasto' },
  { id: 14, name: 'Celeritas' },
  { id: 15, name: 'Magneta' },
  { id: 16, name: 'RubberMan' },
  { id: 17, name: 'Dynama' },
  { id: 18, name: 'Dr IQ' },
  { id: 19, name: 'Magma' },
  { id: 20, name: 'Tornado' }
];

@Component({
  selector: 'my-app',
  template:  `
  <h1>{{title}}</h1>
  <h2>{{hero.name}} details!</h2>
  <div><label>id: </label><input [(ngModel)]="hero.name" placeholder="name"></div>
  <div><label>name: </label>{{hero.name}}</div>
  <div>
    <label>name: </label>
  </div>
  <ul class="heroes">
    <li *ngFor="let hero of heroes" 
    (click)="onSelect(hero)"
    [class.selected]="hero === selectedHero">
      <span class="badge">{{hero.id}}</span> {{hero.name}}
    </li>
  </ul>
  <div *ngIf="selectedHero">
    <label>name: </label>
    <input [(ngModel)]="selectedHero.name" placeholder="name"/>
  </div>
  <br>
  <span>下面是一个组件</span>
  <hero-detail [aacc]="selectedHero"></hero-detail>
  `,
  styleUrls: ['./app.one.scss'],
  providers: [HeroService]
})

export class AppComponent implements OnInit  {
  name = 'Angular';
  title = '邵晓华 of Heroes';
  hero: Hero = {
    id: 1,
    name: '邵晓华'
  };
  selectedHero: Hero;

  constructor(private heroService: HeroService) { };
  getHeroes(): void {
    this.heroService.getHeroes().then(heroes => this.heroes = heroes);
  }
 
  ngOnInit(): void {
    this.getHeroes();
  }
  heroes: Hero[];
  onSelect(hero: Hero): void {
    console.log(hero);
    this.hero = hero;
    this.selectedHero = hero;
    console.log(this.selectedHero);
  }
}
