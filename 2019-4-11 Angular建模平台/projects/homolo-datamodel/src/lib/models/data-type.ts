import { Operator } from '../enums/operator';

export class DataType {
    schema: string;
    displayAs: string;
    name: string;
    format: string;
    validator: string;
    setter: string;
    widget: {
        editor: string;
        displayer: string;
        allowBlank: boolean;
    };
    operators = new Array<Operator>();

    constructor(data: {}) {
        const NAME = 'name';
        this.name = data[NAME];
        const DISPLAYAS = 'displayAs';
        this.displayAs = data[DISPLAYAS];
        const FORMAT = 'format';
        this.format = data[FORMAT];
        const SCHEMA = 'schema';
        this.schema = data[SCHEMA];
        const VALIDATOR = 'validator';
        this.validator = data[VALIDATOR];
        const SETTER = 'setter';
        this.setter = data[SETTER];
        const OPERATORS = 'operators';
        if (data[OPERATORS] != null) {
            this.operators = new Array<Operator>();
            data[OPERATORS].forEach(o => {
                if ('Equals' === o) {
                    this.operators.push(Operator.Equals);
                } else if ('Contains' === o) {
                    this.operators.push(Operator.Contains);
                } else if ('EndsWith' === o) {
                    this.operators.push(Operator.EndsWith);
                } else if ('Ge' === o) {
                    this.operators.push(Operator.Ge);
                } else if ('Gt' === o) {
                    this.operators.push(Operator.Gt);
                } else if ('In' === o) {
                    this.operators.push(Operator.In);
                } else if ('Le' === o) {
                    this.operators.push(Operator.Le);
                } else if ('Lt' === o) {
                    this.operators.push(Operator.Lt);
                } else if ('NotEquals' === o) {
                    this.operators.push(Operator.NotEquals);
                } else if ('NotIn' === o) {
                    this.operators.push(Operator.NotIn);
                } else if ('NotNull' === o) {
                    this.operators.push(Operator.NotNull);
                } else if ('Null' === o) {
                    this.operators.push(Operator.Null);
                } else if ('StartsWith' === o) {
                    this.operators.push(Operator.StartsWith);
                }
            });
        }
        const WIDGET = 'widget';
        if (data[WIDGET] != null) {
            const ALLOWBLANK = 'allowBlank';
            const DISPLAYER = 'displayer';
            const EDITOR = 'editor';
            this.widget = {
                allowBlank: data[WIDGET][ALLOWBLANK],
                displayer: data[WIDGET][DISPLAYER],
                editor: data[WIDGET][EDITOR]
            };
        }
    }
}
