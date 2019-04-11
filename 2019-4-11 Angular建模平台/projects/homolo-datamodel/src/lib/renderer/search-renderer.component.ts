import {
  Component,
  OnInit,
  Input,
  OnChanges,
  ViewChild,
  ViewContainerRef
} from '@angular/core';
import { ActivatedRoute, ParamMap, Router } from '@angular/router';
import {
  ReactiveFormsModule,
  FormBuilder,
  FormControl,
  Validators,
  FormGroup,
  Form
} from '@angular/forms';

import { Operator } from '../enums/operator';
import { Type } from '../models/type';
import { Business } from '../models/business';
import { Mode } from '../enums/mode';
import { SearchView, ViewInfo } from '../models/view';
import { MetaLoader } from '../services/meta-loader.service';
import { DataService } from '../services/data.service';
import { RendererMeta } from '../services/renderer-meta.service';
import { Widget } from '../models/widget';
import { OperationComponent } from '../compontents/operation/operation.component';
import { NzMessageService, NzModalService } from 'ng-zorro-antd';
@Component({
  selector: 'dm-search',
  templateUrl: 'search-renderer.component.html',
  styleUrls: ['../../assets/scss/homolo-datamodel.scss']
})
export class SearchRendererComponent implements OnChanges {
  @Input()
  view: SearchView;
  @Input()
  type: Type;
  @Input()
  business: Business;
  actionId: string;
  pageIndex = 1;
  pageSize = 10;
  total = 1;
  loading = true;
  items = [];
  defaultCondition = {};
  form: FormGroup;
  currentSelectedRow: any;
  currentSelectedRows: Array<object>;
  viewInfo: ViewInfo;
  parentId: string;
  widgets: Array<Widget<any>>;
  nzLayout = 'horizontal';
  nzSpan: number;
  entityOperations: any;
  isShowReport = false;
  sortData = {
    sortBy: null,
    sortAsc: null
  };
  metaLoader = MetaLoader;

  expandForm = false;

  @ViewChild(OperationComponent)
  private operator: OperationComponent;

  @ViewChild('dmGrid')
  dmGrid;
  constructor(
    private dataService: DataService,
    private route: ActivatedRoute,
    private message: NzMessageService,
    private modalService: NzModalService,
    private rendererMeta: RendererMeta,
    private router: Router
  ) {}

  ngOnChanges() {
    const oldBusinessId = sessionStorage.getItem('businessId');
    if (oldBusinessId !== this.business.getId()) {
      sessionStorage.removeItem('pageIndex');
      sessionStorage.removeItem('SEARCHDATA');
    } else {
      const nowPageIndex = sessionStorage.getItem('pageIndex');
      if (nowPageIndex != null) {
        this.pageIndex = parseInt(nowPageIndex, 10);
      }
    }
    if (this.business != null) {
      this.type = this.metaLoader.loadType(this.business.getTypeName());
      this.viewInfo = this.type.getView(this.business.getView());
      this.view = this.viewInfo.definition as SearchView;
      const actionName = this.business.initAction || 'query';
      this.viewInfo = this.type.getView(this.business.getView());
      const initAction = this.type.getAction(actionName);
      this.buildSearchForm();
      this.pageSize = this.view.pageSize;
      if (initAction == null) {
        this.message.error('Init action:' + actionName + ' is not found!');
      } else {
        this.actionId = initAction.id;
        this.query({});
      }
      // 重新加载operator数据
      this.operator.checkUpdate();
    }
  }
  isDisplayField(field: string): boolean {
    return this.type.getDisplayField()
      ? this.type.getDisplayField().name === field
      : false;
  }

  // 标题点击也触发排序效果
  title_sort(column) {
    if (!column.sortable) {
      return;
    }
    if (column.nzSort === 'descend') {
      column.nzSort = 'ascend';
    } else if (column.nzSort === 'ascend') {
      column.nzSort = 'descend';
    } else {
      column.nzSort = 'ascend';
    }
    this.sort({ key: column.field, value: column.nzSort });
  }

  sort(sort: { key: string; value: string }): void {
    console.log(sort);
    const paramsObj = {};
    if (!sort.value) {
      return;
    }
    const SORTBY = 'sortBy';
    const SORTASC = 'sortAsc';
    if (sort.key != null) {
      paramsObj[SORTBY] = sort.key;
    }
    if (sort.value === 'descend') {
      paramsObj[SORTASC] = 'DESC';
    } else {
      paramsObj[SORTASC] = 'ASC';
    }
    this.sortData.sortBy = sort.key;
    this.sortData.sortAsc = paramsObj[SORTASC];
    this.query(paramsObj);
  }

  calcTableWidth() {
    /* let width = 0;
    for (const column of this.view.columns) {
      width += (column.width > 0 ? column.width : 200);
    }
    return width; */
    return this.view.columns.length > 8
      ? (this.view.columns.length / 8) * 100
      : 100;
  }

  calcColumnWidth(column) {
    if (column.width > 0) {
      return column.width + 'px';
    } else {
      return column.minWidth;
    }
  }
  expandClick() {
    let index = 0;
    const SHOW = 'show';
    for (const widget of this.widgets) {
      if (this.expandForm) {
        widget[SHOW] = (index > 2 ? false : true);
      } else {
        widget[SHOW] = true;
      }
      index++;
    }
  }
  buildSearchForm() {
    // process view conditions
    this.defaultCondition = {};
    const group: any = [];
    this.nzSpan = 8;
    this.widgets = new Array<Widget<any>>();
    const SEARCHDATA = JSON.parse(sessionStorage.getItem('SEARCHDATA'));
    // sessionStorage.removeItem('SEARCHDATA');
    if (this.view && this.view.conditions.length > 0) {
      let index = 0;
      for (const item of this.view.conditions) {
        const field = this.type.getField(item.field);
        const op: any = {};
        op.xtype = item.input;
        op.label = item.label;
        op.fieldName = item.field;
        op.config = item.config;
        op.defaultValue = item.defaultValue;
        op.required = false;
        op.schema = field ? field.getSchema() : null;
        op.array = field ? field.isArray() : false;
        op.nzLayout = this.nzLayout;
        op.nzSpan = this.nzSpan;
        const FIELD = 'field';
        const VALUE = 'value';
        const EXPRESSIONS = 'expressions';
        if (SEARCHDATA && SEARCHDATA.length > 0) {
          for (const list of Object.keys(SEARCHDATA)) {
            if (SEARCHDATA[list][FIELD] === item.field) {
              op.defaultValue = SEARCHDATA[list][VALUE];
            } else if (SEARCHDATA[list][EXPRESSIONS]) {
              const expressions = SEARCHDATA[list][EXPRESSIONS];
              if (expressions[0][FIELD] === item.field) {
                const value = [];
                expressions.forEach(v => {
                  value.push(v.value);
                });
                op.defaultValue = value;
              }
            }
          }
        }
        const widget: Widget<any> = new Widget(op);
        const SHOW = 'show';
        widget[SHOW] = (index > 2 ? false : true);
        this.widgets = [...this.widgets, widget];
        group[widget.fieldName] = widget.required
          ? new FormControl(widget.value || '', Validators.required)
          : new FormControl(widget.value || '');
        if (item.defaultValue) {
          this.defaultCondition[item.field] = {
            field: item.field,
            operator: item.defaultOperator ? item.defaultOperator : 'Contains',
            value: item.defaultValue
          };
          if (SEARCHDATA && SEARCHDATA.length > 0) {
            for (const key of Object.keys(SEARCHDATA)) {
              if (
                SEARCHDATA[key][EXPRESSIONS] &&
                SEARCHDATA[key][EXPRESSIONS].length > 0
              ) {
                // delete SEARCHDATA[key]['value'];
                this.defaultCondition[SEARCHDATA[key][EXPRESSIONS][0].field] =
                  SEARCHDATA[key];
              }
              this.defaultCondition[SEARCHDATA[key].field] = SEARCHDATA[key];
            }
          }
        }
        index++;
      }
    }
    this.form = new FormGroup(group);
    console.log('66666', this.widgets, this.form);
  }

  doReset() {
    sessionStorage.removeItem('SEARCHDATA');
    this.sortData = {
      sortBy: null,
      sortAsc: null
    };
    this.form.reset({});
    this.defaultCondition = {};
    for (const key in this.form.value) {
      if (this.form.value.hasOwnProperty(key)) {
        this.form.value[key] = null;
        const formControl = this.form.controls[key];
        formControl.setValue(null);
      }
    }
    this.refresh();
  }

  doSearch() {
    this.pageIndex = 1;
    const SEARCHDATA = this.getSearchData();
    sessionStorage.setItem('SEARCHDATA', JSON.stringify(SEARCHDATA));
    this.refresh();
  }

  getSearchData() {
    sessionStorage.setItem('pageIndex', this.pageIndex.toString());
    sessionStorage.setItem('businessId', this.business.getId());
    const array = [];
    const formValue = this.form.value;
    for (const key in formValue) {
      if (formValue.hasOwnProperty(key)) {
        const value = formValue[key];
        let defaultOp = -1;
        let condition = null;
        for (const item of this.view.conditions) {
          if (item.field === key) {
            condition = item;
            if (item.defaultOperator !== null && item.defaultOperator >= 0) {
              defaultOp = item.defaultOperator;
            }
          }
        }
        const INPUT = 'input';
        if (
          value &&
          value instanceof Array &&
          value.length === 2 &&
          condition &&
          (condition[INPUT] ===
            'com.homolo.datamodel.ui.component.DateField' ||
            condition[INPUT] ===
              'com.homolo.datamodel.ui.component.DateRangeField')
        ) {
          array.push({
            javaClass: 'com.homolo.datamodel.util.NestedExpression',
            operator: 'AND',
            expressions: [
              {
                javaClass: 'com.homolo.datamodel.util.FieldExpression',
                field: key,
                operator: 'Ge',
                value: value[0]
              },
              {
                javaClass: 'com.homolo.datamodel.util.FieldExpression',
                field: key,
                operator: 'Le',
                value: value[1]
              }
            ]
          });
        } else if (
          value &&
          value instanceof Array &&
          value.length === 2 &&
          condition &&
          condition[INPUT] ===
            'com.homolo.datamodel.ui.component.DoubleRangeField'
        ) {
          array.push({
            javaClass: 'com.homolo.datamodel.util.NestedExpression',
            operator: 'AND',
            expressions: [
              {
                javaClass: 'com.homolo.datamodel.util.FieldExpression',
                field: key,
                operator: 'Ge',
                value: value[0]
              },
              {
                javaClass: 'com.homolo.datamodel.util.FieldExpression',
                field: key,
                operator: 'Le',
                value: value[1]
              }
            ]
          });
        } else if (value && value instanceof Array) {
          array.push({
            field: key,
            operator: defaultOp >= 0 ? Operator[defaultOp] : 'In',
            value: value || ''
          });
        } else if (value) {
          array.push({
            field: key,
            operator: defaultOp >= 0 ? Operator[defaultOp] : 'Contains',
            value: value || ''
          });
        } else {
          if (this.defaultCondition[key]) {
            array.push(this.defaultCondition[key]);
          }
        }
      }
    }
    return array;
  }

  query(params: any) {
    this.loading = true;
    if (this.actionId != null) {
      const paramsObj = {};
      const PAGE = 'page';
      paramsObj[PAGE] = this.pageIndex;
      const PAGESIZE = 'pageSize';
      paramsObj[PAGESIZE] = this.pageSize;
      const SORT = 'sort';
      const DIR = 'dir';
      if (params.sortBy != null) {
        paramsObj[SORT] = params.sortBy;
      } else {
        paramsObj[SORT] = this.view.sortField;
      }
      if (params.sortAsc != null) {
        paramsObj[DIR] = params.sortAsc;
      } else {
        paramsObj[DIR] = this.view.sortAsc ? 'ASC' : 'DESC';
      }
      // const expressions = this.getSearchData();
      const SEARCHDATA = JSON.parse(sessionStorage.getItem('SEARCHDATA'));
      const expressions = SEARCHDATA ? SEARCHDATA : this.getSearchData(); // TODO 初始参数、高级查询、表达式的operator都尚未处理
      console.log('expressions', expressions);
      let initParams = {};
      if (this.business.getInitParams()) {
        /* initParams = eval('(' + this.business.getInitParams() + ')'); */
        initParams = this.business.getInitParams();
      }
      const EXPRESSION = 'expression';
      if (initParams && initParams[EXPRESSION]) {
        const expression = initParams[EXPRESSION];
        if (expression && expression instanceof Array) {
          expression.forEach(element => {
            expressions.push(element);
          });
        } else {
          expressions.push(expression);
        }
      }
      paramsObj[EXPRESSION] = expressions;
      this.items = new Array();
      this.dataService.invoke(this.actionId, paramsObj).then(result => {
        this.loading = false;
        this.total = result.total;
        this.entityOperations = {};
        result.items.forEach(item => {
          if (this.view.businessColumnVisible) {
            this.loadEntityOperations(item);
          }
          const PROPERTIES = 'properties';
          let entity = item[PROPERTIES];
          const $DISPLAYS = '$displays';
          const $displays = item[$DISPLAYS];
          entity = MetaLoader.apply(entity, $displays);
          const type = MetaLoader.loadType(item.typeId);
          if (type != null) {
            entity.$type = type.getDisplayAs();
          }
          const $PARENTNAME = '$parentName';
          entity.$parent = $displays[$PARENTNAME] || '';
          entity.id = item.id;
          entity.typeId = item.typeId;
          entity.dateCreated = item.dateCreated;
          // this.items.push(entity); 使用push方法不生效
          this.items = [...this.items, entity];
          item.checked = false;
        });
      });
    }
  }

  loadEntityOperations(entity: any) {
    const p = this;
    p.entityOperations[entity.id] = [];
    p.operator.getOperations().forEach(op => {
      if (Mode.Entity === op.mode) {
        let isDefault = false;
        p.business.operations.forEach(bop => {
          if (op.name === bop.name && bop.defaultOp === true) {
            isDefault = true;
          }
        });
        const enabled = p.rendererMeta.checkOperationExecutable(op, entity);
        if (!isDefault && enabled) {
          p.entityOperations[entity.id].push(op);
        }
      }
    });
  }

  getBusinessColumnOps(item) {
    return this.entityOperations ? this.entityOperations[item.id] : [];
  }

  entityOperationsClick(op, item) {
    this.currentSelectedRow = item;
    if (op.name === '删除') {
      this.trash('');
    } else {
      this.rendererMeta.doExecuteOperation(op.name, item.id, this);
    }
  }

  refreshStatus(event, item): void {
    // 单选
    if (this.view.multiCheck === false) {
      this.items.forEach(row => {
        row.checked = false;
      });
      if (event) {
        item.checked = true;
        this.currentSelectedRow = item;
      } else {
        this.currentSelectedRow = null;
      }
    } else {
      // 多选
      if (event) {
        item.checked = true;
        this.currentSelectedRow = item;
      } else {
        this.currentSelectedRow = null;
      }
      this.currentSelectedRows = [];
      this.items.forEach(row => {
        if (row.checked === true) {
          this.currentSelectedRow = item;
          this.currentSelectedRows.push(row);
        }
      });
    }
    const p = this;
    this.operator.getOperations().forEach(op => {
      let disabled = op.disabled;
      if (Mode.Entity === op.mode) {
        disabled = p.currentSelectedRow ? false : true;
      }
      // 如果被启用了就去检查Operation能未执行
      if (disabled === false) {
        p.rendererMeta.getEntity(
          p.currentSelectedRow.id,
          p.type.getId(),
          (data: any) => {
            op.disabled = !p.rendererMeta.checkOperationExecutable(op, data);
          }
        );
      } else {
        op.disabled = disabled;
      }
    });
  }

  entityClick(item) {
    this.currentSelectedRow = item;
    const page = this;
    this.rendererMeta.doExecuteOperation('DEFAULT', item.id, page);
  }

  rowDoubleClick(rowEvent) {
    if (rowEvent.row.selected === true) {
      this.currentSelectedRow = null;
    } else {
      this.currentSelectedRow = rowEvent.row;
    }
    const page = this;
    this.rendererMeta.doExecuteOperation('DEFAULT', rowEvent.row.item.id, page);
  }

  getSelectedRow() {
    return this.currentSelectedRow;
  }

  getSelectedRows() {
    return this.currentSelectedRows;
  }

  rowTooltip(item) {
    return item.name || item.title || '';
  }

  executeBusiness(config) {
    const page = this;
    this.rendererMeta.executeBusiness(config, page);
  }

  trash(entityId) {
    const page = this;
    const actionId = this.type.getName() + '@trash';
    if (!entityId) {
      const row = this.getSelectedRow();
      if (row == null) {
        this.message.error('请选择一条数据');
        return;
      } else {
        entityId = row.id;
      }
    }
    this.modalService.confirm({
      nzTitle: '<i>提示</i>',
      nzContent: '<b>您确认要删除吗？</b>',
      nzOnOk: () => {
        page.rendererMeta
          .executeAction({ id: actionId, params: { entityId: entityId || '' } })
          .then(result => {
            if (result.code === 1) {
              page.message.success('删除成功！');
              page.refresh();
            } else {
              page.message.error('删除失败！ code:' + result.code);
            }
          });
      },
      nzOnCancel: () => {}
    });
    /* if (!confirm('您确认要删除吗？')) {
      return;
    }
    this.rendererMeta.executeAction({ id: actionId, params: { entityId: entityId } }).then(result => {
      if (result.code === 1) {
        this.message.info('删除成功！');
        this.refresh();
      } else {
        this.message.error('删除失败！ code:' + result.code);
      }
    }); */
  }

  close() {}

  refresh() {
    // this.dmGrid.reloadItems();
    this.currentSelectedRow = null;
    this.query({});
  }

  validatePage() {
    return true;
  }

  getPageData(operation) {
    const row = this.getSelectedRow();
    const rows = this.getSelectedRows() || [];
    const typeIds = [];
    let typeData = MetaLoader.loadType(this.business.getTypeName());
    while (typeData) {
      typeIds.push(typeData.getId());
      typeData = MetaLoader.loadType(typeData.superTypeName);
    }
    let parentId = null;
    if (this.parentId) {
      parentId = this.parentId;
    }
    const parentType = MetaLoader.loadType(this.type.getParentTypeName());
    if (parentType) {
      const parentTypeId = parentType.getId();
      if (typeIds.includes(parentTypeId)) {
        // 当页面传入parentId且选中了一行 以选中的为准
        if (row != null) {
          parentId = row.getId();
        }
      }
    }
    const params: any = {
      parentId: parentId || ''
    }; // , relationId: this.businessData.relationId};
    const ids = [];
    for (const i in rows) {
      if (rows[i]) {
        const ID = 'id';
        ids.push(rows[i][ID]);
      }
    }
    if (row) {
      params.entityId = row.id;
      params.typeId = this.type.getId();
      // 如果是报表列表，就调用其子类业务
      //  if (params.typeId === '164e000adfccac1aba8d169be65e2540') {
      //    params.typeId = row.typeId;
      //  }
      params.ids = ids;
    }
    return params;
  }
}
