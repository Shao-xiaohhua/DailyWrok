import { Field } from '../../models/field';
import { Type } from '../../models/type';
import { NzMessageService } from 'ng-zorro-antd';
import {
  Component,
  Input,
  OnInit,
  AfterViewInit,
  ViewEncapsulation,
  ElementRef,
  ChangeDetectorRef,
} from '@angular/core';
import { FormGroup } from '@angular/forms';
import { MetaLoader } from '../../services/meta-loader.service';
import { Widget, WidgetType } from '../../models/widget';
import { RestClient } from 'homolo-framework';

@Component({
  selector: 'dm-typecombo',
  templateUrl: './type-combo.component.html',
  encapsulation: ViewEncapsulation.None,
  styleUrls: ['../../../assets/scss/homolo-datamodel.scss']
})
export class TypeComboComponent implements OnInit, AfterViewInit {
  public $widget: Widget<any>;
  @Input()
  form: FormGroup;
  @Input()
  set widget(widget: Widget<any>) {
    this.$widget = widget;
  }

  start = 1;
  max = 1;
  action: string;
  isLoading = false;
  modules = [];
  schema: object;
  partWord: string;
  public options = [];

  constructor(
    private el: ElementRef,
    private restClient: RestClient,
    private message: NzMessageService,
    private changeRef: ChangeDetectorRef,
    ) {}

  ngOnInit() {
    this.initOptions();
  }

  ngAfterViewInit() {
    setTimeout(() => {
      if (this.$widget && this.$widget.fieldName) {
        const formControl = this.form.controls[this.$widget.fieldName];
        formControl.reset = bindFunction(
          this.formControlReset,
          this,
          null,
          null,
        );
        // 渲染默认值
        if (
          this.$widget.defaultValue &&
          !this.form.value[this.$widget.fieldName]
        ) {
          formControl.setValue(this.$widget.defaultValue);
        }
      }
    });
  }

  setValue() {
    this.valueChange();
  }

  getValue(): any[] {
    const value = this.form.value[this.$widget.fieldName];
    if (value instanceof Array) {
      return value;
    } else {
      return new Array(value);
    }
  }

  getModuleById(id: string) {
    let module = null;
    for (const m of this.modules) {
      if (m.id === id) {
        module = m;
        break;
      }
    }
    return module;
  }

  initOptions() {
    this.schema = this.$widget.schema;
    this.isLoading = true;
    this.restClient
      .request(
        'dm.Meta',
        'collection',
        'metadata',
        {},
      )
      .then(res => {
        this.isLoading = false;
        if (res && res.modules) {
          this.modules = res.modules;
        }
        this.changeRef.markForCheck();
      })
      .catch(() => (this.isLoading = false));
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
        restClient: this.restClient,
        form: this.form,
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
      this.setValue();
      this.initOptions();
    }
  }

  filter(event) {
    /* this.start = 1;
    this.options = [];
    this.partWord = event;
    this.initOptions(); */
  }

  // 加载更多
  loadMore() {
    if (this.start + 1 <= Math.ceil(this.max / 10)) {
      this.start = this.start + 1;
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
