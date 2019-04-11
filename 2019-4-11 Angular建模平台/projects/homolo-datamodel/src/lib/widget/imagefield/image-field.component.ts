import { Component, Input, OnInit, AfterViewInit, Inject } from '@angular/core';
import { FormGroup } from '@angular/forms';
import { Widget } from '../../models/widget';
import { UploadFile, NzMessageService } from 'ng-zorro-antd';
import { RestClient } from 'homolo-framework';
import { Observable, Observer } from 'rxjs';

@Component({
  selector: 'dm-imagefield',
  templateUrl: './image-field.component.html',
  styleUrls: ['../../../assets/scss/homolo-datamodel.scss']
})

export class ImageFieldComponent implements OnInit, AfterViewInit {
  public $widget: Widget<any>;
  @Input()
  form: FormGroup;
  @Input()
  set widget(widget: Widget<any>) {
    this.$widget = widget;
  }
  images = [];
  constructor(private msg: NzMessageService, private restClient: RestClient, @Inject('env') private environment) {}
  uploader = {
    uploadUrl: this.environment.contextPath + '/service/rest/tk.File/collection/upload',
    headers: {
      'X-CSRF-TOKEN': this.restClient.csrfToken
    }
  };
  showUploadList = {
    showPreviewIcon: true,
    showRemoveIcon: true,
    hidePreviewIconInNonImage: true
  };
  fileList = [];
  public ids: any[] = [];
  showButton = true;
  previewImage: string | undefined = '';
  previewVisible = false;

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

  beforeUpload = (file: File) => {
    return new Observable((observer: Observer<boolean>) => {
      const isImage = file.type.startsWith('image/');
      if (!isImage) {
        this.msg.error('请上传图片格式的文件!');
        observer.complete();
        return;
      }
      observer.next(isImage);
      observer.complete();
    });
  }

  handlePreview = (file: UploadFile) => {
    this.previewImage = file.url || file.thumbUrl;
    this.images.push(this.previewImage);
    this.previewVisible = true;
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
    if (!this.$widget.array) {
      let count = 0;
      for (const file of this.fileList) {
        if (file.status === 'done') {
          count ++;
        }
      }
      if (count >= 1) {
        this.showButton = false;
      } else {
        this.showButton = true;
      }
    } else {
      this.showButton = true;
    }
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
          if (!this.$widget.array && this.fileList.length === 1) {
            this.showButton = false;
          } else {
            this.showButton = true;
          }
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

