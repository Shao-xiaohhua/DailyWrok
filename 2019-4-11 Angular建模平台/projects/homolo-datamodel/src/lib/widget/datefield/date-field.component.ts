import {
  Component,
  Input,
  OnInit,
  OnChanges,
  AfterViewInit,
  NgModule,
  ViewChild,
  ElementRef,
  EventEmitter,
} from '@angular/core';
import { FormGroup } from '@angular/forms';
import { Widget } from '../../models/widget';
import { differenceInDays } from 'date-fns';
import { startOfWeek } from 'date-fns';
import { startOfMonth} from 'date-fns';
import { startOfDay } from 'date-fns';
import { format } from 'date-fns';

@Component({
  selector: 'dm-datefield',
  templateUrl: './date-field.component.html',
  styleUrls: ['../../../assets/scss/homolo-datamodel.scss']
})
export class DateFieldComponent implements OnChanges, OnInit, AfterViewInit {
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
  private ranges = {
    今天: [startOfDay(new Date()), new Date()],
    本周: [startOfWeek(startOfDay(new Date())), new Date()],
    本月: [startOfMonth(startOfDay(new Date())), new Date()],
  };

  ngOnInit() {}
  ngAfterViewInit() {
    setTimeout(() => {
      if (
        this.$widget &&
        this.$widget.fieldName &&
        !this.form.value[this.$widget.fieldName]
      ) {
        const formControl = this.form.controls[this.$widget.fieldName];
        this.displayAs = new Date();
        formControl.setValue(this.displayAs);
      } else if (
        this.$widget &&
        this.$widget.fieldName &&
        !this.form.value[this.$widget.fieldName]
      ) {
        this.displayAs = this.$widget.defaultValue;
      }
    });
  }
  setValue(value: any) {
    if (value && value.widget && value.widget.currentValue) {
      const WIDGET = 'widget';
      this.form.value[this.$widget.fieldName] =
        value[WIDGET].currentValue.value;
      this.displayAs = value[WIDGET].currentValue.value;
    }
  }

  contains(str: string, seq: string[]) {
    let flag = false;
    if (str) {
      seq.forEach(s => {
        flag = flag ? flag : str.indexOf(s) > -1;
      });
    }
    return flag;
  }

  disabledDate = (current: Date): boolean => {
    // Can not select days before today and today
    return differenceInDays(current, this.today) > 0;
  }

  ngOnChanges(event: any) {
    if (!event) {
      const value = this.form.value[this.$widget.fieldName];
      event = value ? format(value, 'YYYY-MM-DD') : event;
    }
    if (
      Array.isArray(event) &&
      event[0] instanceof Date &&
      event[1] instanceof Date
    ) {
      event[0].setHours(0, 0, 0);
      event[1].setHours(23, 59, 59);
    }
    this.setValue(event);
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
