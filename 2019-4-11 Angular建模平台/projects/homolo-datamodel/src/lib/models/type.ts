import { Field } from './field';
import { Business } from './business';
import { Action } from './action';
import { ViewInfo } from './view';

export class Type {
  serialVersionUID: string;
  id: string;
  name: string;
  displayAs: string;
  description: string;
  parentType: Type;
  superType: Type;
  parentTypeName: string;
  superTypeName: string;
  system: boolean;
  fields = new Array<Field>();
  fieldOwns = new Array<Field>();
  fieldMap = new Map<string, Field>();
  businessMap = new Map<string, Business>();
  businessOwns = new Array<Business>();
  actionMap = new Map<string, Action>();
  actionOwns = new Array<Action>();
  viewMap = new Map<string, ViewInfo>();
  viewOwns = new Array<ViewInfo>();
  properties: Map<string, object>;

  constructor(jsonData: object) {
    const SERIALVERSIONUID = 'serialVersionUID';
    this.serialVersionUID = jsonData[SERIALVERSIONUID];
    const ID = 'id';
    this.id = jsonData[ID];
    const NAME = 'name';
    this.name = jsonData[NAME];
    const DISPLAYAS = 'displayAs';
    this.displayAs = jsonData[DISPLAYAS];
    const DESCRIPTION = 'description';
    this.description = jsonData[DESCRIPTION];
    const PARENTTYPE = 'parentType';
    this.parentTypeName = jsonData[PARENTTYPE];
    const SUPERTYPE = 'superType';
    this.superTypeName = jsonData[SUPERTYPE];
    const PROPERTIES = 'properties';
    this.properties = jsonData[PROPERTIES];
    const SYSTEM = 'system';
    this.system = jsonData[SYSTEM];
    const FIELDS = 'fields';
    jsonData[FIELDS].forEach(fieldData => {
      const field = new Field(fieldData);
      this.fields.push(field);
      this.fieldMap.set(field.id, field);
      this.fieldMap.set(field.name, field);
      this.fieldOwns.push(field);
    });
    const VIEWS = 'views';
    jsonData[VIEWS].forEach(viewData => {
      const VIEW = 'view';
      const viewInfo = new ViewInfo(viewData[VIEW]);
      this.viewMap.set(viewInfo.name, viewInfo);
      this.viewOwns.push(viewInfo);
    });

    this.businessOwns = [];
    const BUSINESSES = 'businesses';
    jsonData[BUSINESSES].forEach(businessData => {
      const business = new Business(businessData, this);
      this.businessMap.set(business.name, business);
      this.businessOwns.push(business);
    });
    const ACTIONS = 'actions';
    jsonData[ACTIONS].forEach(actionData => {
      const action = new Action(actionData);
      this.actionMap.set(action.name, action);
      this.actionOwns.push(action);
    });
  }

  getView(name: string): ViewInfo {
    return this.getViewMap()[name];
  }

  getViewMap = function() {
    this.getViews();
    return this.viewMap;
  };

  getOwnViews() {
    return this.viewOwns;
  }

  getViews = function() {
    if (this.viewList != null) {
      return this.viewList;
    }

    const list = (this.viewList = []);
    const map = (this.viewMap = {});
    const names = [];
    if (this.getSuper() != null) {
      const views = this.getSuper().getViews();
      for (const view of views) {
        const o = new Object(); // o = os[i];
        for (const attr in view) {
          if (view.hasOwnProperty(attr)) {
            o[attr] = view[attr];
          }
        }
        const NAME = 'name';
        const name = view[NAME];
        const ID = 'id';
        o[ID] = this.getName() + '@' + name;
        const INHERIT = 'inherit';
        o[INHERIT] = true;
        map[name] = o;
        names.push(name);
      }
    }

    const os = this.getOwnViews();
    for (const o of os) {
      const name = o.getName();
      if (!(name in map)) {
        names.push(name);
      }
      map[name] = o;
    }

    for (const name of names) {
      list.push(map[name]);
    }
    return list;
  };

  hasParent(): boolean {
    return this.parentTypeName != null;
  }

  getParentTypeName(): string {
    return this.parentTypeName;
  }

  getParent(): Type {
    return this.parentType;
  }

  setParent(type: Type) {
    this.parentType = type;
  }

  hasSuper(): boolean {
    return this.superTypeName != null;
  }

  getSuperTypeName(): string {
    return this.superTypeName;
  }

  getSuper(): Type {
    return this.superType;
  }

  setSuper(type: Type) {
    this.superType = type;
  }

  getField(idOrName: string): Field {
    return this.getFieldMap()[idOrName];
  }

  getFieldMap = function() {
    this.getFields();
    return this.fieldMap;
  };

  getOwnFields = function() {
    return this.fieldOwns;
  };

  getFields = function() {
    if (this.fieldList != null) {
      return this.fieldList;
    }

    const list = (this.fieldList = []);
    const map = (this.fieldMap = {});

    const names = [];
    if (this.getSuper() != null) {
      const Fields = this.getSuper().getFields();
      for (const field of Fields) {
        const o = new Object();
        for (const attr in field) {
          if (field.hasOwnProperty(attr)) {
            o[attr] = field[attr];
          }
        }
        const NAME = 'name';
        const name = field[NAME];
        const ID = 'id';
        o[ID] = this.getName() + '@' + name;
        const INHERIT = 'inherit';
        o[INHERIT] = true;
        map[name] = new Field(o);
        names.push(name);
      }
    }

    const os = this.getOwnFields();
    for (const o of os) {
      const name = o.getName();
      if (!(name in map)) {
        names.push(name);
      }
      map[name] = o;
    }

    for (const name of names) {
      list.push(map[name]);
    }

    return list;
  };

  getBusinessMap(): Map<string, Business> {
    this.getBusinesses();
    return this.businessMap;
  }

  getBusiness(name: string): Business {
    return this.getBusinessMap()[name];
  }

  getOwnBusinesses() {
    return this.businessOwns;
  }

  getBusinesses = function() {
    if (this.businessList != null) {
      let array = [];
      array = this.businessList;
      return array;
    }

    const list = (this.businessList = []);
    const map = (this.businessMap = {});

    const names = [];
    let sType = null;
    sType = this.getSuper();
    if (sType != null) {
      let Businesses = [];
      Businesses = sType.getBusinesses();
      for (const business of Businesses) {
        const o = new Object(); // o = os[i];
        for (const attr in business) {
          if (business.hasOwnProperty(attr)) {
            o[attr] = business[attr];
          }
        }
        const NAME = 'name';
        const name = business[NAME];
        const ID = 'id';
        o[ID] = this.getName() + '@' + name;
        const INHERIT = 'inherit';
        o[INHERIT] = true;
        const biz = new Business(o, this);
        map[name] = biz;
        names.push(name);
      }
    }

    const os = this.getOwnBusinesses();
    for (const o of os) {
      const name = o.getName();
      if (!(name in map)) {
        names.push(name);
      }
      map[name] = o;
    }

    for (const name of names) {
      list.push(map[name]);
    }

    return list;
  };

  getAction(name: string): Action {
    return this.getActionMap()[name];
  }

  getActionMap = function() {
    this.getActions();
    return this.actionMap;
  };

  getOwnActions = function() {
    return this.actionOwns;
  };

  getActions = function() {
    if (this.actionList != null) {
      return this.actionList;
    }

    const list = (this.actionList = []);
    const map = (this.actionMap = {});

    const names = [];
    if (this.getSuper() != null) {
      const Actions = this.getSuper().getActions();
      for (const action of Actions) {
        const o = new Object(); // o = os[i];
        for (const attr in action) {
          if (action.hasOwnProperty(attr)) {
            o[attr] = action[attr];
          }
        }
        const NAME = 'name';
        const name = action[NAME];
        const ID = 'id';
        o[ID] = this.getName() + '@' + name;
        const INHERIT = 'inherit';
        o[INHERIT] = true;
        map[name] = new Action(o);
        names.push(name);
      }
    }

    const os = this.getOwnActions();
    for (const o of os) {
      const name = o.getName();
      if (!(name in map)) {
        names.push(name);
      }
      map[name] = o;
    }

    for (const name of  names) {
      list.push(map[name]);
    }

    return list;
  };

  getDisplayField(): Field {
    for (const field of this.fields) {
      if (field.isDisplay() === true) {
        return field;
      }
    }
    return null;
  }

  getSerialVersionUID(): string {
    return this.serialVersionUID;
  }

  getId = function() {
    return this.id;
  };

  getName = function() {
    return this.name;
  };

  getDescription = function() {
    return this.description || '';
  };

  getDisplayAs = function() {
    return this.displayAs;
  };

  isSystem = function() {
    return this.system;
  };

  getProperties = function() {
    return this.properties || {};
  };

  getProperty = function(propertyName) {
    const properties = this.properties || {};
    return properties[propertyName];
  };

  newFunction() {
    return this.serialVersionUID;
  }
}
