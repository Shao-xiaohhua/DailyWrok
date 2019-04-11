import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';
import { LoginComponent } from './usersystem/pages/login/login.component';
import { SignupComponent } from './usersystem/pages/signup/signup.component';
import { DefaultLayoutComponent } from './layouts/default-layout.component';
import { DefaultDashboardComponent } from './layouts/dashboard/default-dashboard.component';
// 个人中心
import { UserCenterComponent } from './usersystem/pages/user-center/user-center.component';
// 个人设置
import { UserSettingsComponent } from './usersystem/pages/user-center/user-settings.component';
// 个人设置基本设置
import { SettingsBasicComponent } from './usersystem/pages/user-center/settings-basic/settings-basic.component';
// 个人设置新消息设置
import { SettingsNotificationComponent } from './usersystem/pages/user-center/settings-notification/settings-notification.component';
// 个人设置安全设置
import { SettingsSecurityComponent } from './usersystem/pages/user-center/settings-security/settings-security.component';
import { Error403Component } from './result/error403/error403.component';
import { Error404Component } from './result/error404/error404.component';
import { Error500Component } from './result/error500/error500.component';
import { SuccessComponent } from './result/success/success.component';
import { FailComponent } from './result/fail/fail.component';
import { FromCheckComponent } from './form/from-check/from-check.component';

import { AuthGuardService } from './core/services/auth-guard.service';
// 图表页
import { AnalysisComponent } from './dashboard/analysis/analysis.component';
// 用户管理
import { UserManagementComponent } from './system/user-management/user-management.component';

const routes: Routes = [
  {
    path: 'login', // 登录
    component: LoginComponent
  },
  {
    path: 'sign', // 注册
    component: SignupComponent
  },
  {
    path: 'workbench', // 布局
    canActivate: [AuthGuardService],
    component: DefaultLayoutComponent,
    children: [
      {
        path: 'dashboard',
        component: DefaultDashboardComponent
      },
      {
        path: 'signup',
        component: SignupComponent
      },
      {
        path: 'usercenter',
        component: UserCenterComponent
      },
      {
        path: 'error403',
        component: Error403Component
      },
      {
        path: 'error404',
        component: Error404Component
      },
      {
        path: 'error500',
        component: Error500Component
      },
      {
        path: 'success',
        component: SuccessComponent
      },
      {
        path: 'fail',
        component: FailComponent
      },
      {
        path: 'fromCheck',
        component: FromCheckComponent
      },
      {
        path: 'analysis',
        component: AnalysisComponent
      },
      {
        path: 'usersettings',
        component: UserSettingsComponent,
        children: [
          {
            path: 'basic',
            component: SettingsBasicComponent
          },
          {
            path: 'notification',
            component: SettingsNotificationComponent
          },
          {
            path: 'security',
            component: SettingsSecurityComponent
          }
        ]
      },
      {
        path: 'userManagement',
        component: UserManagementComponent
      }
    ]
  }
];

@NgModule({
  imports: [RouterModule.forRoot(routes)],
  providers: [AuthGuardService]
})
export class FrameworkRoutingModule {}
