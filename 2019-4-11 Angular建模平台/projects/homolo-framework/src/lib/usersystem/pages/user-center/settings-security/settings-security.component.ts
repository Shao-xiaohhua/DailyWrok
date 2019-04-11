import { Component, OnInit } from '@angular/core';
import { RestClient } from '../../../../core/services/rest-client.service';
import { NzMessageService } from 'ng-zorro-antd';
import { Router } from '@angular/router';
import { UserService } from '../../../services/user.service';

@Component({
  selector: 'hf-settings-security',
  templateUrl: './settings-security.component.html',
  styleUrls: ['../../../../../assets/scss/homolo-framework.scss']
})
export class SettingsSecurityComponent implements OnInit {
  public newPawVisible = false;
  public comPawVisible = false;
  public otherPawVisible = false;
  isVisible = false;
  oldError = false;
  newError = false;
  otherError = false;
  oldPassword = '';
  newPassword = '';
  repeatPassword = '';
  oldErrorContent = '';
  newErrorContent = '';
  otherErrorContent = '';

  constructor(
    private restClient: RestClient,
    private message: NzMessageService,
    private userService: UserService,
    private router: Router
  ) {}

  ngOnInit() {}
  showModal(): void {
    this.isVisible = true;
  }

  handleOk(): void {
    if (!this.oldPassword) {
      this.oldError = true;
      this.oldErrorContent = '请输入旧密码';
      return;
    }
    if (this.oldPassword.length < 6) {
      this.oldError = true;
      this.oldErrorContent = '输入的密码不得少于六位数';
      return;
    }
    if (!this.newPassword) {
      this.newError = true;
      this.newErrorContent = '请输入新密码';
      return;
    }
    if (this.newPassword.length < 6) {
      this.newError = true;
      this.newErrorContent = '输入的密码不得少于六位数';
      return;
    }
    if (!this.repeatPassword) {
      this.otherError = true;
      this.otherErrorContent = '请确认新密码';
      return;
    }
    if (this.repeatPassword.length < 6) {
      this.otherError = true;
      this.otherErrorContent = '输入的密码不得少于六位数';
      return;
    }
    if (this.newPassword !== this.repeatPassword) {
      this.otherError = true;
      this.otherErrorContent = '两次输入的密码不匹配';
      return;
    }

    const params = {
      oldPwd: this.oldPassword,
      newPwd: this.newPassword
    };
    this.restClient
      .requestCollection('us.User', 'updateUserPassword', params)
      .then(response => {
        const { code } = response;
        if (code === 1) {
          this.message.create(
            'success',
            `修改密码成功，请使用新密码重新登陆！`
          );
          setTimeout(() => {
            this.userService.logout().then(res => {
              this.router.navigateByUrl('login');
            });
          }, 500);
        }
        if (code !== 1) {
          const { description } = response;
          this.message.create('error', `修改密码失败，${description}`);
        }
      });
  }

  handleCancel(): void {
    this.isVisible = false;
  }
}
