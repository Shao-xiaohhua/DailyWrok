import { Type } from './type';
import { Widget } from './widget';

export class Field {
    id: string;
    name: string;
    displayAs: string;
    description: string;
    dataType: string;
    display: boolean;
    supportFilter: boolean;
    array: boolean;
    inherit: boolean;
    schema: object;
    format: string;
    validator: string;
    accessScope: string;
    editor: string;
    displayer: string;
    wrapper: string;
    defaultValue: object;
    override: boolean;
    declared: boolean;
    unique: boolean;
    widget: Widget<object>;
    properties: Map<string, object>;

    allowBlank = false;
    readOnly = false;

    config: object;

    constructor(data: object) {
        const ID = 'id';
        this.id = data[ID];
        const NAME = 'name';
        this.name = data[NAME];
        const DISPLAYAS = 'displayAs';
        this.displayAs = data[DISPLAYAS];
        const ARRAY = 'array';
        this.array = data[ARRAY];
        const SCHEMA = 'schema';
        this.schema = data[SCHEMA];
        const FORMAT = 'format';
        this.format = data[FORMAT];
        const DATATYPE = 'dataType';
        this.dataType = data[DATATYPE];
        const VALIDATOR = 'validator';
        this.validator = data[VALIDATOR];
        const DISPLAY = 'display';
        this.display = data[DISPLAY];
        const SUPPORTFILTER = 'supportFilter';
        this.supportFilter = data[SUPPORTFILTER];
        const ACCESSSCOPE = 'accessScope';
        this.accessScope = data[ACCESSSCOPE];
        const INHERIT = 'inherit';
        this.inherit = data[INHERIT];
        const WRAPPER = 'wrapper';
        this.wrapper = data[WRAPPER];
        const DEFAULTVALUE = 'defaultValue';
        this.defaultValue = data[DEFAULTVALUE];
        const OVERRIDE = 'override';
        this.override = data[OVERRIDE];
        const DECLARED = 'declared';
        this.declared = data[DECLARED];
        const UNIQUE = 'unique';
        this.unique = data[UNIQUE];
        const PROPERTIES = 'properties';
        this.properties = data[PROPERTIES];
        const WIDGET = 'widget';
        const widget = data[WIDGET];
        if (widget != null) {
            const ALLOWBLANK = 'allowBlank';
            this.allowBlank = widget[ALLOWBLANK];
            const READONLY = 'readonly';
            this.readOnly = widget[READONLY];
            const EDITOR = 'editor';
            this.editor = widget[EDITOR];
            const DISPLAYER = 'displayer';
            this.displayer = widget[DISPLAYER];
            const CONFIG = 'config';
            this.config = widget[CONFIG];
        }
    }

    getId(): string {
        return this.id;
    }

    getName(): string {
        return this.name;
    }

    getTypeName(): string {
        return this.id.split('@')[0];
    }

    getDisplayAs(): string {
        return this.displayAs;
    }

    getDescription(): string {
        return this.description;
    }

    isArray(): boolean {
        return this.array;
    }

    getDataType(): string {
        return this.dataType;
    }

    getWrapper(): string {
        return this.wrapper;
    }

    getSchema(): object {
        return this.schema;
    }

    getAccessScope(): string {
        return this.accessScope;
    }

    getOwnWidget(): Widget<object> {
        return this.widget;
    }

    getWidget(): Widget<object> {
        // return this.widget || this.getDataType().getWidget();
        return this.widget;
    }

    getFormat(): string {
        return this.format;
    }

    getValidator(): string {
        return this.validator;
    }

    getDefaultValue(): object {
        return this.defaultValue;
    }

    isDisplay(): boolean {
        return this.display;
    }

    isUnique(): boolean {
        return this.unique;
    }

    isSupportFilter(): boolean {
        return this.supportFilter;
    }

    isOverride(): boolean {
        return this.override;
    }

    isDeclared(): boolean {
        return this.declared;
    }

    isInherit(): boolean {
        return this.inherit || false;
    }

    getProperties(): Map<string, object> {
        return this.properties || new Map<string, object>();
    }

    getProperty(propertyName): object {
        return this.getProperties()[propertyName];
    }

}
