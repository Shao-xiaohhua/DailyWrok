import { Component, OnInit, AfterViewInit, OnDestroy } from '@angular/core';
import { ActivatedRoute, ParamMap, Router, NavigationEnd } from '@angular/router';
import { NzMessageService } from 'ng-zorro-antd';

import { MetaLoader } from './services/meta-loader.service';
import { Business } from './models/business';
import { View } from './models/view';
import { Type } from './models/type';

import { Subscription, pipe } from 'rxjs';
import { filter, switchMap } from 'rxjs/operators';
import { Entity } from './models/entity';

@Component({
  selector: 'dm-business',
  templateUrl: './business.component.html'
})
export class BusinessComponent implements OnInit, AfterViewInit, OnDestroy {

  business: Business;
  config: object = {};
  reload = true;
  subscriptionInit: Subscription;
  subscriptionAfterView: Subscription;
  entity: Entity;
  constructor(
    private route: ActivatedRoute,
    private router: Router,
    private message: NzMessageService
  ) {
  }

  ngOnInit() {
    // this.entityId = this.route.snapshot.queryParams['entityId'];
    this.config = this.route.snapshot.queryParams;
    this.subscriptionInit = this.route.paramMap.pipe(
      switchMap((params: ParamMap) => {
        const business = MetaLoader.loadBusiness(params.get('name'));
        if (business == null) {
          this.message.error('未找到业务');
        }
        return Promise.resolve(business);
      })
    ).subscribe(business => this.business = business);
  }

  ngAfterViewInit() {
    // 监听路由变化
    this.subscriptionAfterView = this.router.events
      .pipe(filter((event) => event instanceof NavigationEnd))
      /* .filter((event) => event instanceof NavigationEnd) */
      .subscribe((event: NavigationEnd) => {
        // 重新渲染页面
        this.reload = false;
        setTimeout(() => this.reload = true);
      });
  }

  ngOnDestroy() {
    this.subscriptionInit.unsubscribe();
    this.subscriptionAfterView.unsubscribe();
  }

  get view(): View {
    return MetaLoader.loadType(this.business.typeName).getView(this.business.view).definition;
  }

  get type(): Type {
    return MetaLoader.loadType(this.business.typeName);
  }
}
