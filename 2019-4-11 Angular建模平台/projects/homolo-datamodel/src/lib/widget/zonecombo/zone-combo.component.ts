import { Component, Input, OnInit, OnChanges, AfterViewInit, Inject } from '@angular/core';
import { FormGroup } from '@angular/forms';
import { HttpClient} from '@angular/common/http';
import { map, catchError } from 'rxjs/operators';
import { Widget, WidgetType } from '../../models/widget';
import { RestClient } from 'homolo-framework';
import { Zone } from 'homolo-framework';
/**
 * 地区选择组件
 */
@Component({
    selector: 'dm-zonecombo',
    templateUrl: './zone-combo.component.html'
})
export class ZoneComboComponent implements OnInit, AfterViewInit {
    public $widget: Widget<any>;
    @Input() form: FormGroup;
    @Input()
    set widget(widget: Widget<any>) {
        this.$widget = widget;
    }

    values = [];
    cnZone: Zone; // 中国地区数据
    constructor(private restClient: RestClient) {}

    ngOnInit() {
        this.initZone('086');
        console.log(this.$widget);
        console.log(this.form);
    }
    ngAfterViewInit() {
        if (this.form.value[this.$widget.fieldName]) {
            this.codePath(this.form.value[this.$widget.fieldName]);
        }
    }

    onSelectionChange(selectedOptions: any[]): void {
        console.log(selectedOptions);
        if (selectedOptions.length > 0) {
            this.form.value[this.$widget.fieldName] = selectedOptions[selectedOptions.length - 1].code;
        }
    }

    codePath(code) {
        this.restClient.request('tk.Zone', code, 'codePath', {}).then(result => {
            this.values = result;
        });
    }
    initZone(zoneCode: string) {
        this.restClient.request('tk.Zone', zoneCode, 'tree', {}).then(result => {
            this.cnZone = new Zone(result);
            console.log('cnZone...', this.cnZone);
          });
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
