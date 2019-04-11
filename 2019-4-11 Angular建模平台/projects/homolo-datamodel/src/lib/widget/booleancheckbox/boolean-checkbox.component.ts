import { Component, Input, ElementRef, OnInit, AfterViewInit, OnChanges, } from '@angular/core';
import { FormGroup } from '@angular/forms';
import { Widget } from '../../models/widget';

@Component({
  selector: 'dm-booleancheckbox',
  templateUrl: './boolean-checkbox.component.html',
  styleUrls: ['../../../assets/scss/homolo-datamodel.scss']
})
export class BooleanCheckboxComponent implements OnInit, AfterViewInit, OnChanges {
  public $widget: Widget<any>;
  @Input() form: FormGroup;
  @Input() set widget(widget: Widget<any>) {
    this.$widget = widget;
  }

  checkBoxText = '';

  constructor(private el: ElementRef) { }

  setValue(value: any) {
    this.form.value[this.$widget.fieldName] = value;
  }

  ngOnInit() {}
  ngAfterViewInit() {
    this.setValue(this.form.value[this.$widget.fieldName]);
    if (this.$widget && this.$widget.defaultValue && !this.form.value[this.$widget.fieldName]) {
      const formControl = this.form.controls[this.$widget.fieldName];
      formControl.setValue(this.$widget.defaultValue);
    }
  }

  ngOnChanges() {
    // const el = $(this.el.nativeElement).find('#' + this._widget.fieldName);
    // // console.log('checked', this.form.value[this._widget.fieldName]);
    // if (this.form.value[this._widget.fieldName]) {
    //   el.attr('checked', 'checked');
    // } else {
    //   el.removeAttr('checked');
    // }
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
