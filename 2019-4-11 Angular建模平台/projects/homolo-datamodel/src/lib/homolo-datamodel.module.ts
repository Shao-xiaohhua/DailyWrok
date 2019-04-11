import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterModule } from '@angular/router';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { HomoloFrameworkModule } from 'homolo-framework';
import { ModuleWithProviders } from '@angular/compiler/src/core';
import { NgZorroAntdModule } from 'ng-zorro-antd';

import { BigIntPipe } from './pipe/bigInt.pipe';
import { SanitizeHtmlPipe } from './pipe/safeHTML.pipe';

import { DatamodelRoutingModule } from './homolo-datamodel-routing.module';
import { BusinessComponent } from './business.component';
import { OperationComponent } from './compontents/operation/operation.component';
import { SearchRendererComponent } from './renderer/search-renderer.component';
import { DetailRendererComponent } from './renderer/detail-renderer.component';
import { ListRendererComponent } from './renderer/list-renderer.component';
import { SelectRendererComponent } from './renderer/select-renderer.component';
import { ViewRendererComponent } from './renderer/view-renderer.component';

import { WidgetComponent } from './widget/widget.component';
import { DefaultFieldComponent } from './widget/defaultfield/default-field.component';
import { OptionComboComponent } from './widget/optioncombo/option-combo.component';
import { OptionCheckComponent } from './widget/optioncheck/option-check.component';
import { DisplayFieldComponent } from './widget/displayfield/display-field.component';
import { AttachmentDisplayFieldComponent } from './widget/attachmentdisplayfield/attachment-display-field.component';
import { ImageFieldComponent } from './widget/imagefield/image-field.component';
import { AttachmentFieldComponent } from './widget/attachmentfield/attachment-field.component';
import { BooleanCheckboxComponent } from './widget/booleancheckbox/boolean-checkbox.component';
import { BooleanRadioComponent } from './widget/booleanradio/boolean-radio.component';
import { DateFieldComponent } from './widget/datefield/date-field.component';
import { DateTimeFieldComponent } from './widget/datetimefield/date-time-field.component';
import { DateRangeFieldComponent } from './widget/daterangefield/date-range-field.component';
import { DoubleFieldComponent } from './widget/doublefield/double-field.component';
import { FloatFieldComponent } from './widget/floatfield/float-field.component';
import { LongFieldComponent } from './widget/longfield/long-field.component';
import { DoubleRangeComponent } from './widget/doublerange/double-range.component';
import { EntityComboComponent } from './widget/entitycombo/entity-combo.component';
import { TypeComboComponent } from './widget/typecombo/type-combo.component';
import { EntityFieldComponent } from './widget/entityfield/entity-field.component';
import { EnumFieldComponent } from './widget/enumfield/enum-field.component';
import { EnumOptionCheckComponent } from './widget/enumoptioncheck/enum-checkbox.component';
import { IntegerFieldComponent } from './widget/integerfield/integer-field.component';
import { IntegerRangeComponent } from './widget/integerrange/integer-range.component';
import { TextAreaComponent } from './widget/textarea/text-area.component';
import { ZoneComboComponent } from './widget/zonecombo/zone-combo.component';
import { TextFieldComponent } from './widget/textfield/text-field.component';

const COMPONENT = [
  BusinessComponent,
  OperationComponent,
  DefaultFieldComponent,
  OptionCheckComponent,
  SearchRendererComponent,
  DetailRendererComponent,
  ListRendererComponent,
  SelectRendererComponent,
  ViewRendererComponent,
  WidgetComponent,
  AttachmentDisplayFieldComponent,
  AttachmentFieldComponent,
  ImageFieldComponent,
  BooleanCheckboxComponent,
  BooleanRadioComponent,
  DateFieldComponent,
  DateTimeFieldComponent,
  DateRangeFieldComponent,
  DoubleFieldComponent,
  LongFieldComponent,
  FloatFieldComponent,
  DoubleRangeComponent,
  EntityComboComponent,
  EntityFieldComponent,
  TypeComboComponent,
  EnumFieldComponent,
  EnumOptionCheckComponent,
  IntegerFieldComponent,
  IntegerRangeComponent,
  TextAreaComponent,
  TextFieldComponent,
  OptionComboComponent,
  ZoneComboComponent,
  DisplayFieldComponent
];

@NgModule({
  declarations: [...COMPONENT, BigIntPipe, SanitizeHtmlPipe],
  imports: [
    HomoloFrameworkModule,
    FormsModule,
    ReactiveFormsModule,
    CommonModule,
    DatamodelRoutingModule,
    RouterModule,
    NgZorroAntdModule
  ],
  exports: [...COMPONENT],
  entryComponents: [
    ListRendererComponent,
    SelectRendererComponent,
    SearchRendererComponent,
    DetailRendererComponent,
    ViewRendererComponent
  ],
})
export class HomoloDatamodelModule {
  public static forRoot(environment: any): ModuleWithProviders {
    return {
      ngModule: HomoloDatamodelModule,
      providers: [{ provide: 'env', useValue: environment }]
    };
  }
}
