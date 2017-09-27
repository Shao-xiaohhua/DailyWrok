import { Injectable } from '@angular/core';

import { Hero } from '../compTwo/hero';
import { HEROES } from '../mock-heroes';

@Injectable()
export class HeroService {
  getHeroes(): Promise<Hero[]> {
    return Promise.resolve(HEROES);
  }
  getHeroesSlowly(): Promise<Hero[]> {
    return new Promise(resolve => {
      // Simulate server latency with 2 second delay
      setTimeout(() => resolve(this.getHeroes()), 2000);
    });
  }
  getHero(id: number): Promise<Hero> {   // 通过id 返回数据
    return this.getHeroes()
               .then(heroes => heroes.find(hero => hero.id === id)); // 对比ID返回相同对象
  }
}