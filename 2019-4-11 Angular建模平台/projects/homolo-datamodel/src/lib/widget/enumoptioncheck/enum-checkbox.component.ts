import {
  Component,
  Input,
  OnInit,
  AfterViewInit,
  ViewEncapsulation,
  ElementRef,
} from '@angular/core';
import { FormGroup } from '@angular/forms';
import { Widget } from '../../models/widget';

import { RestClient } from 'homolo-framework';

@Component({
  selector: 'dm-enumoptioncheck',
  templateUrl: './enum-checkbox.component.html',
  encapsulation: ViewEncapsulation.None,
})
export class EnumOptionCheckComponent implements OnInit, AfterViewInit {
  public $widget: Widget<any>;
  @Input()
  form: FormGroup;
  @Input()
  set widget(widget: Widget<any>) {
    this.$widget = widget;
  }

  public options = [];

  constructor(private el: ElementRef, private restClient: RestClient) {}

  ngOnInit() {
    this.initOptions();
  }
  ngAfterViewInit() {
    if (
      this.$widget &&
      this.$widget.defaultValue &&
      !this.form.value[this.$widget.fieldName]
    ) {
      const formControl = this.form.controls[this.$widget.fieldName];
      formControl.setValue(this.$widget.defaultValue);
    }
  }
  setValue(value: any) {
    this.form.value[this.$widget.fieldName] = value;
  }

  selectChange(): void {
    const values = [];
    for (const item of this.options) {
      if (item.checked === true) {
        values.push(item.value);
      }
    }
    this.setValue(values);
  }

  getValue(): any[] {
    const value = this.form.value[this.$widget.fieldName];
    if (value instanceof Array) {
      return value;
    } else {
      return new Array(value);
    }
  }

  initOptions() {
    if (this.$widget.schema) {
      let schema = this.$widget.schema.toString();
      const config = this.$widget.config;
      const SCHEMA = 'schema';
      if (config && config[SCHEMA]) {
        schema = config[SCHEMA];
      }
      const infos = this.restClient.request('fw.System', schema, 'enums', {
        typeName: schema,
      });
      infos.then(result => {
        this.options = [];
        if (result && result instanceof Array) {
          for (const option of result) {
            let hasValue = false;
            if (this.$widget.value && this.$widget.value instanceof Array) {
              for (const v of this.$widget.value || []) {
                if (v === option.name) {
                  hasValue = true;
                  break;
                }
              }
            }
            option.checked = hasValue;
            option.label = option.local;
            option.value = option.name;
            this.options.push(option);
          }
        }
      });
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
