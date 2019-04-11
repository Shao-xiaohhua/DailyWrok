import { Fieldset as FieldsetMeta, LabelAlign } from './view';
import { Type } from './type';
import { Field } from './field';
import { DataType } from '../models/data-type';
import { MetaLoader } from '../services/meta-loader.service';
import { Entity } from '../models/entity';

export enum WidgetType {
  TextField,
  NumberField,
  DateField,
}

export class Widget<T> {
  typeId: string;
  defaultValue: T;
  value: T;
  displayAs: string;
  fieldName: string;
  label: string;
  schema: object;
  labelWidth: number;
  inputWidth: number;
  required: boolean;
  readonly: boolean;
  array: boolean;
  format: string;
  tip: string;
  inputType: string;
  validator: string;
  xtype: string;
  widgetType: WidgetType;
  onChange: string;
  nzLayout: string;
  nzSpan: number;
  config: object;

  constructor(
    options: {
      typeId?: string;
      defaultValue?: T;
      value?: T;
      displayAs?: string;
      fieldName?: string;
      format?: string;
      schema?: object;
      tip?: string;
      label?: string;
      inputType?: string;
      required?: boolean;
      readonly?: boolean;
      array?: boolean;
      order?: number;
      validator?: string;
      xtype?: string;
      widgetType?: WidgetType;
      onChange?: string;
      nzLayout?: string;
      nzSpan?: number;
      config?: object;
    } = {},
  ) {
    this.typeId = options.typeId;
    this.defaultValue = options.defaultValue;
    this.value = options.value;
    this.fieldName = options.fieldName || '';
    this.schema = options.schema || null;
    this.format = options.format || '';
    this.inputType = options.inputType || '';
    this.tip = options.tip || '';
    this.label = options.label || '';
    this.validator = options.validator || '';
    this.required = !!options.required;
    this.readonly = !!options.readonly;
    this.array = !!options.array;
    this.xtype = options.xtype;
    this.widgetType = options.widgetType || WidgetType.TextField;
    this.displayAs = options.displayAs
      ? options.displayAs
      : options.value
        ? options.value.toString()
        : '';
    this.onChange = options.onChange;
    this.nzLayout = options.nzLayout;
    this.nzSpan = options.nzSpan;
    if (options.config) {
      // tslint:disable-next-line:no-eval
      this.config = eval('(' + options.config + ')');
    }
  }
}

export class Fieldset {
  name: string;
  labelAlign: LabelAlign;
  border: boolean;
  xtype: string;
  nzLayout = 'horizontal';
  nzSpan = null;
  widgets = new Array<Widget<any>>();

  constructor(
    options: {
      delegate?: FieldsetMeta;
      type?: Type;
      entity?: Entity;
      showDisplayer?: boolean;
    } = {},
  ) {
    this.name = options.delegate.name;
    this.border = options.delegate.border;
    this.xtype = options.delegate.xtype;
    const layout = options.delegate.layout;
    let items = [];
    items = options.delegate.items;
    if ('1:1:1' === layout) {
      this.nzSpan = 8;
    } else if ('1:1' === layout) {
      this.nzSpan = 12;
    } else {
      this.nzSpan = 24;
    }
    this.labelAlign = options.delegate.labelAlign;
    if (options.delegate.labelAlign === 2) {
      this.nzLayout = 'vertical';
    }
    items.forEach(item => {
      const field = options.type.getField(item.field);
      const typeId = options.type.getId();
      if (field) {
        const w = item.widget;
        let editor: string = item.editor;
        let displayer: string = item.displayer;
        let format: string = field.format;
        const schema: object = field.schema;
        const dataType: DataType = MetaLoader.loadDataType(field.dataType);
        if (dataType.widget) {
          if (editor == null) {
            editor = dataType.widget.editor;
          }
          if (displayer == null) {
            displayer = dataType.widget.displayer;
          }
        }
        if (dataType.name === 'Date') {
          const MOMENT = 'moment';
          format = field.format
            // tslint:disable-next-line:no-eval
            ? eval('(' + field.format + ')')[MOMENT]
            : 'YYYY-MM-DD';
        }
        /* if (
          'com.homolo.datamodel.ui.component.AttachmentDisplayField' !==
          displayer
        ) {
          displayer = 'com.homolo.datamodel.ui.component.DisplayField';
        } */
        const widgetConfig: any = {
          typeId: typeId || '',
          fieldName: item.field,
          label: item.label || field.displayAs,
          defaultValue: item.defaultValue || field.defaultValue,
          schema: schema || null,
          format: format || '',
          required: w ? !w.allowBlank : field.allowBlank,
          readonly: w ? w.readonly : field.readOnly,
          tip: item.tip,
          xtype: options.showDisplayer === true ? displayer : editor,
          array: field ? field.array : false,
          onChange: item.onChange,
          nzLayout: this.nzLayout,
          nzSpan: this.nzSpan,
          config: w && w.config ? w.config : field.config,
        };
        widgetConfig.editor = editor;
        if ('com.homolo.datamodel.datatype.IntegerField' === editor) {
          widgetConfig.widgetType = WidgetType.NumberField;
          widgetConfig.inputType = 'Number';
        } else if ('com.homolo.datamodel.ui.component.DateField' === editor) {
          widgetConfig.widgetType = WidgetType.DateField;
        } else {
          widgetConfig.widgetType = WidgetType.TextField;
        }
        if (options.entity) {
          if (options.entity.properties) {
            const VALUE = 'value';
            widgetConfig[VALUE] =
              options.entity.properties[widgetConfig.fieldName];
          }
          if (options.entity.$displays) {
            const DISPLAYAS = 'displayAs';
            widgetConfig[DISPLAYAS] =
              options.entity.$displays[widgetConfig.fieldName];
          }
        }
        if (item.readOnly) {
          const READONLY = 'readonly';
          widgetConfig[READONLY] = true;
        }
        this.widgets.push(new Widget(widgetConfig));
        return false;
      }
    });
  }
}
