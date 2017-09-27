import { Component, Input, OnInit  } from '@angular/core';
import { ActivatedRoute, ParamMap } from '@angular/router';
import { Location }                 from '@angular/common';

import { HeroService } from '../servic/hero.service';

import { Hero } from './hero'; // 引入自己的文件类

import 'rxjs/add/operator/switchMap';

@Component({
 selector: 'hero-detail',
 templateUrl: './hero-detail.component.html'
})
export class HeroDetailComponent implements OnInit {
 @Input() aacc: Hero; // 传入数据

 constructor(
	private heroService: HeroService,
	private route: ActivatedRoute,
	private location: Location
  ) {}

  ngOnInit(): void {
	this.route.paramMap
	  .switchMap((params: ParamMap) => {
      console.log(+params.get('id')); // 路由绑定id 添加+号把字符串转化成数字
			return this.heroService.getHero(+params.get('id')); // 传入ID
		})
	  .subscribe(hero => this.aacc = hero);
  }

  goBack(): void {
	this.location.back();
  }
}