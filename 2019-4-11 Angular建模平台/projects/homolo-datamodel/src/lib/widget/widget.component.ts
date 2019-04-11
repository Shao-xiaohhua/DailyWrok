import {
  Component,
  Input,
  OnInit,
  AfterViewInit,
  OnChanges,
  ViewChild
} from '@angular/core';
import { FormGroup } from '@angular/forms';
import { Widget, WidgetType } from '../models/widget';
import { RequestMethod, Headers } from '@angular/http';
import { HttpClient, HttpHeaders, HttpParams } from '@angular/common/http';
import { MetaLoader } from '../services/meta-loader.service';
import { RendererMeta } from '../services/renderer-meta.service';
import { RestClient } from 'homolo-framework';
@Component({
  selector: 'dm-widget',
  templateUrl: './widget.component.html'
})
export class WidgetComponent implements AfterViewInit, OnChanges {
  public widgetMap = {
    textfield: 'com.homolo.datamodel.ui.component.TextField',
    textarea: 'com.homolo.datamodel.ui.component.TextArea',
    htmleditor: 'com.homolo.datamodel.ui.component.HtmlEditor',
    datefield: 'com.homolo.datamodel.ui.component.DateField',
    datetimefield: 'com.homolo.datamodel.ui.component.DateTimeSelector',
    daterangefield: 'com.homolo.datamodel.ui.component.DateRangeField',
    integerfield: 'com.homolo.datamodel.ui.component.IntegerField',
    integerrange: 'com.homolo.datamodel.ui.component.IntegerRange',
    doublefield: 'com.homolo.datamodel.ui.component.DoubleField',
    floatfield: 'com.homolo.datamodel.ui.component.FloatField',
    longfield: 'com.homolo.datamodel.ui.component.LongField',
    doublerange: 'com.homolo.datamodel.ui.component.DoubleRange',
    booleancheckbox: 'com.homolo.datamodel.ui.component.BooleanCheckbox',
    booleanradio: 'com.homolo.datamodel.ui.component.BooleanRadio',
    optioncombo: 'com.homolo.datamodel.ui.component.OptionCombo',
    optioncheck: 'com.homolo.datamodel.ui.component.OptionCheck',
    enumfield: 'com.homolo.datamodel.ui.component.EnumField',
    enumoptioncheck: 'com.homolo.datamodel.ui.component.EnumOptionCheck',
    entityfield: 'com.homolo.datamodel.ui.component.EntityField',
    entitycombo: 'com.homolo.datamodel.ui.component.EntityCombo',
    typecombo: 'com.homolo.datamodel.ui.component.TypeCombo',
    zonecombo: 'com.homolo.datamodel.ui.component.ZoneCombo',
    attachmentfield: 'com.homolo.datamodel.ui.component.AttachmentField',
    imagefield: 'com.homolo.datamodel.ui.component.ImageField',
    displayfield: 'com.homolo.datamodel.ui.component.DisplayField',
    attachmentdisplayfield:
      'com.homolo.datamodel.ui.component.AttachmentDisplayField',
    doubleRange: 'com.homolo.datamodel.ui.component.DoubleRangeField'
    // imagefielddisplay: 'com.homolo.datamodel.ui.component.ImageFieldDisplay'
  };

  @Input() widget: Widget<any>;
  @Input() form: FormGroup;
  widgetType = WidgetType;

  constructor(
    private restClient: RestClient,
    private rendererMeta: RendererMeta
  ) {}

  ngAfterViewInit() {
    // console.log('widget', this.widget);
  }

  ngOnChanges() {}
}
