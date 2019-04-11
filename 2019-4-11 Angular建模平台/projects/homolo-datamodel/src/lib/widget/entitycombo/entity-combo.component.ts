import { Field } from './../../models/field';
import { Type } from './../../models/type';
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
  selector: 'dm-entitycombo',
  templateUrl: './entity-combo.component.html',
  encapsulation: ViewEncapsulation.None,
  styleUrls: ['../../../assets/scss/homolo-datamodel.scss']
})
export class EntityComboComponent implements OnInit, AfterViewInit {
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
  partWord: string;
  public options = [];

  constructor(
    private el: ElementRef,
    private restClient: RestClient,
    private message: NzMessageService,
    private changeRef: ChangeDetectorRef,
    ) {}

  ngOnInit() {
    this.options = [];
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
      console.log(this.options);
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

  initOptions() {
    if (this.$widget.schema) {
      // this.options = [];
      let schema = this.$widget.schema.toString();
      const TYPEID = 'typeId';
      if (this.$widget.config && this.$widget.config[TYPEID]) {
        schema = this.$widget.config[TYPEID];
      }
      const type: Type = MetaLoader.loadType(schema);
      const field: Field = type ? type.getDisplayField() : null;
      const params = {
        pageSize: 10,
        page: this.start,
        responseFields: [field ? field.getName() : ''],
        typeId: type ? type.getId() : '',
        partWord: this.partWord,
      };
      let businessName = 'select';
      if (this.$widget.config) {
        const CONFIG = 'config';
        params[CONFIG] = this.$widget.config;
      }
      const SELECTBUSINESS = 'selectBusiness';
      if (this.$widget.config && this.$widget.config[SELECTBUSINESS]) {
        businessName = this.$widget.config[SELECTBUSINESS];
      }
      const biz = MetaLoader.loadBusiness(type.getName() + '@' + businessName);
      const EXPRESSION = 'expression';
      const ACTION = 'action';
      if (biz) {
        this.action = biz.getInitAction();
        if (biz.getInitParams()) {
          // tslint:disable-next-line: no-eval
          const p = eval('(' + biz.getInitParams() + ')');
          if (p && p[EXPRESSION]) {
            params[EXPRESSION] = p[EXPRESSION];
          }
        }
      } else {
        this.message.error(businessName + '业务不存在!');
      }
      if (this.$widget.config && this.$widget.config[EXPRESSION]) {
        params[EXPRESSION] = this.$widget.config[EXPRESSION];
      }
      if (this.$widget.config && this.$widget.config[ACTION]) {
        this.action = this.$widget.config[ACTION];
      }
      this.isLoading = true;
      this.restClient
        .request(
          'dm.DataService',
          type.getName() + '@' + this.action,
          'invoke',
          params,
        )
        .then(res => {
          this.max = res.total;
          this.isLoading = false;
          if (res && res.total > 0) {
            res.items.forEach(e => {
              this.options.push({
                id: e.id,
                name: this.$display(e, field.getName()),
              });
            });
          }
          this.changeRef.markForCheck();
        })
        .catch(() => (this.isLoading = false));
    }
  }

  $display(entity, fieldName) {
    if (!entity || !fieldName) {
      return '';
    }
    if (entity.$displays && entity.$displays[fieldName]) {
      return entity.$displays[fieldName];
    }
    if (entity.properties && entity.properties[fieldName]) {
      return entity.properties[fieldName];
    }
    return '';
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
    this.start = 1;
    this.options = [];
    this.partWord = event;
    this.initOptions();
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
