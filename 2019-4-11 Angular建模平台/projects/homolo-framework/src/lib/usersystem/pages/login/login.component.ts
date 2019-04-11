import { User } from '../../models/user';
import { Role } from '../../models/role';
import { Component, OnInit } from '@angular/core';
import { KeyEncrypt } from '../../../utils/key-encrypt-utils';
import { RestClient } from '../../../core/services/rest-client.service';
import { UserService } from '../../services/user.service';
import { MenuService } from '../../../toolkit/services/menu.service';
import { Menu } from '../../../toolkit/models/menu';
import { SecurityService } from '../../../core/services/security.service';
import { NzMessageService } from 'ng-zorro-antd';
import { Router } from '@angular/router';
@Component({
  selector: 'hf-login',
  templateUrl: './login.component.html',
  styleUrls: ['../../../../assets/scss/homolo-framework.scss']
})
export class LoginComponent implements OnInit {
  constructor(
    private userService: UserService,
    private menuService: MenuService,
    private securityService: SecurityService,
    private restClient: RestClient,
    private message: NzMessageService,
    private router: Router
  ) {}

  public passwordVisible = false;
  public newPawVisible = false;
  public comPawVisible = false;
  isShowCodeInput = false; // 是否修改验证码
  isShowChangePassword = false; // 修改密码视图
  changeCodeImg = true;
  flag = true;
  submitFlag = true;
  changePwdFlag = true;
  userLogin = {
    name: {
      content: '',
      swite: false,
      error: '请输入用户名!'
    },
    password: {
      content: '',
      swite: false,
      error: '请输入密码!'
    },
    code: {
      content: '',
      swite: false,
      error: '请输入验证码！'
    },
    rememberMe: false
  };
  changePaw = {
    newPaw: {
      content: '',
      swite: false,
      error: '请输入新密码!'
    },
    comPaw: {
      content: '',
      swite: false,
      error: '请再次输入新密码!'
    }
  };
  tabBarStyle = {
    margin: '24px',
    'font-size': '12px'
  };
  ngOnInit() {}
  // 提交表单
  submit(): void {
    if (!this.userLogin.name.content) {
      this.userLogin.name.swite = true;
      return;
    }
    if (!this.userLogin.password.content) {
      this.userLogin.password.swite = true;
      return;
    }
    if (!this.userLogin.code.content && this.isShowCodeInput) {
      this.userLogin.code.swite = true;
      this.getChangeCodeImg();
      return;
    }
    const encryptedPassword = new KeyEncrypt().encrypt(
      this.userLogin.password.content,
      this.securityService.publicKey
    );
    this.userLogin.password.content = encryptedPassword;
    const opts = {
      username: this.userLogin.name.content,
      password: encryptedPassword,
      'remember-me': '' + this.userLogin.rememberMe + '',
      responseType: 'json',
      code: null
    };
    console.log(opts);
    if (this.isShowCodeInput) {
      opts.code = this.userLogin.code.content;
    }
    const params = opts;
    if (this.submitFlag) {
      this.submitFlag = false;
      this.restClient
        .submitFormData(this.restClient.getContextPath() + '/login', params)
        .then(response => {
          setTimeout(() => {
            this.submitFlag = true;
          }, 500);
          const { code } = response;
          if (code === 401) {
            this.userLogin.password.content = '';
            const { showCode, disabled, locked, mustChangePassword } = response;
            if (!showCode) {
              if (mustChangePassword) {
                this.isShowChangePassword = true;
                this.changePaw.newPaw.content = '';
                this.changePaw.comPaw.content = '';
                return;
              }
              if (disabled) {
                this.message.create(
                  'error',
                  `登陆失败，该用户已被禁用,请联系管理员！`
                );
                return;
              }
              if (locked) {
                this.message.create(
                  'error',
                  `登陆失败，该用户已被锁定，请联系管理员！`
                );
                return;
              }
              this.message.create('error', `登陆失败，用户名或密码错误！`);
            }
            if (showCode) {
              this.isShowCodeInput = true;
              this.getChangeCodeImg();
              const { codeError, error } = response;
              if (codeError) {
                this.userLogin.code = {
                  content: '',
                  swite: true,
                  error
                };
              }
              if (!codeError) {
                this.message.create('error', `登陆失败，用户名或密码错误！`);
              }
            }
          }
          if (code === 200) {
            this.message.create('success', `恭喜你，登陆成功！`);
            const roles = new Array<Role>();
            response.roles.forEach(r => {
              roles.push(new Role(r.id, r.name));
            });
            const u = response.user;
            const user = new User(
              u.userId,
              u.personId,
              u.userName,
              u.nickName,
              u.email,
              u.avatar,
              u.mobile,
              u.anonymous,
              roles
            );
            console.log('data:', response, user);
            if (this.menuService.getMenu()) {
              this.menuService.getMenu().reloadRequired = true;
            }
            this.userService.currentUser = user;
            this.router.navigateByUrl('/workbench'); // 跳转到workbench页面
          }
        })
        .catch(() => {
          setTimeout(() => {
            this.submitFlag = true;
          }, 500);
        });
    }
  }
  inputSubmit(event: { keyCode: any }): void {
    const code = event.keyCode;
    if (code === 13) {
      this.submit();
    }
  }
  submitMobileForm(): void {
    console.log('222');
  }
  isShowCode() {
    this.getChangeCodeImg();
    const params = {
      username: this.userLogin.name.content
    };
    if (!this.flag) {
      return;
    } else {
      this.flag = false;
      this.restClient
        .post('/api/user/checkShouldShowCode', params)
        .then(response => {
          setTimeout(() => {
            this.flag = true;
          }, 500);
          const { result } = response;
          if (result) {
            this.isShowCodeInput = true;
          } else {
            this.isShowCodeInput = false;
          }
        })
        .catch(() => {
          setTimeout(() => {
            this.flag = true;
          }, 500);
        });
    }
  }
  /**
   * 强制修改密码点击确认的函数
   */
  changePawCom() {
    if (!this.changePaw.newPaw.content) {
      this.changePaw.newPaw.swite = true;
      this.changePaw.newPaw.error = '请输入新密码！';
      return;
    }
    if (!this.changePaw.comPaw.content) {
      this.changePaw.comPaw.swite = true;
      this.changePaw.comPaw.error = '请再次输入新密码';
      return;
    }
    if (this.changePaw.newPaw.content !== this.changePaw.comPaw.content) {
      this.changePaw.comPaw.swite = true;
      this.changePaw.comPaw.error = '前后密码不一致，请重新输入';
      return;
    }

    const params = {
      password: this.changePaw.newPaw.content,
      rePassword: this.changePaw.comPaw.content
    };
    if (this.changePwdFlag) {
      this.changePwdFlag = false;
      this.restClient
        .post('/api/user/changePasswordByToken', params)
        .then(response => {
          // console.log(response);
          setTimeout(() => {
            this.changePwdFlag = true;
          }, 500);
          const { code } = response;
          if (code === 1) {
            this.message.create('success', `修改密码成功，请重新登陆！`);
            this.isShowChangePassword = false;
          }
          if (code !== 1) {
            const { description } = response;
            this.message.create('error', `修改密码失败，${description}`);
          }
        })
        .catch(() => {
          setTimeout(() => {
            this.changePwdFlag = true;
          }, 500);
        });
    }
  }
  /**
   * 刷新验证码函数
   */
  getChangeCodeImg() {
    this.changeCodeImg = false;
    setTimeout(() => {
      this.changeCodeImg = true;
    }, 0);
  }
}
