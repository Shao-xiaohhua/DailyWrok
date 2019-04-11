import { Component, Input, OnInit, AfterViewInit, Inject } from '@angular/core';
import { FormGroup } from '@angular/forms';
import { Widget } from '../../models/widget';

import { RestClient } from 'homolo-framework';

@Component({
  selector: 'dm-attachmentfield',
  templateUrl: './attachment-field.component.html',
  styleUrls: ['../../../assets/scss/homolo-datamodel.scss']
})

export class AttachmentFieldComponent implements OnInit, AfterViewInit {
  public $widget: Widget<any>;
  @Input()
  form: FormGroup;
  @Input()
  set widget(widget: Widget<any>) {
    this.$widget = widget;
  }

  constructor(private restClient: RestClient, @Inject('env') private environment) {}
  uploader = {
    uploadUrl: this.environment.contextPath + '/service/rest/tk.File/collection/upload',
    headers: {
      'X-CSRF-TOKEN': this.restClient.csrfToken
    }
  };
  fileList = [];
  public ids: any[] = [];

  ngOnInit() {
  }
  ngAfterViewInit() {
    this.initFiles();
  }

  nzChange() {
    if (!this.$widget.array) {
      const object = this.fileList[this.fileList.length - 1];
      this.fileList = [object];
    }
    this.resetList();
  }

  nzRemove() {
    this.resetList();
  }

  resetList() {
    // 状态有：uploading done error removed
    this.ids = [];
    const STATUS = 'status';
    const RESPONSE = 'response';
    const MESSAGE = 'message';
    const URL = 'url';
    this.fileList.forEach((file) => {
      if (file[STATUS] === 'done') {
        // 如果有已完成的上传就把ID添加到ids
        if (file[RESPONSE].uid) {
          this.ids.push(file[RESPONSE].uid);
        } else if (file[RESPONSE].error === 0) {
          this.ids.push(file[RESPONSE].fileId);
        } else {
          file[STATUS] = 'error';
          file[MESSAGE] = file[RESPONSE].message;
        }
        // 如果有已完成的上传就替换URL
        if (file[RESPONSE].url) {
          file[URL] = file[RESPONSE].url;
        }
      }
    });
    this.setValue();
  }

  initFiles() {
    let fileIds = this.form.value[this.$widget.fieldName];
    if (fileIds && fileIds.length > 0) {
      if (!(fileIds instanceof Array)) {
        fileIds = [fileIds];
      }
      const infos = this.restClient.request('tk.File', 'collection', 'info', { ids: fileIds });
      infos.then(result => {
        if (result && result instanceof Array) {
          result.forEach(r => {
            this.fileList = [...this.fileList, {
              uid: r.id,      // 文件唯一标识
              name: r.name,   // 文件名
              status: 'done', // 状态有：uploading done error removed
              url: r.url, // 链接点开地址
              response: { uid: r.id } // 服务端响应内容
            }];
          });
        }
      });
    }
  }

  setValue() {
    if (this.$widget.array) {
      this.form.value[this.$widget.fieldName] = this.ids;
    } else {
      this.form.value[this.$widget.fieldName] = this.ids && this.ids.length > 0 ? this.ids[0] : null;
    }
  }

  get fieldSpan() {
    if (this.$widget.nzSpan === 8) {
        return 18;
    } else if (this.$widget.nzSpan === 12) {
        return 20;
    } else {
        return 22;
    }
  }
  get labelSpan() {
      if (this.$widget.nzSpan === 8) {
          return 6;
      } else if (this.$widget.nzSpan === 12) {
          return 4;
      } else {
          return 2;
      }
  }
  get isHorizontal(): boolean {
    return this.$widget.nzLayout === 'horizontal';
  }
  get isValid() {
    return this.form.controls[this.$widget.fieldName].valid;
  }
  get isDirty() {
    return this.form.controls[this.$widget.fieldName].dirty;
  }
  get isTouched() {
    return this.form.controls[this.$widget.fieldName].touched;
  }
}

