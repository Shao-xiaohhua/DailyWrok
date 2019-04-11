
import {
  Component,
  Input,
  OnInit,
  AfterViewInit,
  ElementRef
} from '@angular/core';
import { FormGroup } from '@angular/forms';
import { MetaLoader } from '../../services/meta-loader.service';
import { Widget } from '../../models/widget';
import { CategoryService } from 'homolo-framework';
/**
 * 字典Check组件
 */
@Component({
  selector: 'dm-optioncheck',
  templateUrl: './option-check.component.html',
  styleUrls: []
})
export class OptionCheckComponent implements AfterViewInit, OnInit {
  public $widget: Widget<any>;
  @Input()
  form: FormGroup;
  @Input()
  set widget(widget: Widget<any>) {
    this.$widget = widget;
  }

  public options = [];
  hasValue = false;

  constructor(
    private el: ElementRef,
    private categoryService: CategoryService
    ) {}

  ngOnInit() {
    this.initOptions();
  }
  ngAfterViewInit() {
    // 页面渲染后改变数据导致二次checked报错
    // this.initOptions();
    if (this.$widget && this.$widget.fieldName) {
      const formControl = this.form.controls[this.$widget.fieldName];
      formControl.reset = bindFunction(this.formControlReset, this, null, null);
      // 渲染默认值
      if (
        this.$widget.defaultValue &&
        !this.form.value[this.$widget.fieldName]
      ) {
        formControl.setValue(this.$widget.defaultValue);
      }
    }
  }
  // 选中事件
  ngModelChange(value: any) {
    if (!value) {
      return;
    }
    if (value) {
      this.valueChange();
    }
  }

  setValue(value: any) {
    this.form.value[this.$widget.fieldName] = value;
  }

  getValue(): any[] {
    const value = this.form.value[this.$widget.fieldName];
    if (value instanceof Array) {
      return value;
    } else {
      return new Array(value);
    }
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

  initOptions() {
    if (this.$widget.schema) {
      this.options = [];
      const schema = this.$widget.schema.toString();
      const category = this.categoryService.getCategory(schema);

      if (category) {
        for (const option of category.children) {
          let hasValue = false;
          if (this.$widget.value && this.$widget.value instanceof Array) {
            for (const v of this.$widget.value || []) {
              if (v === option.name) {
                hasValue = true;
                break;
              }
            }
          }
          const CHECKED = 'checked';
          option[CHECKED] = hasValue;
          const LABEL = 'label';
          option[LABEL] = option.name;
          const VALUE = 'value';
          option[VALUE] = option.id;
          this.options.push(option);
        }
      }
    }
  }
  filter(input?: string, option?) {
    /* const pinyin = OptionComboComponent.prototype.ConvertPinyin(option.nzLabel);
    if (!input) {
      return false;
    }
    if (pinyin.match(input)) {
      return true;
    }
    if (option.nzLabel.match(input)) {
      return true;
    }
    return false; */
  }

  // 汉字转拼音
  ConvertPinyin(str: any) {
    /* const length = str.length;
    let pinyinStr = '';
    const reg = new RegExp('[a-zA-Z0-9- ]');
    for (let i = 0; i < length; i++) {
      const s = str.substr(i, 1);
      const index = hanZi.indexOf(s);
      if (reg.test(s)) {
        pinyinStr += s;
      } else if (index >= 0) {
        const pinyinVal = pinYin[index];
        pinyinStr += pinyinVal.substr(0, 1);
      }
    }
    pinyinStr = pinyinStr.replace(/ /g, '-');
    while (pinyinStr.indexOf('--') > 0) {
      pinyinStr = pinyinStr.replace('--', '-');
    }
    return pinyinStr; */
  }


  valueChange() {
    const $widgetComponent = this;
    const $form = this.form;
    if (this.$widget) {
      const $widgetData = this.$widget;
      const FIELDNAME = 'fieldName';
      const fieldName = this.$widget[FIELDNAME];

      const context = {
        metaLoader: MetaLoader,
        // restClient: this.restClient,
        form: this.form
      };
      const ONCHANGE = 'onChange';
      const onChange = this.$widget[ONCHANGE];
      if (this.form && fieldName && onChange && this.form.contains(fieldName)) {
        this.form.get(fieldName).valueChanges.subscribe(value => {
          // tslint:disable-next-line: no-eval
          eval('(function(context){' + onChange + '})(context);');
        });
      }
    }
  }

  formControlReset(value: any, options: object) {
    const SCHEMA = 'schema';
    if (options && options[SCHEMA]) {
      this.$widget.schema = options[SCHEMA];
      this.initOptions();
    }
    if (value) {
      this.valueChange();
      this.initOptions();
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

function bindFunction(fn, scope, args, appendArgs) {
  if (arguments.length === 2) {
    return () => {
      return fn.apply(scope, {});
    };
  }

  const method = fn;
  const slice = Array.prototype.slice;

  return () => {
    let callArgs = args || {};

    if (appendArgs === true) {
      callArgs = slice.call({}, 0);
      callArgs = callArgs.concat(args);
    }

    return method.apply(scope, callArgs);
  };
}
