import { Type } from './type';
import { Mode } from '../enums/mode';

export enum AccessScope {
  Default,
  Public,
  Private,
  Protected,
}

export enum RendererType {
  List,
  Search,
  View,
  Detail,
}

export class Business {
  id: string;
  name: string;
  view: string;
  typeName: string;
  renderer: string;
  rendererType: RendererType;
  displayAs: string;
  accessScope: AccessScope;
  executor: string;
  initParams: string;
  title: string;
  condition: string;
  content: string;
  system: boolean;
  inherit: boolean;
  portal: boolean;
  override: boolean;
  mode: Mode;
  disabled: boolean;
  initAction: string;
  operations: Array<Operation>;
  links: Array<string>;
  properties: Map<string, object>;
  type: Type;
  constructor(data: {}, type: Type) {
    const ID = 'id';
    this.id = data[ID];
    const NAME = 'name';
    this.name = data[NAME];
    const VIEW = 'view';
    this.view = data[VIEW];
    const TYPENAME = 'typeName';
    this.typeName = data[TYPENAME];
    const DISPLAYAS = 'displayAs';
    this.displayAs = data[DISPLAYAS];
    const EXECUTOR  = 'executor';
    this.executor = data[EXECUTOR];
    const INITPARAMS = 'initParams';
    this.initParams = data[INITPARAMS];
    const TITLE = 'title';
    this.title = data[TITLE];
    const CONDITION = 'condition';
    this.condition = data[CONDITION];
    const CONTENT = 'content';
    this.content = data[CONTENT];
    const SYSTEM = 'system';
    this.system = data[SYSTEM];
    const INHERIT = 'inherit';
    this.inherit = data[INHERIT];
    const PORTAL = 'portal';
    this.portal = data[PORTAL];
    const OVERRIDE = 'override';
    this.override = data[OVERRIDE];
    const DISABLED = 'disabled';
    this.disabled = data[DISABLED];
    const INITACTION = 'initAction';
    this.initAction = data[INITACTION];
    const LINKS = 'links';
    this.links = data[LINKS] || new Array<string>();
    const OPERATIONS = 'operations';
    this.operations = data[OPERATIONS] || new Array<Operation>();
    const PROPERTIES = 'properties';
    this.properties = data[PROPERTIES] || new Map<string, object>();
    this.type = type;
    const ACCESSSCOPE = 'accessScope';
    const as = data[ACCESSSCOPE];
    if ('Default' === as) {
      this.accessScope = AccessScope.Default;
    } else if ('Public' === as) {
      this.accessScope = AccessScope.Public;
    } else if ('Private' === as) {
      this.accessScope = AccessScope.Private;
    } else if ('Protected' === as) {
      this.accessScope = AccessScope.Protected;
    }
    const MODE = 'mode';
    const m = data[MODE];
    if ('Entity' === m) {
      this.mode = Mode.Entity;
    } else if ('Collection' === m) {
      this.mode = Mode.Collection;
    }
    const RENDERER = 'renderer';
    const renderer = data[RENDERER];
    this.renderer = renderer;
    if (renderer) {
      if (renderer.indexOf('View') > -1) {
        this.rendererType = RendererType.View;
      } else if (renderer.indexOf('Detail') > -1) {
        this.rendererType = RendererType.Detail;
      } else if (renderer.indexOf('List') > -1) {
        this.rendererType = RendererType.List;
      } else if (renderer.indexOf('Search') > -1) {
        this.rendererType = RendererType.Search;
      }
    }
  }

  getType(): Type {
    return this.type;
  }

  getId(): string {
    return this.id;
  }

  getName(): string {
    return this.name;
  }

  getDisplayAs(): string {
    return this.displayAs;
  }

  getExecutor(): string {
    return this.executor;
  }

  getRenderer(): string {
    return this.renderer;
  }

  getTypeName(): string {
    return this.id.split('@')[0];
  }

  getView(): string {
    return this.view;
  }

  isOverride(): boolean {
    return this.override;
  }

  isSystem(): boolean {
    return this.system;
  }

  getOperations(): Array<Operation> {
    return this.operations;
  }

  getInitAction(): string {
    return this.initAction;
  }

  getInitParams(): string {
    return this.initParams;
  }

  getContent(): string {
    return this.content;
  }

  getCondition(): string {
    return this.condition;
  }

  getAccessScope(): AccessScope {
    return this.accessScope;
  }

  getTitle(): string {
    return this.title;
  }

  isPortal(): boolean {
    return this.portal;
  }

  getMode(): Mode {
    return this.mode;
  }

  getLinks(): Array<string> {
    return this.links;
  }

  isInherit(): boolean {
    return this.inherit || false;
  }

  getProperties(): Map<string, object> {
    return this.properties;
  }

  getProperty(propertyName): object {
    return this.getProperties()[propertyName];
  }
}

export enum OperationType {
  /**  yewo. */
  Business,
  /**  dongzuo. */
  Action,
  /**  jiaoben. */
  Script,
}

export enum OperationCallback {
  Nothing,
  Close,
  Back,
  Refresh,
  Script,
}

export enum OperationParameter {
  None,
  PageData,
  Custom,
}

export class Operation {
  name: string;
  title: string;
  type: OperationType;
  content: string;
  condition: string;
  validator: string;
  parameter: OperationParameter;
  params: string;
  callback: OperationCallback;
  onSuccess: string;
  onFailure: string;
  defaultOp: boolean;
  group: string;
  icon: string;
  access: string;
  constructor(data: {}) {
    const NAME = 'name';
    this.name = data[NAME];
    const TITLE = 'title';
    this.title = data[TITLE];
    const CONTENT = 'content';
    this.content = data[CONTENT];
    const CONDITION = 'condition';
    this.condition = data[CONDITION];
    const VALIDATOR = 'validator';
    this.validator = data[VALIDATOR];
    const PARAMS = 'params';
    this.params = data[PARAMS];
    const ONSUCCESS = 'onSuccess';
    this.onSuccess = data[ONSUCCESS];
    const ONFAILURE = 'onFailure';
    this.onFailure = data[ONFAILURE];
    const DEFAULTOP = 'defaultOp';
    this.defaultOp = data[DEFAULTOP] || false;
    const GROUP = 'group';
    this.group = data[GROUP];
    const ICON = 'icon';
    this.icon = data[ICON];
    const ACCESS = 'access';
    this.access = data[ACCESS];
    const TYPE = 'type';
    const type = data[TYPE] || OperationType.Business;
    if ('Business' === type) {
      this.type = OperationType.Business;
    } else if ('Action' === type) {
      this.type = OperationType.Action;
    } else if ('Script' === type) {
      this.type = OperationType.Script;
    }
    const PARAMETER = 'parameter';
    const parameter = data[PARAMETER] || OperationParameter.PageData;
    if ('None' === parameter) {
      this.parameter = OperationParameter.None;
    } else if ('PageData' === parameter) {
      this.parameter = OperationParameter.PageData;
    } else if ('Custom' === parameter) {
      this.parameter = OperationParameter.Custom;
    }
    const CALLBACK = 'callback';
    const callback = data[CALLBACK] || OperationCallback.Nothing;
    if ('Nothing' === callback) {
      this.callback = OperationCallback.Nothing;
    } else if ('Close' === callback) {
      this.callback = OperationCallback.Close;
    } else if ('Back' === callback) {
      this.callback = OperationCallback.Back;
    } else if ('Refresh' === callback) {
      this.callback = OperationCallback.Refresh;
    } else if ('Script' === callback) {
      this.callback = OperationCallback.Script;
    }
  }
}
