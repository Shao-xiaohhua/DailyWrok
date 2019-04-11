import { Component, Input, OnInit, AfterViewInit, ViewEncapsulation, ViewChild, ElementRef } from '@angular/core';
import { FormGroup } from '@angular/forms';
import { Widget } from '../../models/widget';

@Component({
  selector: 'dm-longfield',
  templateUrl: './long-field.component.html',
  encapsulation: ViewEncapsulation.None,
  styleUrls: ['../../../assets/scss/homolo-datamodel.scss']
})
export class LongFieldComponent implements OnInit, AfterViewInit {
  public $widget: Widget<any>;
  @Input()
  form: FormGroup;
  @Input()
  set widget(widget: Widget<any>) {
    this.$widget = widget;
  }

  config: object;
  constructor(private el: ElementRef) { }

  ngOnInit() {

  }
  ngAfterViewInit() {
    if (this.$widget.config) {
      // tslint:disable-next-line: no-eval
      this.config = eval('(' + this.$widget.config + ')');
    }
    if (this.$widget && this.$widget.defaultValue && !this.form.value[this.$widget.fieldName]) {
      const formControl = this.form.controls[this.$widget.fieldName];
      formControl.setValue(this.$widget.defaultValue);
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
