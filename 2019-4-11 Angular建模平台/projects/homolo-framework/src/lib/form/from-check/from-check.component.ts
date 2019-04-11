import { Component, OnInit } from '@angular/core';

@Component({
  selector: 'hf-from-check',
  templateUrl: './from-check.component.html',
  styleUrls: ['../../../assets/scss/homolo-framework.scss']
})
export class FromCheckComponent implements OnInit {
  // 解决编译报错
  public listOfSelection = [];
  // 新建规则条目
  ruleName = '';
  ruleStatus = '';
  ruleStatusTwo = '';
  ruleStatusThree = '';
  ruleNumber = 0;
  ruleData = null;
  newRule: string;
  moreOperation: string;
  expandForm = false;
  isVisible = false;
  inputError = false;
  operationStatus = false;
  checkNumberCount = 0;
  checkMainNumber = 0;
  listOfData = [
    {
      id: 0,
      name: '这是规则名称',
      intro: '这是一段描述',
      number: 990,
      status: '关闭',
      time: '2017-07-14 08:00:00',
      statusType: 'close'
    },
    {
      id: 1,
      name: '这是规则名称',
      intro: '这是一段描述',
      number: 132,
      status: '异常',
      time: '2017-07-14 08:00:00',
      statusType: 'close'
    },
    {
      id: 2,
      name: '这是规则名称',
      intro: '这是一段描述',
      number: 245,
      status: '关闭',
      time: '2017-07-14 08:00:00',
      statusType: 'close'
    },
    {
      id: 3,
      name: '这是规则名称',
      intro: '这是一段描述',
      number: 364,
      status: '运行中',
      time: '2017-07-14 08:00:00',
      statusType: 'close'
    },
    {
      id: 4,
      name: '这是规则名称',
      intro: '这是一段描述',
      number: 253,
      status: '异常',
      time: '2017-07-14 08:00:00',
      statusType: 'close'
    },
    {
      id: 5,
      name: '这是规则名称',
      intro: '这是一段描述',
      number: 474,
      status: '已上线',
      time: '2017-07-14 08:00:00',
      statusType: 'close'
    },
    {
      id: 6,
      name: '这是规则名称',
      intro: '这是一段描述',
      number: 688,
      status: '关闭',
      time: '2017-07-14 08:00:00',
      statusType: 'close'
    }
  ];

  loading = true;
  filterGender = [
    { text: '关闭', value: '关闭' },
    { text: '运行中', value: '运行中' },
    { text: '已上线', value: '已上线' },
    { text: '异常', value: '异常' }
  ];
  // table变量
  isAllDisplayDataChecked = false;
  isIndeterminate = false;
  listOfDisplayData: any[] = [];
  mapOfCheckedId: { [key: string]: boolean } = {};
  // 当前页面展示数据改变的回调函数
  currentPageDataChange(
    $event: Array<{ id: number; name: string; age: number; address: string }>
  ): void {
    this.listOfDisplayData = $event;
    this.refreshStatus();
  }
  // 选中单个checkbox触发事件
  refreshStatus(): void {
    this.isAllDisplayDataChecked = this.listOfDisplayData.every(
      item => this.mapOfCheckedId[item.id]
    );
    this.isIndeterminate =
      this.listOfDisplayData.some(item => this.mapOfCheckedId[item.id]) &&
      !this.isAllDisplayDataChecked;
    this.showOperation();
  }
  // 选中总checkbox触发事件
  checkAll(value: boolean): void {
    this.listOfDisplayData.forEach(
      item => (this.mapOfCheckedId[item.id] = value)
    );
    this.refreshStatus();
    this.showOperation();
  }

  showOperation() {
    let flag = 0;
    for (const i in this.mapOfCheckedId) {
      if (this.mapOfCheckedId[i]) {
        flag++;
      }
    }
    if (flag > 0) {
      this.operationStatus = true;
    }
    if (flag === 0) {
      this.operationStatus = false;
    }
    this.checkNumberCount = flag;
    this.checkMainNumber = flag * 23;
  }

  constructor() {}

  ngOnInit(): void {
    this.getData();
  }
  // 重置
  reset() {
    this.loading = true;
    this.ruleName = '';
    this.ruleStatus = '';
    this.ruleStatusTwo = '';
    this.ruleStatusThree = '';
    this.ruleNumber = 0;
    this.ruleData = null;
    this.getData();
  }
  // 查询
  search() {
    this.getData();
  }
  // 获取数据
  getData() {
    this.loading = true;
    setTimeout(() => {
      this.loading = false;
    }, 1000);
  }
  // 更新日期调用方法
  onChange(result: Date): void {}
  // 提交规则
  handleSubmit(): void {
    const ruleList = {
      ruleName: this.ruleName,
      ruleStatus: this.ruleStatus,
      ruleStatusTwo: this.ruleStatusTwo,
      ruleStatusThree: this.ruleStatusThree,
      ruleNumber: this.ruleNumber,
      ruleData: this.ruleData,
      newRule: this.newRule
    };
    if (this.newRule.length >= 5) {
      this.isVisible = false;
      const listId = this.listOfData.length;
      const dataItem = {
        id: listId,
        name: '这是规则名称',
        intro: this.newRule,
        number: 688,
        status: '关闭',
        time: '2017-07-14 08:00:00',
        statusType: 'close'
      };
      this.listOfData.unshift(dataItem);
      this.getData();
    }
  }
  // 新建规则时判断输入五个字符
  checkNumber() {
    if (this.newRule.length < 5) {
      this.inputError = true;
    }
    if (this.newRule.length >= 5) {
      this.inputError = false;
    }
  }
  // 取消弹框
  handleCancel(): void {
    this.isVisible = false;
  }
  // 显示弹框
  showModal(): void {
    this.isVisible = true;
  }
  // 过滤器选择回调函数
  updateFilter(value: string[]): void {}
  clearCheck() {
    this.isAllDisplayDataChecked = false;
    this.mapOfCheckedId = {};
  }
  cancleItem() {
    // console.log(this.moreOperation);
  }
}
