import {
  Component, Input, OnInit, OnChanges, ViewChild, ViewContainerRef,
  AfterViewInit, ViewEncapsulation, ElementRef, ComponentFactory,
  ComponentRef, ComponentFactoryResolver, OnDestroy,
} from '@angular/core';
import { FormGroup } from '@angular/forms';
import { MetaLoader } from '../../services/meta-loader.service';
import { DataService } from '../../services/data.service';
import { Widget, WidgetType } from '../../models/widget';
import { SelectRendererComponent } from '../../renderer/select-renderer.component';
import { RestClient } from 'homolo-framework';
import { RendererMeta } from '../../services/renderer-meta.service';
import { NzMessageService } from 'ng-zorro-antd';

@Component({
  selector: 'dm-entityfield',
  templateUrl: './entity-field.component.html',
  encapsulation: ViewEncapsulation.None,
  styleUrls: ['../../../assets/scss/homolo-datamodel.scss']
})
export class EntityFieldComponent implements OnInit, AfterViewInit {
  public $widget: Widget<any>;
  @Input()
  form: FormGroup;
  @Input()
  set widget(widget: Widget<any>) {
    this.$widget = widget;
    this.array = widget.array || false;
  }

  selectRef: ComponentRef<any>;
  entityList: any = [];
  array = false;

  widgetType = WidgetType;


  @ViewChild('selectContainer', { read: ViewContainerRef }) selectContainer: ViewContainerRef;

  constructor(
    private el: ElementRef,
    private message: NzMessageService,
    private dataService: DataService,
    private restClient: RestClient,
    private rendererMeta: RendererMeta,
    private resolver: ComponentFactoryResolver
  ) { }

  ngOnInit() {

  }
  ngAfterViewInit() {
    this.loadData(this.getValue());
    if (this.$widget && this.$widget.defaultValue && !this.form.value[this.$widget.fieldName]) {
      const formControl = this.form.controls[this.$widget.fieldName];
      this.loadData(this.$widget.defaultValue);
      formControl.setValue(this.$widget.defaultValue);
    }
  }

  loadData(ids) {
    const page = this;
    if (!ids) {
      return;
    }
    if (!(ids instanceof Array)) {
      ids = [ids];
    }
    this.restClient.request('dm.Entity', 'collection', 'listSimpleByIds', { ids: ids || [], typeId: this.$widget.schema }).then(result => {
      page.entityList = result;
      // console.log('loadData...', result);
    });
  }

  setValue(value: any) {
    if (value && value.length > 0) {
      if (this.array === true) {
        if (!(value instanceof Array)) {
          value = [value];
        }
        this.loadData(value);
      } else {
        if (value instanceof Array) {
          value = value[0];
        }
        this.loadData([value]);
      }
    } else {
      if (this.array === true) {
        value = [];
      } else {
        value = null;
      }
      this.entityList = [];
    }
    this.form.value[this.$widget.fieldName] = value;
  }

  private getIdsByEntityList() {
    const ids = [];
    if (this.entityList.length !== 0) {
      for (const entity of this.entityList) {
        ids.push(entity.id);
      }
    }
    return ids;
  }

  getValue(): any[] {
    const value = this.form.value[this.$widget.fieldName];
    if (this.array === true) {
      if (value instanceof Array) {
        return value;
      } else {
        return new Array(value);
      }
    } else {
      if (value instanceof Array) {
        return value[0];
      } else {
        return value;
      }
    }
  }

  valueChange() {
    const $widgetComponent = this;
    const $form = this.form;
    if (this.$widget) {
      const $widgetData = this.$widget;
      const FIELDNAME = 'fieldName';
      const fieldName = this.$widget[FIELDNAME];
      const SCHEMA = 'schema';
      const context = {
        rendererMeta: this.rendererMeta,
        typeId: this.$widget[SCHEMA],
        restClient: this.restClient,
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


  createSelectComponent(biz) {
    const factory: ComponentFactory<SelectRendererComponent> = this.resolver.resolveComponentFactory(SelectRendererComponent);
    const componentRef: ComponentRef<SelectRendererComponent> = this.selectContainer.createComponent(factory);
    componentRef.instance.business = biz;
    return componentRef;
  }

  destroyComponent() {
    if (this.selectRef != null) {
      this.selectRef.destroy();
    }
  }

  doSelectEntity() {
    this.destroyComponent();
    const page = this;
    if (this.$widget.schema) {
      const schema = this.$widget.schema.toString();
      const type = MetaLoader.loadType(schema);
      if (type == null) {
        this.message.info('schema未指定或类型不存在');
        return;
      }
      let businessName = 'select';
      const SELECTBUSINESS = 'selectBusiness';
      if (this.$widget.config && this.$widget.config[SELECTBUSINESS]) {
        businessName = this.$widget.config[SELECTBUSINESS];
      }
      const biz = MetaLoader.loadBusiness(type.getName() + '@' + businessName);
      if (!biz) {
        this.message.error(businessName + '业务不存在!');
        return;
      }
      this.selectRef = this.createSelectComponent(biz);
      if (this.selectRef != null) {
        this.selectRef.instance.isWindow = true;
        this.selectRef.instance.isMulti = this.array === true;
        this.selectRef.instance.callback =  (result) => {
          page.processData(result);
          // console.log('this is select renderer callback...............', result);
          if (page.selectRef.instance.isWindow !== true) {
            window.history.back();
          }
        };
        this.selectRef.instance.ngOnChanges();
      }
    }
  }

  processData(result) {
    const me = this;
    let rs = [];
    if (result) {
      if (result instanceof Array) {
        rs = result;
      } else {
        rs = [result];
      }
    }
    if (rs && rs.length > 0) {
      const hasEntities = me.entityList;
      const ids = [];
      for (const r of rs) {
        let exists = false;
        if (me.entityList.length > 0) {
          for (const e of hasEntities) {
            if (e.id === r.id) {
              exists = true;
              continue;
            }
          }
        }
        if (exists) {
          this.message.info('选择中重复的数据已被忽略!');
        } else {
          me.addValue(r.id);
          this.valueChange();
        }
      }
    }
  }

  addValue(value) {
    if (this.array === true) {
      if (value instanceof Array) {
        this.setValue(value);
      } else {
        const ids = this.getValue();
        ids.push(value);
        this.setValue(ids);
      }
    } else {
      this.setValue(value);
    }
  }

  removeEntity(id) {
    const list = [];
    if (this.entityList.length === 0) {
      return;
    }
    for (const entity of this.entityList) {
      if (entity.id !== id) {
        list.push(entity);
      }
    }
    this.entityList = list;
    this.setValue(this.getIdsByEntityList());
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
