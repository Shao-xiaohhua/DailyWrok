import { Component, Input, OnChanges, ViewContainerRef, ViewChild } from '@angular/core';
import { ActivatedRoute, ParamMap, Router } from '@angular/router';

import { Entity } from '../models/entity';
import { Pagination } from '../models/pagination';
import { Mode } from '../enums/mode';
import { Type } from '../models/type';
import { Business } from '../models/business';
import { ViewInfo, ListView } from '../models/view';
import { MetaLoader } from '../services/meta-loader.service';
import { DataService } from '../services/data.service';
import { RendererMeta } from '../services/renderer-meta.service';
import { OperationComponent } from '../compontents/operation/operation.component';
import { NzMessageService, NzModalService } from 'ng-zorro-antd';

@Component({
  selector: 'dm-list',
  styleUrls: ['../../assets/scss/homolo-datamodel.scss'],
  templateUrl: './list-renderer.component.html'
})
export class ListRendererComponent implements OnChanges {
  type: Type;
  view: ListView;
  @Input() business: Business;
  pagination: Pagination<Entity>;
  actionId: string;
  pageIndex = 1;
  pageSize = 10;
  total = 1;
  viewInfo: ViewInfo;
  items = [];
  currentSelectedRow: any;
  currentSelectedRows: Array<object>;
  parentId: string;
  translations = {
    indexColumn: '索引',
    expandColumn: '展开列',
    selectColumn: '选择列',
    paginationLimit: '分页',
    paginationRange: '查询结果'
  };
  loading: boolean;
  entityOperations: any;
  sortData = {
    sortBy: null,
    sortAsc: null
  };
  @ViewChild('dmGrid') dmGrid;
  @ViewChild(OperationComponent)
  private operator: OperationComponent;
  constructor(
    private dataService: DataService,
    private message: NzMessageService,
    private route: ActivatedRoute,
    private modalService: NzModalService,
    private rendererMeta: RendererMeta,
    private router: Router) {
  }

  ngOnChanges() {
    // console.log('list renderer changes');
    if (this.business != null) {
      this.type = MetaLoader.loadType(this.business.getTypeName());
      this.viewInfo = this.type.getView(this.business.getView());
      this.view = this.viewInfo.definition as ListView;
      const actionName = this.business.initAction || 'query';
      const initAction = this.type.getAction(actionName);
      if (initAction == null) {
        this.message.error('Init action:' + actionName + ' is not found!');
      } else {
        this.actionId = initAction.id;
        this.query({});
      }
    }
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
      this.items = new Array();
      this.dataService.invoke(this.actionId, paramsObj).then(result => {
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
          entity.$parent = $displays[$PARENTNAME];
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
  loadEntityOperations(entity) {
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

  rowClick(rowEvent) {
    if (rowEvent.row.selected === true) {
      this.currentSelectedRow = null;
    } else {
      this.currentSelectedRow = rowEvent.row;
    }
    // console.log('Clicked: ' + rowEvent.row.item.name, rowEvent.row.item.id, rowEvent.row.selected);
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

  rowTooltip(item) { return item.name; }

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
  }

  refresh() {
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
