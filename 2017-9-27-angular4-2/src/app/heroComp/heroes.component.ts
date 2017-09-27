import { Component, OnInit } from '@angular/core';
import { Router }            from '@angular/router';

import { HeroService } from '../servic/hero.service';
console.log(HeroService);

export class Hero {
  id: number;
  name: string;
}

@Component({
  selector: 'my-heroes',
  templateUrl: './heroes.component.html',
  styleUrls: ['./hero.scss']
  // providers: [HeroService] // 获取服务必须添加 被移到模块后就不用再添加了
})

export class HeroesComponent implements OnInit  {  // 类的接口
  name = 'Angular';
  title = '邵晓华 of Heroes';
  hero: Hero = {
    id: 1,
    name: '邵晓华'
  };
  selectedHero: Hero;
  heroes: Hero[];
  
  constructor(
    private heroService: HeroService,
    private router: Router
  ) { }; // ts 类

  getHeroes(): void {
    this.heroService.getHeroes().then(heroes => this.heroes = heroes);
  }
  ngOnInit(): void {
    console.log(1);
    this.getHeroes();
  }
  onSelect(hero: Hero): void {
    console.log(hero);
    this.hero = hero;
    this.selectedHero = hero;
    console.log(this.selectedHero);
  }

  gotoDetail(): void {
    this.router.navigate(['/detail', this.selectedHero.id]);
  }
}
