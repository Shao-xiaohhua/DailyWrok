import { Component, OnInit } from '@angular/core';
import {
  ChangeDetectionStrategy,
  ChangeDetectorRef,
  ElementRef
} from '@angular/core';
import { Router, ActivationEnd } from '@angular/router';
import { fromEvent, Subscription } from 'rxjs';
import { filter, debounceTime } from 'rxjs/operators';

@Component({
  selector: 'hf-user-settings',
  templateUrl: './user-settings.component.html',
  styleUrls: ['../../../../assets/scss/homolo-framework.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class UserSettingsComponent implements OnInit {
  private resize$: Subscription;
  private router$: Subscription;
  mode = 'inline';
  title = '基本设置';
  user: any;
  menus: any[] = [
    {
      key: 'basic',
      title: '基本设置'
    },
    {
      key: 'security',
      title: '安全设置'
    },
    {
      key: 'notification',
      title: '新消息通知'
    }
  ];
  // menuActive: number = 0;
  constructor(
    private router: Router,
    private cdr: ChangeDetectorRef,
    private el: ElementRef,
    private route: Router
  ) {}
  ngOnInit() {
    console.log(this.route.url);
    const url = this.route.url;
    if (url === '/workbench/usersettings/basic') {
      this.menus[0].selected = true;
    }
    if (url === '/workbench/usersettings/security') {
      this.menus[1].selected = true;
    }
    if (url === '/workbench/usersettings/notification') {
      this.menus[2].selected = true;
    }
  }

  to(item: any) {
    this.title = item.title;
    this.router.navigateByUrl(`/workbench/usersettings/${item.key}`);
  }

  private resize() {
    const el = this.el.nativeElement as HTMLElement;
    let mode = 'inline';
    const { offsetWidth } = el;
    if (offsetWidth < 641 && offsetWidth > 400) {
      mode = 'horizontal';
    }
    if (window.innerWidth < 768 && offsetWidth > 400) {
      mode = 'horizontal';
    }
    this.mode = mode;
    this.cdr.detectChanges();
  }

  // ngAfterViewInit(): void {
  //   this.resize$ = fromEvent(window, 'resize')
  //     .pipe(debounceTime(200))
  //     .subscribe(() => this.resize());
  // }
}
