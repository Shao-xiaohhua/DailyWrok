import { Component, Input, OnInit, OnChanges, AfterViewInit, Inject } from '@angular/core';
import { FormGroup } from '@angular/forms';
import { Widget } from '../../models/widget';

@Component({
  selector: 'dm-attachmentdisplayfield',
  templateUrl: './attachment-display-field.component.html',
  styleUrls: ['../../../assets/scss/homolo-datamodel.scss']
})
export class AttachmentDisplayFieldComponent implements OnInit, AfterViewInit {
  public $widget: Widget<any>;
  @Input() form: FormGroup;
  @Input() set widget(widget: Widget<any>) {
    this.$widget = widget;
  }

  urls: Array<string>;
  names: Array<string>;
  constructor(@Inject('env') private environment) {}

  ngOnInit() {}
  ngAfterViewInit() {
    this.urls = [];
    this.names = [];
    if (this.$widget && this.$widget.value) {
      if (this.$widget.value instanceof Array) {
        this.$widget.value.forEach(element => {
          this.urls.push(this.environment.contextPath + '/service/rest/tk.File/' + element.trim() + '/download');
        });
      } else if (this.$widget.value instanceof String && this.$widget.value.indexOf(',') >= 0) {
        const fileIds = this.$widget.value.split(',');
        fileIds.forEach(element => {
          this.urls.push(this.environment.contextPath + '/service/rest/tk.File/' + element.trim() + '/download');
        });
      } else {
        this.urls.push(this.environment.contextPath + '/service/rest/tk.File/' + this.$widget.value + '/download');
      }
    }
    if (this.$widget && this.$widget.displayAs) {
      if (this.$widget.displayAs && this.$widget.displayAs.indexOf(',') >= 0) {
        const fileNames = this.$widget.displayAs.split(',');
        fileNames.forEach(element => {
          this.names.push(element.trim());
        });
      } else {
        this.names.push(this.$widget.displayAs);
      }
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
