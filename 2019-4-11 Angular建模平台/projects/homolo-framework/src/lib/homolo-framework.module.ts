import { NgModule } from '@angular/core';
import { NgZorroAntdModule, NZ_ICONS, NZ_I18N, zh_CN } from 'ng-zorro-antd';
import { IconDefinition } from '@ant-design/icons-angular';
import { BrowserModule } from '@angular/platform-browser';
import { RouterModule } from '@angular/router';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
import { HttpClientJsonpModule, HttpClientModule } from '@angular/common/http';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';

import { FrameworkRoutingModule } from './homolo-framework-routing.module'; // 登录
import { LoginComponent } from './usersystem/pages/login/login.component'; // 登录
import { DefaultLayoutComponent } from './layouts/default-layout.component'; // 布局
import {
  LockOutline,
  UserOutline,
  SearchOutline
} from '@ant-design/icons-angular/icons';
import { registerLocaleData } from '@angular/common';
import zh from '@angular/common/locales/zh';
import { DefaultDashboardComponent } from './layouts/dashboard/default-dashboard.component';
import { SignupComponent } from './usersystem/pages/signup/signup.component';
import { ModuleWithProviders } from '@angular/compiler/src/core';
import { UserCenterComponent } from './usersystem/pages/user-center/user-center.component';
import { UserSettingsComponent } from './usersystem/pages/user-center/user-settings.component';
import { SettingsBasicComponent } from './usersystem/pages/user-center/settings-basic/settings-basic.component';
import { SettingsNotificationComponent } from './usersystem/pages/user-center/settings-notification/settings-notification.component';
import { SettingsSecurityComponent } from './usersystem/pages/user-center/settings-security/settings-security.component';
import { HeaderNotifyComponent } from './layouts/header-notify/header-notify.component';
import { Error403Component } from './result/error403/error403.component';
import { Error404Component } from './result/error404/error404.component';
import { Error500Component } from './result/error500/error500.component';
import { SuccessComponent } from './result/success/success.component';
import { FailComponent } from './result/fail/fail.component';
import { FromCheckComponent } from './form/from-check/from-check.component';
import { AnalysisComponent } from './dashboard/analysis/analysis.component';
import { UserManagementComponent } from './system/user-management/user-management.component';
registerLocaleData(zh);

const icons: IconDefinition[] = [LockOutline, UserOutline];

@NgModule({
  declarations: [
    DefaultLayoutComponent,
    LoginComponent,
    DefaultDashboardComponent,
    SignupComponent,
    UserCenterComponent,
    UserSettingsComponent,
    SettingsBasicComponent,
    SettingsNotificationComponent,
    SettingsSecurityComponent,
    HeaderNotifyComponent,
    Error403Component,
    Error404Component,
    Error500Component,
    SuccessComponent,
    FailComponent,
    FromCheckComponent,
    AnalysisComponent,
    UserManagementComponent
  ],
  imports: [
    BrowserModule,
    FormsModule,
    ReactiveFormsModule,
    HttpClientModule,
    HttpClientJsonpModule,
    NgZorroAntdModule,
    BrowserAnimationsModule,
    FrameworkRoutingModule,
    RouterModule
  ],
  exports: [DefaultLayoutComponent, LoginComponent, DefaultDashboardComponent],
  providers: [
    { provide: NZ_I18N, useValue: zh_CN },
    { provide: NZ_ICONS, useValue: icons }
  ]
})
export class HomoloFrameworkModule {
  public static forRoot(environment: any): ModuleWithProviders {
    return {
      ngModule: HomoloFrameworkModule,
      providers: [{ provide: 'env', useValue: environment }]
    };
  }
}
