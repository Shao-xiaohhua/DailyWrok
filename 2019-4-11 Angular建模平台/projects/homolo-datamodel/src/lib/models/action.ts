import { Mode } from '../enums/mode';
import { Type } from './type';
import { DataService } from '../services/data.service';
import { AccessScope } from '../enums/access-scope';

export class Action {

    id: string;
    name: string;
    displayAs: string;
    override: boolean;
    description: string;
    properties: Map<string, object>;
    inherit: boolean;
    system: boolean;
    accessScope: AccessScope;
    mode: Mode;

    constructor(data: {}) {
        const ID = 'id';
        this.id = data[ID];
        const NAME = 'name';
        this.name = data[NAME];
        const DISPLAYAS = 'displayAs';
        this.displayAs = data[DISPLAYAS];
        const OVERRIDE = 'override';
        this.override = data[OVERRIDE];
        const DESCRIPTION = 'description';
        this.description = data[DESCRIPTION];
        const PROPERTIES = 'properties';
        this.properties = data[PROPERTIES];
        const INHERIT = 'inherit';
        this.inherit = data[INHERIT];
        const SYSTEM = 'system';
        this.system = data[SYSTEM];
        const MODE = 'mode';
        const m = data[MODE];
        if ('Entity' === m) {
            this.mode = Mode.Entity;
        } else if ('Collection' === m) {
            this.mode = Mode.Collection;
        }
        const ACCESSSCOPE = 'accessScope';
        const as = data[ACCESSSCOPE];
        if ('Default' === as) {
            this.accessScope = AccessScope.Default;
        } else if ('Private' === as) {
            this.accessScope = AccessScope.Private;
        } else if ('Protected' === as) {
            this.accessScope = AccessScope.Protected;
        } else if ('Public' === as) {
            this.accessScope = AccessScope.Public;
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

    getMode(): Mode {
        return this.mode;
    }

    getAccessScope(): AccessScope {
        return this.accessScope;
    }

    isInherit(): boolean {
        return this.inherit || false;
    }

    isSystem(): boolean {
        return this.system || false;
    }

    getProperties(): Map<string, object> {
        return this.properties || new Map<string, object>();
    }

    getProperty(propertyName): object {
        return this.getProperties()[propertyName];
    }
}
