import { RestClient } from '../core/services/rest-client.service';
import {
  Component,
  OnInit,
  TemplateRef,
  ViewChild,
  ElementRef,
  Inject
} from '@angular/core';
import { Router, ChildActivationEnd } from '@angular/router';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { UserService } from '../usersystem/services/user.service';
import { MenuService } from '../toolkit/services/menu.service';
import { User } from '../usersystem/models/user';
import { Menu } from '../toolkit/models/menu';
@Component({
  selector: 'hf-layout-default',
  templateUrl: `./default-layout.component.html`,
  styleUrls: ['../../assets/scss/homolo-framework.scss']
})
export class DefaultLayoutComponent implements OnInit {
  isCollapsed = false;
  showNotifyStatus = false;
  triggerTemplate: TemplateRef<void> | null = null;
  @ViewChild('trigger') customTrigger: TemplateRef<void>;
  @ViewChild('childNotify') childNotify;
  @ViewChild('inputElementShow') inputElementShow: ElementRef;
  currentUser: User;
  avatar: string;
  menu: Menu;
  validateForm: FormGroup;
  visible = false;
  /* public menuList = [
    {
      name: '用户系统',
      icon: 'user',
      open: false,
      children: [
        { name: '登录', url: '/login', active: false },
        { name: '注册', url: '/workbench/signup', active: false }
      ]
    },
    {
      name: '仪表盘',
      icon: 'pie-chart',
      open: false,
      children: [
        { name: '分析页', url: '/workbench/analysis', active: false },
      ]
    },
    {
      name: '列表页',
      icon: 'ordered-list',
      open: false,
      children: [
        { name: '查询表格', url: '/workbench/fromCheck', active: false }
      ]
    },
    {
      name: '异常页',
      icon: 'warning',
      open: false,
      children: [
        { name: '403', url: '/workbench/error403', active: false },
        {
          name: '404',
          url: '/workbench/error404',
          active: false
        },
        {
          name: '500',
          url: '/workbench/error500',
          active: false
        }
      ]
    },
    {
      name: '结果页',
      icon: 'check-circle',
      open: false,
      children: [
        { name: '成功页', url: '/workbench/success', active: false },
        {
          name: '失败页',
          url: '/workbench/fail',
          active: false
        }
      ]
    },
    {
      name: '个人页',
      icon: 'user-delete',
      open: false,
      children: [
        { name: '个人中心', url: '/workbench/usercenter', active: false },
        {
          name: '个人设置',
          url: '/workbench/usersettings/basic',
          active: false
        }
      ]
    },
    {
      name: '系统管理',
      icon: 'user-delete',
      open: false,
      children: [
        { name: '用户管理', url: '/workbench/userManagement', active: false },
      ]
    }
  ]; */
  showInput = false;
  messageNumber = 0;

  changeTrigger(): void {
    this.triggerTemplate = this.customTrigger;
  }

  submitForm(): void {}

  constructor(
    private fb: FormBuilder,
    private router: Router,
    private userService: UserService,
    private menuService: MenuService,
    private restClient: RestClient,
    @Inject('env') private environment
  ) {}

  ngOnInit() {
    this.currentUser = this.userService.currentUser;
    if (this.currentUser && this.currentUser.avatar) {
      this.avatar = this.environment + '/service/rest/tk.File/' + this.currentUser.avatar + '/view';
    } else {
      this.avatar = 'https://gw.alipayobjects.com/zos/antfincdn/XAosXuNZyF/BiazfanxmamNRoxxVxka.png';
    }
    this.messageNumber =
      this.childNotify.newObj.noticeList.length +
      this.childNotify.newObj.messageList.length +
      this.childNotify.newObj.waitList.length;
    this.validateForm = this.fb.group({
      userName: [null, [Validators.required]],
      password: [null, [Validators.required]],
      remember: [true]
    });
    const user = [
      '/workbench/usersettings/basic',
      '/workbench/usersettings/notification',
      '/workbench/usersettings/security'
    ];
    let url = this.router.url;
    const index = user.findIndex(e => e === url);
    if (index !== -1) {
      url = '/workbench/usersettings/basic';
    }
    this.menu = this.menuService.getMenu();
    if  (!this.menu || (this.menu && this.menu.reloadRequired)) {
      this.loadMenu();
    }
    if (this.menu) {
      this.menu.children.forEach(m => {
        m.open = false;
        m.children.forEach(c => {
          c.active = false;
          let path = c.action;
          if (c.action && c.action.startsWith('business:')) {
            path = '/business/' + c.action.substring(9);
          }
          if (url === path) {
            c.active = true;
            m.open = true;
          }
        });
      });
    }
  }

  loadMenu(): void {
    const that = this;
    this.restClient.request('tk.Menu', this.environment.menuName, 'access', {}).then(res => {
      that.menu = new Menu(res);
      that.menu.reloadRequired = false;
    });
  }

  menuItemClick(item: any) {
    if (item.action && item.action === '/') {
      this.router.navigate(['/']);
    } else if (item.action && item.action.startsWith('business:')) {
      const action = '/business/' + item.action.substring(9);
      this.router.navigate([action]);
    } else if (item.action && item.action.startsWith('/')) {
      // window.open(this.environment.contextPath + item.action);
      this.router.navigate([item.action]);
    } else if (item.action && item.action.startsWith('http')) {
      window.open(item.action);
    }
  }

  logOut() {
    this.userService.logout().then(response => {
      this.router.navigateByUrl('/login');
    });
  }

  closeOpen(idx: any) {
    const len = this.menu.children.length;
    for (let i = 0; i < len; i++) {
      this.menu.children[i].open = false;
    }
    this.menu.children[idx].open = true;
  }
  changeInput() {
    this.showInput = true;
    setTimeout(() => {
      this.inputElementShow.nativeElement.focus();
    }, 10);
    console.log(this.inputElementShow);
  }
  changeChild() {
    this.childNotify.changeStatus();
  }
  checkedBack(e: number) {
    this.messageNumber = e;
  }
  checkedBackOther(e: number) {
    this.messageNumber = e;
    this.showNotifyStatus = false;
  }
  blurInput() {
    this.showInput = false;
  }
  open(): void {
    this.visible = true;
  }
  close(): void {
    this.visible = false;
  }
  toggle() {
    this.visible = !this.visible;
  }
}
