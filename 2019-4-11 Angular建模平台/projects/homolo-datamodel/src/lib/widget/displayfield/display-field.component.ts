import { Component, Input, OnInit, OnChanges, AfterViewInit } from '@angular/core';
import { FormGroup } from '@angular/forms';
import { Widget } from '../../models/widget';
/**
 * 通用显示组件
 */
@Component({
    selector: 'dm-displayfield',
    templateUrl: './display-field.component.html',
    styleUrls: ['../../../assets/scss/homolo-datamodel.scss']
})
export class DisplayFieldComponent implements OnInit, AfterViewInit {
    public $widget: Widget<any>;
    @Input()
    form: FormGroup;
    @Input()
    set widget(widget: Widget<any>) {
      this.$widget = widget;
    }

    displayAs: any;

    ngOnInit() {
    }
    ngAfterViewInit() {
    }
    get display(): string {
        let display = '';
        if (this.$widget.displayAs) {
            return this.$widget.displayAs;
        } else {
            display = JSON.stringify(this.$widget.value);
        }
        if (display === 'null' ||
        display === 'NaN' || display === '{}' || display === '[]' || display === '""' || display === '' || display === 'undefined') {
            return '';
        }
        return display;
    }

    get fieldSpan() {
        if (this.$widget.nzSpan === 8) {
            return 18;
        } else if (this.$widget.nzSpan === 12) {
            return 20;
        } else {
            return 22;
        }
    }
    get labelSpan() {
        if (this.$widget.nzSpan === 8) {
            return 6;
        } else if (this.$widget.nzSpan === 12) {
            return 4;
        } else {
            return 2;
        }
    }
    get isHorizontal(): boolean {
        return this.$widget.nzLayout === 'horizontal';
    }
    get isValid() {
        return this.form.controls[this.$widget.fieldName].valid;
    }
    get isDirty() {
        return this.form.controls[this.$widget.fieldName].dirty;
    }
    get isTouched() {
        return this.form.controls[this.$widget.fieldName].touched;
    }
}
