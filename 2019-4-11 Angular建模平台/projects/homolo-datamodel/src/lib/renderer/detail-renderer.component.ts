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
  ChangeDetectorRef
} from '@angular/core';
import { FormBuilder, ReactiveFormsModule, FormGroup } from '@angular/forms';
import { ActivatedRoute, ParamMap, Router } from '@angular/router';

import { Widget, Fieldset } from '../models/widget';
import { Operation } from '../models/business';
import { MetaLoader } from '../services/meta-loader.service';
import { RendererMeta } from '../services/renderer-meta.service';
import { DataService } from '../services/data.service';
import { Type } from '../models/type';
import { Business } from '../models/business';
import { Action } from '../models/action';
import { Entity } from '../models/entity';
import {
  ViewInfo,
  DetailView,
  ListView,
  SearchView,
  View
} from '../models/view';
import { ListRendererComponent } from './list-renderer.component';
import { SearchRendererComponent } from './search-renderer.component';
import { SelectRendererComponent } from './select-renderer.component';

import { NzMessageService } from 'ng-zorro-antd';

@Component({
  selector: 'dm-detail',
  changeDetection: ChangeDetectionStrategy.OnPush,
  templateUrl: './detail-renderer.component.html',
  providers: [],
  styleUrls: ['../../assets/scss/homolo-datamodel.scss']
})
export class DetailRendererComponent implements OnInit, OnChanges, OnDestroy {
  public tabs: any[] = [];

  fieldsets: Fieldset[] = [];
  widgetDataMap: {};

  form: FormGroup;
  @Input()
  type: Type;
  @Input()
  view: DetailView;
  @Input()
  business: Business;
  @Input()
  entity: Entity;
  @Input()
  entityId: string;
  @Input()
  config: object = {};
  properties: object;
  parentId: string;
  relationId: string;
  relationData: object;
  title: string;
  simpleTitle: string;
  viewInfo: ViewInfo;
  isWindow: boolean;
  dialog: any;
  dialogId: string;
  interval: any;
  compId: string;
  nzLayout: string;
  typeId: string;
  nzSpan: number;

  selectRef: ComponentRef<any>;
  componentRefs: ComponentRef<any>[] = [];

  @ViewChild('linkComponent', { read: ViewContainerRef })
  container: ViewContainerRef;
  @ViewChild('selectContainer', { read: ViewContainerRef })
  selectContainer: ViewContainerRef;
  constructor(
    private dataService: DataService,
    private resolver: ComponentFactoryResolver,
    private message: NzMessageService,
    private changeDetectorRef: ChangeDetectorRef,
    private rendererMeta: RendererMeta,
    private route: ActivatedRoute,
    private router: Router
  ) {}

  ngOnInit() {
    this.interval = setInterval(() => {
      this.changeDetectorRef.markForCheck();
    }, 1500);
    if (this.isWindow) {
      MetaLoader.apply(this, this.config); // 合并参数
    } else if (!this.entityId) {
      const ENTITYID = 'entityId';
      this.entityId = this.route.snapshot.queryParams[ENTITYID];
    }
    this.dialogId = 'dialog_' + this.compId;
    if (this.business != null) {
      this.compId = this.business.getName() + new Date().getMilliseconds();
      this.type = MetaLoader.loadType(this.business.getTypeName());
      this.viewInfo = this.type.getView(this.business.getView());
      this.view = this.viewInfo.definition as DetailView;
      this.title = this.business.getTitle();
      if (!this.title) {
        this.title = this.business.getDisplayAs() + this.type.getDisplayAs();
      }
      if (this.entity && this.entity.typeId) {
        const displayField = this.type.getDisplayField();
        if (displayField != null) {
          const entityDisplayAs =
            this.entity && this.entity.properties[displayField.getName()];
          if (entityDisplayAs) {
            this.simpleTitle = entityDisplayAs;
          }
        }
        this.ngOnChanges();
      } else {
        if (this.entityId) {
          const actionId = this.type.getName() + '@compose';
          this.rendererMeta
            .executeAction({
              id: actionId,
              params: { entityId: this.entityId }
            })
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
                const view = this.type.getView(this.business[VIEW])
                  .definition;
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
        } else {
          this.entity = new Entity();
          this.entity.typeId = this.type.getId();
          this.entity.parentId = this.parentId;
          this.ngOnChanges();
        }
      }
      if (this.business.getLinks().length > 0) {
        this.business.getLinks().forEach(link => {
          const array = link.split('@');
          let linkBusiness = null;
          let type = this.type;
          if (array.length === 2) {
            linkBusiness = MetaLoader.loadBusiness(link);
            type = MetaLoader.loadType(array[0]);
          } else {
            type = this.type;
            linkBusiness = this.type.getBusiness(link);
          }
          if (linkBusiness != null) {
            // this.tabs.push({
            //     title: linkBusiness.getTitle() || (linkBusiness.getDisplayAs() + ' - ' + type.getDisplayAs()),
            //     content: link
            // });
          }
        });
      }
    } else {
      this.message.error('业务不存在');
    }
    console.log('view', this.fieldsets);
    this.ngOnChanges();
  }

  processRelation() {
    // TODO
  }

  createComponent(businessId: string) {
    const biz = MetaLoader.loadBusiness(businessId);
    const type = MetaLoader.loadType(biz.getTypeName());
    const view = type.getView(biz.getView()).definition;
    let componentRef = null;
    if (view instanceof ListView) {
      componentRef = this.createListComponent(type, biz, view as ListView);
    } else if (
      biz.getRenderer() ===
      'com.homolo.datamodel.ui.page.renderers.SelectRenderer'
    ) {
      componentRef = this.createSelectComponent(biz);
    } else if (view instanceof SearchView) {
      componentRef = this.createSearchComponent(type, biz, view as SearchView);
    } else if (view instanceof DetailView) {
      // componentRef = this.createDetailComponent(type, biz, <DetailView>view);
    }
    if (componentRef != null) {
      componentRef.instance.isWindow = true;
      componentRef.instance.ngOnChanges();
      this.componentRefs.push(componentRef);
    }
    return null;
  }

  destroyComponent() {
    if (this.componentRefs != null && this.componentRefs.length > 0) {
      this.componentRefs.forEach(ref => {
        ref.destroy();
      });
    }
  }

  createListComponent(type, biz, view) {
    const factory: ComponentFactory<
      ListRendererComponent
    > = this.resolver.resolveComponentFactory(ListRendererComponent);
    const componentRef: ComponentRef<
      ListRendererComponent
    > = this.container.createComponent(factory);
    componentRef.instance.type = type;
    componentRef.instance.business = biz;
    componentRef.instance.view = view;
    componentRef.instance.pageSize = 5;
    return componentRef;
  }

  createSearchComponent(type, biz, view) {
    const factory: ComponentFactory<
      SearchRendererComponent
    > = this.resolver.resolveComponentFactory(SearchRendererComponent);
    const componentRef: ComponentRef<
      SearchRendererComponent
    > = this.container.createComponent(factory);
    componentRef.instance.type = type;
    componentRef.instance.business = biz;
    componentRef.instance.view = view;
    return componentRef;
  }

  createSelectComponent(biz) {
    const factory: ComponentFactory<
      SelectRendererComponent
    > = this.resolver.resolveComponentFactory(SelectRendererComponent);
    const componentRef: ComponentRef<
      SelectRendererComponent
    > = this.selectContainer.createComponent(factory);
    componentRef.instance.config = {
      business: biz
    };
    return componentRef;
  }

  // createDetailComponent(type, biz, view) {
  //   const factory: ComponentFactory<DetailRendererComponent> = this.resolver.resolveComponentFactory(DetailRendererComponent);
  //   const componentRef: ComponentRef<DetailRendererComponent> = this.container.createComponent(factory);
  //   componentRef.instance.config = {
  //     business: biz,
  //     entityId: this.entityId, // 测试用 TODO
  //     defaultModal: this.defaultModal // 此处启用页面只能弹一个modal窗口,好处是可以用代码控制关闭
  //   };
  //   return componentRef;
  // }

  ngOnDestroy() {
    window.clearInterval(this.interval);
    this.destroyComponent();
  }
  public openModal() {
    // this.defaultModal.show();
    // this.defaultModal.config.ignoreBackdropClick = true;
    // this.destroyComponent();
    // this.createComponent(this.type.getName() + '@edit');
  }

  public openSelector1() {
    // this.selectModal.show();
    // this.selectModal.config.ignoreBackdropClick = true;
    this.destroyComponent();
    const biz = MetaLoader.loadBusiness(this.type.getName() + '@select');
    this.selectRef = this.createSelectComponent(biz);
    if (this.selectRef != null) {
      this.selectRef.instance.isWindow = true;
      this.selectRef.instance.callback = (r: any) => {
        console.log('this is select renderer callback...............', r);
      };
      this.selectRef.instance.ngOnChanges();
      this.componentRefs.push(this.selectRef);
    }
  }

  public openSelector() {
    this.destroyComponent();
    const biz = MetaLoader.loadBusiness(this.type.getName() + '@select');
    this.selectRef = this.createSelectComponent(biz);
    if (this.selectRef != null) {
      this.selectRef.instance.isWindow = true;
      this.selectRef.instance.callback = (r: any) => {
        console.log('this is select renderer callback...............', r);
      };
      this.selectRef.instance.ngOnChanges();
      this.componentRefs.push(this.selectRef);
    }
  }

  public closeModal() {
    // this.defaultModal.hide();
  }

  public doConfirm() {
    this.selectRef.instance.doConfirm();
    // this.selectModal.hide();
  }

  public alertMe(): void {
    setTimeout((): void => {
      alert('You have selected the alert tab!');
    });
  }

  ngOnChanges() {
    const that = this;
    this.fieldsets = [];
    this.view.fieldsets.forEach(delegate => {
      const field = new Fieldset({
        delegate: delegate || null,
        type: that.type,
        entity: that.entity
      });
      that.fieldsets.push(field);
      that.nzLayout = field.nzLayout;
      that.nzSpan = field.nzSpan;
    });
    this.form = this.rendererMeta.toFormGroup(this.fieldsets);
    if (this.entity != null) {
      this.properties = this.entity.properties;
      console.log(this.properties);
      this.form.patchValue(this.properties);
    }
    this.formChange();
  }
  /**
   * 侦听from数据变动，并写入到entity
   */
  formChange() {
    const values = this.form.value;
    for (const key in values) {
      if (values.hasOwnProperty(key)) {
        const control = this.form.get(key);
        control.valueChanges.forEach((value: string) =>
          this.entity ? (this.entity.properties[key] = value) : ''
        );
      }
    }
  }

  onReset() {
    this.form.reset(this.properties);
  }

  onSubmit() {
    this.properties = this.getPageData();
  }

  executeBusiness(config) {
    const page = this;
    this.rendererMeta.executeBusiness(config, page);
  }

  close() {
    if (this.isWindow === true) {
      // this.defaultModal.hide();
    } else {
      window.history.back();
    }
  }

  refresh() {
    console.log('do... refresh');
  }

  validatePage() {
    return true;
  }

  getPageData() {
    const params: any = {
      javaClass: 'com.homolo.datamodel.domain.Entity',
      typeId: this.type.getId()
    };
    params.properties = this.form.value;
    const parentId = params.properties.parentId;
    delete params.properties.parentId;
    if (this.entity && this.entity.id) {
      params.entityId = this.entity.id;
    }
    if (this.parentId) {
      params.parentId = this.parentId;
    } else if (parentId) {
      params.parentId = parentId;
    }
    // TODO relation\ parentId\ callback
    return params;
  }
}
