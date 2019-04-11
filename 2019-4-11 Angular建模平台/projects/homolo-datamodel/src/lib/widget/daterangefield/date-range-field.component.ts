import { Component, Input, OnChanges, OnInit, AfterViewInit, NgModule, ViewChild, ElementRef, EventEmitter } from '@angular/core';
import { FormGroup } from '@angular/forms';
import { Widget } from '../../models/widget';
import { differenceInDays } from 'date-fns';
import { startOfWeek } from 'date-fns';
import { startOfMonth} from 'date-fns';
import { startOfDay } from 'date-fns';
import { format } from 'date-fns';

@Component({
  selector: 'dm-daterangefield',
  templateUrl: './date-range-field.component.html',
  styleUrls: ['../../../assets/scss/homolo-datamodel.scss']
})
export class DateRangeFieldComponent implements OnChanges, OnInit, AfterViewInit {
  public $widget: Widget<any>;
  @Input()
  form: FormGroup;
  @Input()
  set widget(widget: Widget<any>) {
    this.$widget = widget;
  }

  displayAs: any = '';

  dateFormat = 'yyyy-MM-dd';
  private today = new Date();
  ranges = {
    今天: [startOfDay(new Date()), new Date()],
    本周: [startOfWeek(startOfDay(new Date())), new Date()],
    本月: [startOfMonth(startOfDay(new Date())), new Date()]
  };

  ngOnInit() {}
  ngAfterViewInit() {}
  ngOnChanges(event: any) {
    if (!event) {
      const value = this.form.value[this.$widget.fieldName];
      event = value ? format(value, 'YYYY-MM-DD') : '';
    }
    if (Array.isArray(event) && event[0] instanceof Date && event[1] instanceof Date) {
      event[0].setHours(0, 0, 0);
      event[1].setHours(23, 59, 59);
      this.setValue(event);
    }
    const $widgetComponent = this;
    const $form = this.form;
    if (this.$widget) {
      const $widgetData = this.$widget;
      const FIELDNAME = 'fieldName';
      const fieldName = this.$widget[FIELDNAME];
      const ONCHANGE = 'onChange';
      const onChange = this.$widget[ONCHANGE];
      if (this.form && fieldName && onChange && this.form.contains(fieldName)) {
        this.form.get(fieldName).valueChanges.subscribe(value => {
          // tslint:disable-next-line: no-eval
          eval(onChange);
        });
      }
    }
  }
  setValue(value: any) {
    if (value) {
      setTimeout(() => this.form.value[this.$widget.fieldName] = value);
    }
  }

  contains(str: string, seq: string[]) {
    let flag = false;
    if (str) { seq.forEach(s => { flag = flag ? flag : str.indexOf(s) > -1; }); }
    return flag;
  }

  disabledDate = (current: Date): boolean => {
    // Can not select days before today and today
    return differenceInDays(current, this.today) > 0;
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

