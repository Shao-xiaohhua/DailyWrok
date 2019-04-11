import { Injectable } from '@angular/core';
import { HttpClient} from '@angular/common/http';

import { Type } from '../models/type';
import { Business } from '../models/business';
import { Action } from '../models/action';
import { ViewInfo } from '../models/view';
import { Field } from '../models/field';
import { Module } from '../models/module';
import { DataType } from '../models/data-type';
import { RestClient } from 'homolo-framework';
import { map, catchError } from 'rxjs/operators';
import { throwError } from 'rxjs';
@Injectable({
  providedIn: 'root'
})
export class MetaLoader {

  static TYPE_MAP = new Map<string, Type>();
  static MODULE_MAP = new Map<string, Module>();
  static DATATYPE_MAP = new Map<string, DataType>();

  static loadType(nameOrId: string): Type {
    return MetaLoader.TYPE_MAP.get(nameOrId);
  }

  static loadBusiness(name: string): Business {
    if (name == null) {
      return null;
    }
    const ss = name.split('@');
    const type = this.loadType(ss[0]);
    return type && type.getBusiness(ss[1]);
  }

  static loadAction(name: string): Action {
    if (name == null) {
      return null;
    }
    const ss = name.split('@');
    const type = this.loadType(ss[0]);
    return type && type.getAction(ss[1]);
  }

  static loadView(name: string): ViewInfo {
    if (name == null) {
      return null;
    }
    const ss = name.split('@');
    const type = this.loadType(ss[0]);
    return type && type.getView(ss[1]);
  }

  static loadFeild(name: string): Field {
    if (name == null) {
      return null;
    }
    const ss = name.split('@');
    const type = this.loadType(ss[0]);
    return type && type.getField(ss[1]);
  }

  static getSuperType(type: Type): Type {
    return type.superType && this.loadType(type.superTypeName);
  }

  static loadDataType(name: string): DataType {
    return MetaLoader.DATATYPE_MAP.get(name);
  }

  static hasSuperType(type: Type): boolean {
    return this.getSuperType(type) != null;
  }

  static getParentType(type: Type): Type {
    return type.parentType && this.loadType(type.parentTypeName);
  }

  static hasParentType(type: Type): boolean {
    return this.getParentType(type) != null;
  }

  static loadModule(nameOrId: string): Module {
    return MetaLoader.MODULE_MAP.get(nameOrId);
  }

  // config里的属性合并到object里
  static apply(object: object, config: object): object {
    if (object && config && typeof config === 'object') {
      // tslint:disable-next-line:forin
      for (const key in config) {
        object[key] = config[key];
      }
    }
    return object;
  }

  static isString(value) {
    return typeof value === 'string';
  }

  static isBoolean(value) {
    return typeof value === 'boolean';
  }


  constructor(
    private http: HttpClient,
    private restClient: RestClient
  ) {}

  public load() {
    const jsonData = {};
    const arrayUrl = [
      this.restClient.getCollectionURL('dm.Meta', 'metadata'),
    ];
    console.log(arrayUrl);
    return Promise.all(
      arrayUrl.map((url, i) => {
        return new Promise((resolve, reject) => {
          const time = new Date().getTime();
          this.http
            .get(url)
            .pipe(map(res => res))
            .pipe(
              catchError(
                (error: any): any => {
                  resolve(true);
                  return throwError(error || 'Server error');
                }
              )
            )
            .subscribe(response => {
              jsonData['data' + i] = response;
              resolve(true);
            });
        });
      })
    ).then(response => {
      console.log(jsonData);
      const MODULES = 'modules';
      jsonData['data' + 0][MODULES].forEach(moduleData => {
        const TYPES = 'types';
        moduleData[TYPES].forEach(typeData => {
          const t = new Type(typeData);
          MetaLoader.TYPE_MAP.set(t.name, t);
          MetaLoader.TYPE_MAP.set(t.id, t);
        });
        MetaLoader.TYPE_MAP.forEach(type => {
          if (type.hasParent()) {
            type.setParent(MetaLoader.TYPE_MAP.get(type.getParentTypeName()));
          }
          if (type.hasSuper()) {
            type.setSuper(MetaLoader.TYPE_MAP.get(type.getSuperTypeName()));
          }
        });
      });
      const DATATYPES = 'dataTypes';
      jsonData['data' + 0][DATATYPES].forEach(data => {
        const dt = new DataType(data);
        MetaLoader.DATATYPE_MAP.set(dt.name, dt);
      });
    });
  }
}

export function loadMetaData(loader: MetaLoader) {
  return () => loader.load();
}
