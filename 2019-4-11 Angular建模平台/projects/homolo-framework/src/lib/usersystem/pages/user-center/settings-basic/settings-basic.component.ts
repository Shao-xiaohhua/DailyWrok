import { Component, OnInit } from '@angular/core';
import { UserService } from '../../../services/user.service';
import { DomSanitizer } from '@angular/platform-browser';

@Component({
  selector: 'hf-settings-basic',
  templateUrl: './settings-basic.component.html',
  styleUrls: ['../../../../../assets/scss/homolo-framework.scss']
})
export class SettingsBasicComponent implements OnInit {
  user: any;
  nameSwitch = false;
  nickSwitch = false;
  emailSwitch = false;
  mobileSwitch = false;
  imageHeader =
    'https://gw.alipayobjects.com/zos/antfincdn/XAosXuNZyF/BiazfanxmamNRoxxVxka.png';

  constructor(private userService: UserService, public domSanitizer: DomSanitizer) {}
  ngOnInit() {
    this.user = this.userService.currentUser;
  }
  submitForm(): void {
    if (!this.user.userName) {
      this.nameSwitch = true;
    }
    if (!this.user.nickName) {
      this.nickSwitch = true;
    }
    if (!this.user.email) {
      this.emailSwitch = true;
    }
    if (!this.user.mobile) {
      this.mobileSwitch = true;
    }
    console.log(this.user);
  }

  fileChange(e) {
    const file = e.srcElement.files; // 获取图片这里只操作一张图片
    this.imageHeader = window.URL.createObjectURL(file[0]); // 获取上传的图片临时路径
  }
}
