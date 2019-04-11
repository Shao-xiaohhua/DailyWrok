import { Component, OnInit, Output, EventEmitter } from '@angular/core';
import { NzMessageService } from 'ng-zorro-antd';
import { forEach } from '@angular/router/src/utils/collection';
@Component({
  selector: 'hf-header-notify',
  templateUrl: './header-notify.component.html',
  styleUrls: ['../../../assets/scss/homolo-framework.scss']
})
export class HeaderNotifyComponent implements OnInit {
  @Output() checked = new EventEmitter<any>();
  @Output() checkedOther = new EventEmitter<any>();
  // notifyStatus = true;
  listLength = 0;
  newObj = {
    noticeList: [
      {
        title: '你收到了 14 份新周报',
        time: '2年前',
        icon: 'taobao-circle',
        color: 'orange',
        remove: false
      },
      {
        title: '一个通知',
        time: '2年前',
        icon: 'wechat',
        color: 'green',
        remove: false
      },
      {
        title: '您买的东西到了',
        time: '2年前',
        icon: 'taobao-circle',
        color: 'orange',
        remove: false
      },
      {
        title: '你推荐的 曲妮妮 已通过第二轮面试',
        time: '2年前',
        icon: 'weibo-circle',
        color: 'red',
        remove: false
      }
    ],
    messageList: [
      {
        title: '曲丽丽 评论了你',
        remove: false,
        time: '2年前',
        content: '衣服真好看',
        url:
          'https://gw.alipayobjects.com/zos/rmsportal/fcHMVNCjPOsbUGdEduuv.jpeg'
      },
      {
        title: '曲美美 评论了你',
        remove: false,
        time: '2年前',
        content: '裤子真好看',
        url:
          'https://gw.alipayobjects.com/zos/rmsportal/fcHMVNCjPOsbUGdEduuv.jpeg'
      },
      {
        title: '曲佳佳 评论了你',
        remove: false,
        time: '1年前',
        content: '发型真好看',
        url:
          'https://gw.alipayobjects.com/zos/rmsportal/fcHMVNCjPOsbUGdEduuv.jpeg'
      }
    ],
    waitList: [
      {
        title: '第三方紧急代码变更',
        remove: false,
        time: '冠霖提交于 2017-01-06，需在 2017-01-07 前完成代码变更任务',
        type: '未开始',
        typeStatus: 'noBegin'
      },
      {
        title: '计算机考试',
        remove: false,
        time: '2年前',
        type: '马上到期',
        typeStatus: 'start'
      },
      {
        title: '新需求来了',
        remove: false,
        time: '1年前',
        type: '已耗时8天',
        typeStatus: 'done'
      },
      {
        title: '新需求来了',
        remove: false,
        time: '任务需要在 2017-01-12 20:00 前启动',
        type: '进行中',
        typeStatus: 'doing'
      }
    ]
  };
  constructor(private message: NzMessageService) {}

  ngOnInit() {
    this.listLength =
      this.newObj.noticeList.length +
      this.newObj.messageList.length +
      this.newObj.waitList.length;
    this.countListLength();
  }

  clearNotice() {
    this.newObj.noticeList = [];
    this.message.create('success', '清空了通知');
    this.checkedOther.emit(this.countListLength());
  }
  clearMessage() {
    this.newObj.messageList = [];
    this.message.create('success', '清空了消息');
    this.checkedOther.emit(this.countListLength());
  }
  clearWait() {
    this.newObj.waitList = [];
    this.message.create('success', '清空了待办');
    this.checkedOther.emit(this.countListLength());
  }
  removeNotice(i) {
    if (!this.newObj.noticeList[i].remove) {
      this.newObj.noticeList[i].remove = true;
    }
    this.checked.emit(this.countListLength());
  }
  removeMessage(i) {
    if (!this.newObj.messageList[i].remove) {
      this.newObj.messageList[i].remove = true;
    }
    this.checked.emit(this.countListLength());
  }
  removeWait(i) {
    if (!this.newObj.waitList[i].remove) {
      this.newObj.waitList[i].remove = true;
    }
    this.checked.emit(this.countListLength());
  }
  countListLength() {
    let num = 0;
    for (const i of Object.keys(this.newObj)) {
      this.newObj[i].forEach((key: any) => {
        if (!key.remove) {
          num += 1;
        }
      });
    }
    return num;
  }
}
