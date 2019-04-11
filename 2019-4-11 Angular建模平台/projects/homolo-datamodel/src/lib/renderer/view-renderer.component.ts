import {
  Component,
  Input,
  OnInit,
  OnChanges,
  ViewChild,
  ViewContainerRef,
  ComponentFactory,
  ComponentRef,
  ComponentFactoryResolver,
  OnDestroy,
  ChangeDetectionStrategy,
  TemplateRef,
  ChangeDetectorRef,
} from '@angular/core';
import { ReactiveFormsModule, FormGroup } from '@angular/forms';
import { ActivatedRoute, ParamMap } from '@angular/router';

import { Widget, Fieldset } from '../models/widget';
import { MetaLoader } from '../services/meta-loader.service';
import { RendererMeta } from '../services/renderer-meta.service';
import { DataService } from '../services/data.service';
import { Type } from '../models/type';
import { Business, RendererType } from '../models/business';
import { Entity } from '../models/entity';
import {
  ViewInfo,
  DetailView,
  ListView,
  SearchView,
  View,
} from '../models/view';
import { ListRendererComponent } from './list-renderer.component';
import { SearchRendererComponent } from './search-renderer.component';

import { NzMessageService } from 'ng-zorro-antd';

@Component({
  selector: 'dm-view',
  templateUrl: 'view-renderer.component.html',
  providers: [],
  styleUrls: ['../../assets/scss/homolo-datamodel.scss']
})
export class ViewRendererComponent implements OnInit, OnChanges, OnDestroy {
  @Input()
  view: DetailView;
  @Input()
  type: Type;
  @Input()
  business: Business;
  @Input()
  entity: Entity;
  @Input()
  entityId: string;
  @Input()
  config: object = {};
  title: string;
  simpleTitle: string;
  viewInfo: ViewInfo;
  isWindow: boolean;
  dialog: any;
  dialogId: string;
  fieldsets: Fieldset[] = [];
  form: FormGroup;
  interval: any;
  compId: string;
  properties: object;
  nzLayout: string;
  typeId: string;
  nzSpan: number;

  constructor(
    private dataService: DataService,
    private message: NzMessageService,
    private resolver: ComponentFactoryResolver,
    private changeDetectorRef: ChangeDetectorRef,
    private rendererMeta: RendererMeta,
    private route: ActivatedRoute,
  ) {}

  ngOnInit() {
    this.interval = setInterval(() => {
      this.changeDetectorRef.markForCheck();
    }, 1500);
    if (this.isWindow) {
      MetaLoader.apply(this, this.config); // 合并参数
    } else {
      const ENTITYID = 'entityId';
      this.entityId = this.route.snapshot.queryParams[ENTITYID];
    }
    this.dialogId = 'dialog_' + this.compId;
    this.compId = this.business.getName() + new Date().getMilliseconds();
    this.viewInfo = this.type.getView(this.business.getView());
    // if (this.view == null) {
    //     this.type = MetaLoader.loadType('pims.PetitionTransact');
    //     const view = this.type.getView('detail').definition;
    //     if (view instanceof DetailView) {
    //         const detailView = <DetailView>view;
    //         this.view = detailView;
    //     }
    // }
    // if (this.business.getLinks().length > 0) {
    //     this.business.getLinks().forEach(link => {
    //         const array = link.split('@');
    //         let linkBusiness = null;
    //         let type = this.type;
    //         if (array.length === 2) {
    //             linkBusiness = MetaLoader.loadBusiness(link);
    //             type = MetaLoader.loadType(array[0]);
    //         } else {
    //             type = this.type;
    //             linkBusiness = this.type.getBusiness(link);
    //         }
    //         if (linkBusiness != null) {
    //             // this.tabs.push({
    //             //     title: linkBusiness.getTitle() || (linkBusiness.getDisplayAs() + ' - ' + type.getDisplayAs()),
    //             //     content: link
    //             // });
    //         }
    //     });
    // }
    this.title = this.business.getTitle();
    if (!this.title) {
      this.title = this.business.getDisplayAs() + this.type.getDisplayAs();
    }
    if (this.entityId) {
      const actionId = this.type.getName() + '@compose';
      this.rendererMeta
        .executeAction({ id: actionId, params: { entityId: this.entityId } })
        .then(result => {
          if (result == null) {
            this.message.error('实体数据不存在！');
          }
          this.entity = result;
          const TYPEID = 'typeId';
          if (this.entity[TYPEID] !== this.business.getType().getId()) {
            this.typeId = this.entity[TYPEID];
            this.type = MetaLoader.loadType(this.typeId);
            const VIEW = 'view';
            const view = this.type.getView(this.business[VIEW]).definition;
            if (view instanceof DetailView) {
              const detailView = view as DetailView;
              this.view = detailView;
            }
          }

          const displayField = this.type.getDisplayField();
          if (displayField != null) {
            const entityDisplayAs =
              this.entity && this.entity.properties[displayField.getName()];
            if (entityDisplayAs) {
              this.simpleTitle = entityDisplayAs;
            }
          }
          this.ngOnChanges();
        });
    }
    this.ngOnChanges();
  }

  ngOnDestroy() {
    window.clearInterval(this.interval);
  }

  ngOnChanges() {
    this.fieldsets = [];
    const showDisplayer = this.business.rendererType === RendererType.View;
    this.view.fieldsets.forEach(delegate => {
      const field = new Fieldset({
        delegate: delegate || null,
        type: this.type,
        entity: this.entity,
        showDisplayer: showDisplayer || false,
      });
      this.fieldsets.push(field);
      this.nzLayout = field.nzLayout;
      this.nzSpan = field.nzSpan;
    });
    console.log('changes ............', this.view.fieldsets);
    this.form = this.rendererMeta.toFormGroup(this.fieldsets);
    console.log('detail init>>>', this.entityId, this.entity);
    if (this.entity != null) {
      this.properties = this.entity.properties;
      this.form.patchValue(this.properties);
    }
  }
  close() {
    if (this.isWindow === true) {
      // this.childModal.hide();
    } else {
      window.history.back();
    }
  }
}
