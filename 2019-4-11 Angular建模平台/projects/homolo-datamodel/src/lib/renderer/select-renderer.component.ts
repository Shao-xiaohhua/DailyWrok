import { Component, AfterViewInit, Input, OnChanges, ViewChild, ViewContainerRef } from '@angular/core';
import { ActivatedRoute, ParamMap } from '@angular/router';
import { ReactiveFormsModule, FormGroup, FormControl, Form } from '@angular/forms';

import { Operator } from '../enums/operator';
import { Type } from '../models/type';
import { Business } from '../models/business';
import { SearchView, ViewInfo } from '../models/view';
import { MetaLoader } from '../services/meta-loader.service';
import { DataService } from '../services/data.service';
import { RendererMeta } from '../services/renderer-meta.service';
import { Widget } from '../models/widget';
import { NzMessageService } from 'ng-zorro-antd';

@Component({
  selector: 'dm-select',
  templateUrl: 'select-renderer.component.html',
  styleUrls: ['../../assets/scss/homolo-datamodel.scss']
})

export class SelectRendererComponent implements AfterViewInit, OnChanges {
  view: SearchView;
  type: Type;
  @Input() business: Business;
  isVisible = true;
  actionId: string;
  items = [];
  total = 0;
  pageIndex = 1;
  pageSize = 10;
  form: FormGroup;
  currentSelectedRow: any;
  viewInfo: ViewInfo;
  parentId: string;
  widgets: Array<Widget<any>>;
  callback: any;
  config: object = {};
  isWindow: boolean;
  isMulti = false;
  partWord: string;
  showmore = true;
  // 是否一开始需要加载数据
  initLoadData = true;
  sortData = {
    sortBy: null,
    sortAsc: null
  };
  expandForm = false;
  loading = true;
  nzLayout = 'horizontal';
  nzSpan: number;
  @ViewChild('selectGrid') dmGrid: any;
  constructor(
    private dataService: DataService,
    private route: ActivatedRoute,
    private message: NzMessageService,
    private rendererMeta: RendererMeta
  ) {}

  ngAfterViewInit() {
    this.openModal();
  }

  ngOnChanges() {
    console.log('selectrender--------business', this.business, this.view, this.viewInfo);
    if (this.isWindow) {
      MetaLoader.apply(this, this.config);  // 合并参数
    }
    if (this.business != null) {
      this.type = MetaLoader.loadType(this.business.getTypeName());
      this.viewInfo = this.type.getView(this.business.getView());
      this.view = this.viewInfo.definition as SearchView;
      const actionName = this.business.initAction || 'query';
      this.viewInfo = this.type.getView(this.business.getView());
      console.log('viewInfo', this.viewInfo.refreshable);
      const initAction = this.type.getAction(actionName);
      // this.pageSize = this.view.pageSize;
      this.buildSearchForm();
      if (initAction == null) {
        this.message.error('Init action:' + actionName + ' is not found!');
      } else {
        this.actionId = initAction.id;
        if (this.initLoadData) {
          this.query({});
        }

      }
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
    this.nzSpan = 8;
    const group: any = [];
    this.widgets = new Array<Widget<any>>();
    if (this.view && this.view.conditions.length > 0) {
      let index = 0;
      for (const item of this.view.conditions) {
        const field = this.type.getField(item.field);
        const widget: Widget<any> = new Widget();
        widget.xtype = item.input;
        widget.label = item.label;
        widget.fieldName = item.field;
        widget.required = false;
        widget.schema = field ? field.getSchema() : null;
        widget.array = field ? field.isArray() : false;
        widget.nzLayout = this.nzLayout;
        widget.nzSpan = this.nzSpan;
        const SHOW = 'show';
        widget[SHOW] = (index > 2 ? false : true);
        this.widgets = [...this.widgets, widget];

        group[widget.fieldName] = new FormControl(widget.value || '');
        index++;
      }
    }
    this.form = new FormGroup(group);
    console.log('select', this.widgets);
  }

  doSearch() {
    this.pageIndex = 1;
    this.refresh();
  }

  doReset() {
    this.sortData = {
      sortBy: null,
      sortAsc: null
    };
    this.form.reset({});
    for (const key in this.form.value) {
      if (this.form.value.hasOwnProperty(key)) {
        this.form.value[key] = null;
        const formControl = this.form.controls[key];
        formControl.setValue(null);
      }
    }
    this.refresh();
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
    if (sort.key != null) {
      paramsObj[SORTBY] = sort.key;
    }
    const SORTASC = 'sortAsc';
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
    return this.view.columns.length > 4
      ? (this.view.columns.length / 4) * 100
      : 100;
  }

  calcColumnWidth(column) {
    if (column.width > 0) {
      return column.width + 'px';
    } else {
      return column.minWidth;
    }
  }

  query(params: any) {
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
      if (this.partWord) {
        const PARTWORD = 'partWord';
        paramsObj[PARTWORD] = this.partWord;
      }
      const EXPRESSION = 'expression';
      paramsObj[EXPRESSION] = this.getSearchData(); // TODO 初始参数、高级查询、表达式的operator都尚未处理
      this.dataService.invoke(this.actionId, paramsObj).then(result => {
        this.items = new Array();
        this.total = result.total;
        this.initLoadData = true;
        result.items.forEach((item: any) => {
          const PROPERTIES = 'properties';
          let entity = item[PROPERTIES];
          const $DISPLAYS = '$displays';
          const $displays = item[$DISPLAYS];
          entity = MetaLoader.apply(entity, $displays);
          entity.id = item.id;
          entity.typeId = item.typeId;
          entity.dateCreated = item.dateCreated;
          // this.items.push(entity); 使用push方法不生效
          this.items = [...this.items, entity];
          this.loading = false;
        });
      });
    }
  }

  getSearchData() {
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
            if (item.defaultOperator) {
              defaultOp = item.defaultOperator;
            }
          }
        }
        const INPUT = 'input';
        if (value && value instanceof Array && value.length === 2 && condition &&
           condition[INPUT] === 'com.homolo.datamodel.ui.component.DateField') {
          array.push({
            javaClass: 'com.homolo.datamodel.util.NestedExpression',
            operator: 'AND',
            expressions: [{
            field: key,
            operator: 'Ge',
            value: value[0]
          }, {
            field: key,
            operator: 'Le',
            value: value[1]
          }]
          });
        } else if (value && value instanceof Array) {
          array.push({
            field: key,
            operator: (defaultOp >= 0 ? Operator[defaultOp] : 'In'),
            value: value || ''
          });
        } else if (value) {
          array.push({
            field: key,
            operator: (defaultOp >= 0 ? Operator[defaultOp] : 'Contains'),
            value: value || ''
          });
        }
      }
    }
    return array;
  }

  entityClick(item) {
    if (this.isMulti === true) {
      item.checked = true;
    } else {
      this.currentSelectedRow = item;
    }
    this.doConfirm();
  }

  refreshStatus(event, item): void {
    if (this.isMulti === false) {
      this.items.forEach(row => {
        row.checked = false;
      });
      if (event) {
        item.checked = true;
        this.currentSelectedRow = item;
      } else {
        this.currentSelectedRow = null;
      }
    }

  }

  getSelectedRow() {
    return this.currentSelectedRow;
  }

  getSelectedRows() {
    const rows = [];
    this.items.forEach(row => {
      if (row.checked) {
        rows.push(row);
      }
    });
    return rows;
  }

  rowTooltip(item) { return item.name; }

  executeBusiness(config) {
    const page = this;
    this.rendererMeta.executeBusiness(config, page);
  }


  close() {
    if (this.isWindow === true) {
      this.isVisible = false;
    } else {
      window.history.back();
    }
  }
  refresh() {
    // this.dmGrid.reloadItems();
    this.currentSelectedRow = null;
    this.query({});
  }

  openModal() {
    this.isVisible = true;
  }

  closeModal() {
    this.isVisible = false;
  }

  doConfirm() {
    const row = this.getSelectedRow();
    const rows = this.getSelectedRows();
    const cb = this.callback;
    if (this.isMulti === true && cb && rows) {
      const items = new Array();
      rows.forEach(r => {
        items.push(r);
      });
      cb(items);
    } else if (cb && row) {
      cb(row);
    }
    this.currentSelectedRow = null;
    this.items.forEach(r => {
      r.checked = false;
    });
    this.close();
  }

  getPageData(operation) {
    const row = this.getSelectedRow();
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
      if (typeIds.includes(parentTypeId)) { // 当页面传入parentId且选中了一行 以选中的为准
        if (row != null) {
          parentId = row.getId();
        }
      }
    }
    const params: any = {
      parentId: parentId || ''
    }; // , relationId: this.businessData.relationId};
    if (row) {
      params.entityId = row.id;
    }
    return params;
  }
}
