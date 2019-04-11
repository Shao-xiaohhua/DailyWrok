import { Mode } from '../enums/mode';
import { Operator } from '../enums/operator';
import { Widget } from './widget';

export enum ViewMode {
  Panel,
  Window,
}

export enum LabelAlign {
  left,
  right,
  top,
}

export interface View {
  getMode(): Mode;
}

export class FieldItem {
  field: string;
  defaultValue: object;
  label: string;
  tip: string;
  editor: string;
  displayer: string;
  col: number;
  row: number;
  onChange: string;
  widget: Widget<object>;
  allowBlank = false;
  readOnly = false;

  constructor(itemData: object) {
    const FIELD = 'field';
    this.field = itemData[FIELD];
    const DEFAULTVALUE = 'defaultValue';
    this.defaultValue = itemData[DEFAULTVALUE];
    const LABEL = 'label';
    this.label = itemData[LABEL];
    const COL = 'col';
    this.col = itemData[COL];
    const ROW = 'row';
    this.row = itemData[ROW];
    const ONCHANGE = 'onChange';
    this.onChange = itemData[ONCHANGE];
    const WIDGET = 'widget';
    const widget = itemData[WIDGET];
    if (widget != null) {
      const ALLOWBLANK = 'allowBlank';
      this.allowBlank = widget[ALLOWBLANK];
      const READONLY = 'readOnly';
      this.readOnly = widget[READONLY];
      const EDITOR = 'editor';
      this.editor = widget[EDITOR];
      const DISPLAYER = 'displayer';
      this.displayer = widget[DISPLAYER];
      this.widget = widget;
    }
  }
}

export class Fieldset {
  name: string;
  layout: string;
  xtype: string;
  border: boolean;
  style: string;
  labelAlign = LabelAlign.left;
  collapsible = false;
  collapsed = false;
  readOnly = false;
  hidden = false;
  items = new Array<FieldItem>();

  constructor(data: object) {
    const NAME = 'name';
    this.name = data[NAME];
    const LAYOUT = 'layout';
    this.layout = data[LAYOUT];
    const BORDER = 'border';
    this.border = data[BORDER];
    const XTYPE = 'xtype';
    this.xtype = data[XTYPE];
    const STYLE = 'style';
    this.style = data[STYLE];
    const LABELALIGN = 'labelAlign';
    const a = data[LABELALIGN];
    if ('left' === a) {
      this.labelAlign = LabelAlign.left;
    } else if ('right' === a) {
      this.labelAlign = LabelAlign.right;
    } else if ('top' === a) {
      this.labelAlign = LabelAlign.top;
    }
    const COLLAPSIBLE = 'collapsible';
    this.collapsible = data[COLLAPSIBLE];
    const COLLAPSED = 'collapsed';
    this.collapsed = data[COLLAPSED];
    const READONLY = 'readOnly';
    this.readOnly = data[READONLY];
    const HIDDEN = 'hidden';
    this.hidden = data[HIDDEN];
    const ITEMS = 'items';
    data[ITEMS].forEach((itemData: any) => {
      this.items.push(new FieldItem(itemData));
    });
  }
}

export class DetailView implements View {
  fieldsets = new Array<Fieldset>();
  relates = new Array<string>();

  getMode() {
    return Mode.Entity;
  }

  constructor(data: object) {
    const RELATES = 'relates';
    this.relates = data[RELATES];
    const FIELDSETS = 'fieldsets';
    data[FIELDSETS].forEach(fieldsetsData => {
      this.fieldsets.push(new Fieldset(fieldsetsData));
    });
  }
}

export enum Align {
  left,
  center,
  right,
}

export class Column {
  field: string;
  header: string;
  convertor: string;
  sortable: boolean;
  width: number;
  minWidth: number;
  flex: number;
  align = Align.left;

  constructor(data: object) {
    const FIELD = 'field';
    this.field = data[FIELD];
    const HEADER = 'header';
    this.header = data[HEADER];
    const CONVERTOR = 'convertor';
    this.convertor = data[CONVERTOR];
    const SORTABLE = 'sortable';
    this.sortable = data[SORTABLE];
    const WIDTH = 'width';
    this.width = data[WIDTH];
    const MINWIDTH = 'minWidth';
    this.minWidth = data[MINWIDTH];
    const FLEX = 'flex';
    this.flex = data[FLEX];
    const ALIGN = 'align';
    const a = data[ALIGN];
    if ('left' === a) {
      this.align = Align.left;
    } else if ('right' === a) {
      this.align = Align.right;
    } else if ('center' === a) {
      this.align = Align.center;
    }
  }
}

export class Condition {
  field: string;
  label: string;
  defaultOperator: Operator;
  input: string;
  config: string;
  defaultValue: string;
  constructor(data: {}) {
    const FIELD = 'field';
    this.field = data[FIELD];
    const LABEL = 'label';
    this.label = data[LABEL];
    const INPUT = 'input';
    this.input = data[INPUT];
    const CONFIG = 'config';
    this.config = data[CONFIG];
    const DEFAULTVALUE = 'defaultValue';
    this.defaultValue = data[DEFAULTVALUE];
    const DEFAULTOP = 'defaultOp';
    const o = data[DEFAULTOP];
    if ('Equals' === o) {
      this.defaultOperator = Operator.Equals;
    } else if ('Contains' === o) {
      this.defaultOperator = Operator.Contains;
    } else if ('EndsWith' === o) {
      this.defaultOperator = Operator.EndsWith;
    } else if ('Ge' === o) {
      this.defaultOperator = Operator.Ge;
    } else if ('Gt' === o) {
      this.defaultOperator = Operator.Gt;
    } else if ('In' === o) {
      this.defaultOperator = Operator.In;
    } else if ('Le' === o) {
      this.defaultOperator = Operator.Le;
    } else if ('Lt' === o) {
      this.defaultOperator = Operator.Lt;
    } else if ('NotEquals' === o) {
      this.defaultOperator = Operator.NotEquals;
    } else if ('NotIn' === o) {
      this.defaultOperator = Operator.NotIn;
    } else if ('NotNull' === o) {
      this.defaultOperator = Operator.NotNull;
    } else if ('Null' === o) {
      this.defaultOperator = Operator.Null;
    } else if ('StartsWith' === o) {
      this.defaultOperator = Operator.StartsWith;
    }
  }
}

export class SearchView implements View {
  pageSize: number;
  columns = new Array<Column>();
  conditions = new Array<Condition>();
  sortField: string;
  sortAsc = true;
  multiCheck = false;
  supportOperator: boolean;
  supportFilter: boolean;
  businessColumnVisible: boolean;

  getMode() {
    return Mode.Collection;
  }

  constructor(data: object) {
    const PAGESIZE = 'pageSize';
    this.pageSize = data[PAGESIZE] || 10;
    const SUPPORTFILTER = 'supportFilter';
    this.supportFilter = data[SUPPORTFILTER];
    const SUPPORTOPERATOR = 'supportOperator';
    this.supportOperator = data[SUPPORTOPERATOR];
    const BUSINESSCOLUMNVISIBLE = 'businessColumnVisible';
    this.businessColumnVisible = data[BUSINESSCOLUMNVISIBLE];
    const MULTICHECK = 'multiCheck';
    this.multiCheck = data[MULTICHECK];
    const COLUMNS = 'columns';
    data[COLUMNS].forEach((columnData: any) => {
      this.columns.push(new Column(columnData));
    });
    const CONDITIONS = 'conditions';
    if (data[CONDITIONS] != null) {
      data[CONDITIONS].forEach((conditionData: any) => {
        this.conditions.push(new Condition(conditionData));
      });
    }
    const SORT = 'sort';
    const sort = data[SORT];
    if (sort != null) {
      const FIELD = 'field';
      this.sortField = sort[FIELD];
      const ASC = 'asc';
      this.sortAsc = sort[ASC];
    }
  }
}

export class ListView implements View {
  pageSize: number;
  sortField: string;
  sortAsc = false;
  columns = new Array<Column>();
  businessColumnVisible = false;
  multiCheck = false;
  getMode() {
    return Mode.Collection;
  }

  constructor(data: object) {
    const PAGESIZE = 'pageSize';
    this.pageSize = data[PAGESIZE] || 20;
    const BUSINESSCOLUMNVISIBLE = 'businessColumnVisible';
    this.businessColumnVisible = data[BUSINESSCOLUMNVISIBLE];
    const MULTICHECK = 'multiCheck';
    this.multiCheck = data[MULTICHECK];
    const COLUMNS = 'columns';
    data[COLUMNS].forEach((columnData: any) => {
      this.columns.push(new Column(columnData));
    });
    const SORT = 'sort';
    const sort = data[SORT];
    if (sort != null) {
      const FIELD = 'field';
      this.sortField = sort[FIELD];
      const ASC = 'asc';
      this.sortAsc = sort[ASC];
    }
  }
}

export class ViewInfo {
  id: string;
  name: string;
  description: string;
  displayAs: string;
  mode: ViewMode;
  closable: boolean;
  refreshable: boolean;
  width: number;
  height: number;
  toolbarVisible: boolean;
  definition: View;
  properties: Map<string, object>;
  system: boolean;
  inherit: boolean;

  constructor(data: object) {
    const ID = 'id';
    this.id = data[ID];
    const NAME = 'name';
    this.name = data[NAME];
    const DESCRIPTION = 'description';
    this.description = data[DESCRIPTION];
    const DISPLAYAS = 'displayAs';
    this.displayAs = data[DISPLAYAS];
    const MODE = 'mode';
    const m = data[MODE];
    if ('Panel' === m) {
      this.mode = ViewMode.Panel;
    } else if ('Window' === m) {
      this.mode = ViewMode.Window;
    }
    const CLOSABLE = 'closable';
    this.closable = data[CLOSABLE];
    const REFRESHABLE = 'refreshable';
    this.refreshable = data[REFRESHABLE];
    const WIDTH = 'width';
    this.width = data[WIDTH];
    const HEIGHT = 'height';
    this.height = data[HEIGHT];
    const TOOLBARVISIBLE = 'toolbarVisible';
    this.toolbarVisible = data[TOOLBARVISIBLE];
    const PROPERTIES = 'properties';
    this.properties = data[PROPERTIES];
    const DEFINITION = 'definition';
    const definitionData = data[DEFINITION];
    const SYSTEM = 'system';
    this.system = data[SYSTEM];
    const INHERIT = 'inherit';
    this.inherit = data[INHERIT];
    const JAVACLASS = 'javaClass';
    if (
      'com.homolo.datamodel.view.DetailView' === definitionData[JAVACLASS]
    ) {
      this.definition = new DetailView(definitionData);
    } else if (
      'com.homolo.datamodel.view.SearchView' === definitionData[JAVACLASS]
    ) {
      this.definition = new SearchView(definitionData);
    } else if (
      'com.homolo.datamodel.view.ListView' === definitionData[JAVACLASS]
    ) {
      this.definition = new ListView(definitionData);
    }
  }

  getId(): string {
    return this.id;
  }

  getTypeName(): string {
    return this.id.split('@')[0];
  }

  getName(): string {
    return this.name;
  }

  getDisplayAs(): string {
    return this.displayAs;
  }

  getDefinition(): View {
    return this.definition;
  }

  getProperties(): Map<string, object> {
    return this.properties || new Map<string, object>();
  }

  getProperty(propertyName): object {
    return this.getProperties()[propertyName];
  }

  isInherit(): boolean {
    return this.inherit || false;
  }

  isSystem(): boolean {
    return this.system || false;
  }

  isClosable(): boolean {
    return this.closable || false;
  }

  isRefreshable(): boolean {
    return this.refreshable || false;
  }
}
