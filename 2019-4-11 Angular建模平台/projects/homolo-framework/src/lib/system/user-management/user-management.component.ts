import { RestClient } from './../../core/services/rest-client.service';
import { Component, OnInit } from '@angular/core';
import { NzModalService } from 'ng-zorro-antd';
import { NzMessageService } from 'ng-zorro-antd';
@Component({
  selector: 'hf-user-management',
  templateUrl: './user-management.component.html',
  styleUrls: ['../../../assets/scss/homolo-framework.scss']
})
export class UserManagementComponent implements OnInit {
  addUserShow = false;
  editUserShow = false;
  listOfDisplayData = [];
  listOfAllData = [];
  mapOfCheckedId: { [key: string]: boolean } = {};
  numberOfChecked = 0;
  editRoleShow = false;
  addRoleShow = false;
  addUserShowInput = false;
  checkboxId = '';
  roleId = '';
  delRoleId = '';
  editRoleId = '';
  removeRoleId = '';
  listTotal = 0;
  addRoleData = [];
  editRoleData = [];
  roleData = [];
  /**
   * 添加用户表单参数
   */
  addUserParam = {
    entityName: 'us.User',
    description: '',
    email: '',
    mobile: '',
    nickName: '',
    password: '',
    timeZone: '',
    nationality: '',
    changePasswordAfterLogin: false,
    disabled: false,
    zipCode: '',
    locked: false,
    roles: [],
    userName: ''
  };
  editUserParam = {
    id: '',
    entityName: 'us.User',
    description: '',
    email: '',
    mobile: '',
    nickName: '',
    password: '',
    timeZone: '',
    nationality: '',
    changePasswordAfterLogin: false,
    disabled: false,
    zipCode: '',
    locked: false,
    roles: [],
    userName: ''
  };
  ngOnInit(): void {
    this.getList();
    this.getRoleList();
  }
  getList() {
    this.restClient
      .get(
        '/service/rest/us.User/collection/query?_dc=1553928275616&pageSize=20&page=1&start=0&limit=20'
      )
      .then(res => {
        console.log(res);
        const { items, total } = res;
        this.listTotal = total;
        this.listOfAllData = items;
      });
  }
  /**
   * 添加用户模态框显示
   */
  addUser() {
    this.addUserShow = true;
  }
  /**
   * 删除用户函数
   */
  deleteUser() {
    this.modalService.confirm({
      nzTitle: '你确定要删除该用户吗?',
      nzContent: '<b style="color: red;">删除该用户以后该用户就没了</b>',
      nzOkText: '是',
      nzOkType: 'danger',
      nzOnOk: () => this.delete(),
      nzCancelText: '否',
      nzOnCancel: () => console.log('Cancel')
    });
  }
  delete() {
    const id = this.checkboxId;
    this.restClient
      .post('/service/rest/us.User/' + id + '/delete')
      .then(res => {
        console.log(res);
        const { code } = res;
        if (code === 1) {
          this.modalService.success({
            nzTitle: '恭喜您！',
            nzContent: '你已经成功删除了该用户'
          });
          this.getList();
        }
      });
  }
  editUser() {
    const id = this.checkboxId;
    const arr = this.listOfAllData;
    const index = arr.findIndex(e => e.id === id);
    if (index !== -1) {
      const {
        // id,
        description,
        email,
        mobile,
        nickName,
        password,
        timeZone,
        nationality,
        changePasswordAfterLogin,
        disabled,
        zipCode,
        locked,
        roles,
        userName
      } = arr[index];
      const entityName = 'us.User';
      this.editUserParam = {
        id,
        entityName,
        description,
        email,
        mobile,
        nickName,
        password,
        timeZone,
        nationality,
        changePasswordAfterLogin,
        disabled,
        zipCode,
        locked,
        roles,
        userName
      };
      this.editRoleData = [];
      this.editUserParam.roles.forEach(e => {
        this.roleData.forEach(ele => {
          if (e.id === ele.id) {
            this.editRoleData.push(ele);
          }
        });
      });
      console.log(this.editRoleData);
      this.editUserShow = true;
    } else {
      this.message.info('请选择要编辑的用户！');
      return;
    }
  }
  handleOkadd(): void {
    this.addUserParam.roles = this.addRoleData;
    const param = this.addUserParam;
    this.restClient
      .post('/service/rest/us.User/collection/create', param)
      .then(res => {
        console.log(res);
        const { code } = res;
        if (code === -2) {
          const { description } = res;
          this.message.info(description);
          this.addUserShow = false;
          this.clearAddUserParam();
        }
        if (code === 1) {
          this.success();
          this.getList();
          this.clearAddUserParam();
          this.addUserShow = false;
        }
      });
  }

  handleCanceladd(): void {
    console.log('Button cancel clicked!');
    this.addUserShow = false;
  }
  handleOkedit(): void {
    this.editUserParam.roles = this.editRoleData;
    const param = this.editUserParam;
    this.restClient
      .post('/service/rest/us.User/' + this.checkboxId + '/update', param)
      .then(res => {
        const { code } = res;
        if (code === 1) {
          this.modalService.success({
            nzTitle: '恭喜您！',
            nzContent: '编辑用户成功！'
          });
          this.getList();
          this.editUserShow = false;
        }
        if (code === -1) {
          const { description } = res;
          this.message.info('编辑用户失败！');
          this.editUserShow = false;
        }
      });
  }
  handleCanceledit(): void {
    console.log('Button cancel clicked!');
    this.editUserShow = false;
  }
  success(): void {
    this.modalService.success({
      nzTitle: '恭喜您！',
      nzContent: '添加用户成功'
    });
  }
  clearAddUserParam() {
    this.addUserParam = {
      entityName: 'us.User',
      description: '',
      email: '',
      mobile: '',
      nickName: '',
      password: '',
      timeZone: '',
      nationality: '',
      changePasswordAfterLogin: false,
      disabled: false,
      zipCode: '',
      locked: false,
      roles: [],
      userName: ''
    };
  }
  getRoleList() {
    // const param = {
    //   _dc: 1553938175561,
    //   excludeRoleIds: '',
    //   type: 'role',
    //   page: 1,
    //   start: 0,
    //   limit: -1
    // };
    this.restClient.get('/service/rest/us.Role/collection/query').then(res => {
      console.log(res);
      const { items } = res;
      this.roleData = items;
    });
  }
  getRoleId() {
    const id = this.roleId;
    const arr = this.roleData;
    const Arr = this.addRoleData;
    const idx = arr.findIndex(e => e.id === id);
    const index = Arr.findIndex(e => e.id === id);
    if (index === -1) {
      this.addRoleData.push(arr[idx]);
      this.addRoleShow = false;
    } else {
      this.addRoleShow = false;
    }
  }
  removeRoles() {
    const arr = [];
    this.addRoleData.forEach(e => {
      if (e.id !== this.delRoleId) {
        arr.push(e);
      }
    });
    this.addRoleData = arr;
  }
  getEditRoleId() {
    const id = this.editRoleId;
    const arr = this.roleData;
    const Arr = this.editRoleData;
    const idx = arr.findIndex(e => e.id === id);
    const index = Arr.findIndex(e => e.id === id);
    if (index === -1) {
      this.editRoleData.push(arr[idx]);
      this.editRoleShow = false;
    } else {
      this.editRoleShow = false;
    }
  }
  editremoveRoles() {
    console.log(this.removeRoleId);
    const newArr = [];
    this.editRoleData.forEach(e => {
      if (e.id !== this.removeRoleId) {
        newArr.push(e);
      }
    });
    this.editRoleData = newArr;
  }
  constructor(
    private restClient: RestClient,
    private modalService: NzModalService,
    private message: NzMessageService
  ) {}
}
