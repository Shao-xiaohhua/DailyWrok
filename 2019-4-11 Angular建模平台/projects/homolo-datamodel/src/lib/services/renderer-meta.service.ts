import { Injectable, Inject } from '@angular/core';
import { Router } from '@angular/router';

import { Type } from '../models/type';
import { Action } from '../models/action';
import { Mode } from '../enums/mode';
import { RestClient } from 'homolo-framework';
import { MetaLoader } from './meta-loader.service';
import { FormControl, FormGroup, Validators } from '@angular/forms';
import { Fieldset } from '../models/widget';

@Injectable({
  providedIn: 'root'
})
export class RendererMeta {
  ___ENTITY_CACHE__: {};

  executeAction(config: any): Promise<any> {
    config = config || {};
    const id = config.id;
    // 根据 business 的 viewRenderer 的类型，分别处理渲染的逻辑
    const params = config.params;
    let actionData: Action = config.actionData;
    if (actionData == null && id != null) {
      actionData = MetaLoader.loadAction(id);
    } else if (config.typeId && config.actionName) {
      actionData = MetaLoader.loadType(config.typeId).getAction(
        config.actionName,
      );
    } else if (config.typeName && config.actionName) {
      actionData = MetaLoader.loadType(config.typeName).getAction(
        config.actionName,
      );
    }
    const callback = config.callback;
    return this.restClient.request(
      'dm.DataService',
      actionData.getId(),
      'invoke',
      params,
    );
  }

  executeBusiness = function(config, page) {
    config = config || {};
    // 根据 business 的 viewRenderer 的类型，分别处理渲染的逻辑
    let businessData = config.businessData;
    if (businessData == null) {
      if (config.id != null) {
        businessData = MetaLoader.loadBusiness(config.id);
      } else if (config.typeName && config.businessName) {
        businessData = MetaLoader.loadBusiness(
          config.typeName + '@' + config.businessName,
        );
      } else if (config.typeId && config.businessName) {
        businessData = MetaLoader.loadType(config.typeId).getBusiness(
          config.businessName,
        );
      }
    } else {
      if (!businessData.getId) {
        const type = MetaLoader.loadType(businessData.typeId);
        businessData = type.getBusiness(businessData.name);
      }
    }
    if (businessData == null) {
      page.message.error('没有找到相关的业务定义!', '错误', {
        dismiss: 'click',
      });
      return;
    }
    if (businessData.getMode() === Mode.Entity) {
      // if (!config.entityData && config.entityId) {
      //     // config.entityData = DataModel.getEntity(config.entityId);
      // }
      // if (!config.entityData) {
      //     page.message.error('实体数据不存在！', '错误', { dismiss: 'click' });
      //     return;
      // }
      if (!config.entityId) {
        page.message.error('实体数据不存在！', '错误', { dismiss: 'click' });
        return;
      }
    }
    this.executor(businessData, config, page);
  };

  executor(business, config, page) {
    if (
      'com.homolo.datamodel.ui.executor.JavaScript' === business.getExecutor()
    ) {
      if (!config.entityData && config.entityId) {
        this.getEntity(config.entityId, business.typeName, (data) => {
          const context = {
            type: MetaLoader.loadType(business.getTypeName()),
            entity: data,
            config: config || {},
            returnValue: null,
          };
          // context['environment'] = this.env;
          const entity = data;
          const callback = config.callback;
          // tslint:disable-next-line: no-eval
          const r = eval(
            '(function(context){' + business.getContent() + '})(context);',
          );
          if (typeof r !== 'undefined' && callback) {
            callback(r);
          }
        });
      } else {
        const context = {
          type: MetaLoader.loadType(business.getTypeName()),
          entity: config.entityData,
          config: config || {},
          returnValue: null,
        };
        // context['environment'] = this.env;
        const callback = config.callback;
        // tslint:disable-next-line: no-eval
        const r = eval(
          '(function(context){' + business.getContent() + '})(context);',
        );
        if (typeof r !== 'undefined' && callback) {
          callback(r);
        }
      }
    } else {
      let url = '/business/' + business.getId();
      const paramsStr = this.getQuery(config);
      if (paramsStr) {
        url += '?' + paramsStr;
      }
      this.router.navigateByUrl(url, { skipLocationChange: false });
    }
  }

  getEntity(id, typeId, callback) {
    if (!this.___ENTITY_CACHE__) {
      this.___ENTITY_CACHE__ = {};
    }
    const cache = this.___ENTITY_CACHE__;
    const cv = cache[id];
    if (cv != null) {
      const t = new Date().getTime();
      if (t - cv.time < 100) {
        callback(cv.entity);
      }
    }
    this.restClient
      .request('dm.Entity', id, 'compose', { typeId: typeId || ''})
      .then(data => {
        console.log('cacheEntity', data);
        cache[id] = {
          time: new Date().getTime(),
          entity: data,
        };
        callback(data);
      });
  }

  getQuery(params) {
    const sb = [];
    if (typeof params === 'string') {
      return params;
    }
    for (const name in params) {
      if (params.hasOwnProperty(name)) {
        const v = params[name];
        if (v === null || !v) {
          continue;
        }
        if (v instanceof Array) {
          for (const o of  v) {
            if (sb.length > 0) {
              sb.push('&');
            }
            sb.push(encodeURIComponent(name));
            sb.push('=');
            sb.push(encodeURIComponent(o));
          }
        } else {
          if (typeof v === 'object' || typeof v === 'function') {
            continue;
          }
          if (sb.length > 0) {
            sb.push('&');
          }
          sb.push(encodeURIComponent(name));
          sb.push('=');
          sb.push(encodeURIComponent(v));
        }
      }
    }
    return sb.join('');
  }

  doExecuteOperation = function(name, entityId, page) {
    const data = page.getPageData();
    const businessData = page.business;
    const operations = businessData.getOperations();
    let operation = null;
    if (operations && operations.length > 0) {
      for (const op of operations) {
        if (op.name === name || (name === 'DEFAULT' && op.defaultOp === true)) {
          operation = op;
          break;
        }
      }
    }
    if (!operation) {
      if (name === 'DEFAULT') {
        return;
      } else {
        page.message.error('操作不存在！', '错误', { dismiss: 'click' });
        return;
      }
    }
    let params = entityId
      ? {
          entityId: entityId || '',
        }
      : {};
    if (operation.parameter === 'None') {
      // do nothing
    } else if (operation.parameter === 'PageData') {
      params = MetaLoader.apply(params, page.getPageData(operation));
    } else if (operation.parameter === 'Custom' && operation.params) {
      params = MetaLoader.apply(
        params,
        // tslint:disable-next-line: no-eval
        eval('(function(params){ ' + operation.params + '})(params)'),
      );
    }
    if (operation.validator) {
      // tslint:disable-next-line:no-eval
      const vr = eval(
        '(function(params){ ' + operation.validator + '})(params)',
      );
      if (vr === false) {
        return;
      }
    } else if (!page.validatePage(operation)) {
      return;
    }
    const callback = this.createOperationCallback(operation, page);
    const TYPEID = 'typeId';
    const typeData = params[TYPEID]
      ? MetaLoader.loadType(params[TYPEID])
      : businessData.getType();
       // params['environment'] = this.env;
    if (operation.type === 'Business') {
      const biz = typeData.getBusiness(operation.content);
      // const biz = businessData.getType().getBusiness(operation.content);
      if (biz == null) {
        page.message.error('Operation business not found!', '错误', {
          dismiss: 'click',
        });
        return;
      }
      this.doExecuteBusiness(biz, params, callback, page);
    } else if (operation.type === 'Action') {
      const act = typeData.getAction(operation.content);
      if (act == null) {
        page.message.error('Operation action not found!', '错误', {
          dismiss: 'click',
        });
        return;
      }
      this.doExecuteAction(act, params, callback, page);
    } else if (operation.type === 'Script') {
      // tslint:disable-next-line:no-eval
      const r = eval(
        '(function(params, callback) { ' +
          operation.content +
          '})(params, callback)',
      );
      if (r !== undefined) {
        callback(r);
      }
    } else {
      page.message.error('Unknow operation type!', '错误', {
        dismiss: 'click',
      });
    }
  };

  doExecuteAction = function(
    action: Action,
    params: object,
    callback: any,
    page: any,
  ) {
    this.executeAction({ actionData: action, params: params || {}}).then(result => {
      const r = result;
      if (r === null || (r.code != null && r.code !== 1)) {
        callback(false, r, page);
      } else {
        page.changed = true;
        callback(true, r, page);
      }
    });
  };

  doExecuteBusiness = function(business, params, callback, page) {
    // const ok = this.controller.checkEntityGrants(business.getId(), params.entityId);
    // if (ok === false) {
    //     alert('您没有执行该业务功能的权限！');
    //     return;
    // }
    if (business.getMode() === Mode.Entity && params.entityId == null) {
      page.message.error('没有指定 Entity 对象！', '错误', {
        dismiss: 'click',
      });
      return;
    }
    const p = this;
    if (business.getMode() === Mode.Entity) {
      this.checkBusinessExecutable(business, params.entityId, page, (
        c,
      ) => {
        if (c === false) {
          return;
        } else if (typeof c === 'string' && c !== '') {
          page.message.error('不能执行,原因:' + c, '错误', {
            dismiss: 'click',
          });
          return;
        }
        const typeIdList = [];
        let getTypeData: Type = business.getType();
        while (getTypeData) {
          typeIdList.push(getTypeData.getId());
          getTypeData = MetaLoader.loadType(getTypeData.superTypeName);
        }
        let parentsId = null;
        if (business.getMode() === Mode.Collection) {
          delete params.entityId;
          if (page.parentId) {
            parentsId = page.parentId;
          }
          // 当页面传入parentId且选中了一行 以选中的为准
          if (typeIdList.includes(business.getType().getId())) {
            parentsId = params.parentId;
          }
        }
        const EntityConfig = {
          id: business.getId(),
          entityId: params.entityId,
          parentId: parentsId,
          relationId: page.relationData && page.relationData.id,
          relationField: page.relationField && page.relationField.getName(),
          params: params || {},
          callback: callback || null,
          opener: page,
        };
        p.executeBusiness(EntityConfig, page);
      });
      return;
    }
    const typeIds = [];
    let typeData: Type = business.getType();
    while (typeData) {
      typeIds.push(typeData.getId());
      typeData = MetaLoader.loadType(typeData.superTypeName);
    }
    let parentId = null;
    if (business.getMode() === Mode.Collection) {
      delete params.entityId;
      if (page.parentId) {
        parentId = page.parentId;
      }
      // 当页面传入parentId且选中了一行 以选中的为准
      if (typeIds.includes(business.getType().getId())) {
        parentId = params.parentId;
      }
    }
    const config = {
      id: business.getId(),
      entityId: params.entityId,
      parentId: parentId || '',
      relationId: page.relationData && page.relationData.id,
      relationField: page.relationField && page.relationField.getName(),
      params: params || {},
      callback: callback || null,
      opener: page,
    };
    this.executeBusiness(config, page);
  };

  checkBusinessExecutable = function(business, entity, page, callback) {
    if (!business) {
      callback(false);
    }
    const condition = business.getCondition() || '';
    if (condition !== '') {
      if (MetaLoader.isString(entity)) {
        if (page.entity) {
          entity = page.entity;
          // tslint:disable-next-line:no-eval
          callback(eval('(function(){ ' + condition + '})()'));
        } else {
          this.getEntity(entity, business.typeName, (data) => {
            entity = data;
            // tslint:disable-next-line: no-eval
            callback(eval('(function(){ ' + condition + '})()'));
          });
        }
      }
    } else {
      callback(true);
    }
  };

  createOperationCallback(operation, page) {
    return (r, result) => {
      const printError = (Operation, Result, Page) => {
        const msg = (Result && Result.description) || '';
        Page.message.error(Operation.name + '失败!' + msg, '错误', {
          dismiss: 'click',
        });
      };
      if (operation.callback === 'Close') {
        if (r) {
          page.close();
          page.message.success('操作成功');
        } else {
          if (result.description) {
            page.message.error(result.description);
          }
          // this.printError(operation, result, page);
        }
      } else if (operation.callback === 'Back') {
        if (r) {
          page.close();
          page.message.success('操作成功');
        } else {
          printError(operation, result, page);
        }
      } else if (operation.callback === 'Refresh') {
        if (r) {
          page.refresh();
          page.message.success('操作成功');
        } else {
          printError(operation, result, page);
        }
      } else if (operation.callback === 'Script') {
        if (r) {
          if (operation.onSuccess) {
            // tslint:disable-next-line: no-eval
            eval('(function(result){ ' + operation.onSuccess + '})(result)');
          } else {
            // tslint:disable-next-line:no-eval
            page.message.success('操作成功');
            // eval('(function(result){ ' + operation.onSuccess + '})(result)');
          }
        } else {
          if (operation.onFailure) {
            // tslint:disable-next-line: no-eval
            eval('(function(result){ ' + operation.onFailure + '})(result)');
          } else {
            // tslint:disable-next-line:no-eval
            printError(operation, result, page);
          }
        }
      }
    };
  }

  checkOperationExecutable(op, entity) {
    const page = this;
    if (!op) {
      return false;
    }
    let condition = op.condition || '';
    condition = condition.trim();
    if (condition !== '') {
      // tslint:disable-next-line: no-eval
      return eval('(function(){ ' + condition + '})()');
    } else {
      return true;
    }
  }

  printError(operation, result, page) {
    const msg = (result && result.description) || '';
    page.message.error(operation.name + '失败!' + msg, '错误', {
      dismiss: 'click',
    });
  }

  toFormGroup(fieldsets: Fieldset[]) {
    const group: any = [];
    fieldsets.forEach(fieldset => {
        fieldset.widgets.forEach(widget => {
            group[widget.fieldName] = widget.required ? new FormControl(widget.value || '', Validators.required)
                                                      : new FormControl(widget.value || '');
        });
    });
    return new FormGroup(group);
  }
  constructor(private restClient: RestClient, private router: Router, @Inject('env') private env) {}
}
