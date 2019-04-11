import { Component, Input, OnInit, OnChanges } from '@angular/core';
import { FormGroup } from '@angular/forms';
import { RendererMeta } from '../../services/renderer-meta.service';
import { MetaLoader } from '../../services/meta-loader.service';
import { Mode } from '../../enums/mode';

@Component({
  selector: 'dm-operation',
  templateUrl: './operation.component.html'
})
export class OperationComponent implements OnChanges {
  @Input() page: any;
  @Input() form: FormGroup;
  operations: any = [];

  constructor(private rendererMeta: RendererMeta) { }

  ngOnChanges() {
    this.checkUpdate();
  }

  public checkUpdate() {
    const ops = this.page ? this.page.business.operations : [];
    this.operations = [];
    for (const i in ops) {
      if (ops.hasOwnProperty(i)) {
        const op = ops[i];
        const TYPENAME = 'typeName';
        const CONTENT = 'content';
        const NAME = 'name';
        const MODE = 'mode';
        const CONDITION = 'condition';
        const DISABLED = 'disabled';
        if ('Business' === op.type) { // 只处理是业务得操作按钮
          const name = this.page.business[TYPENAME] + '@' + op[CONTENT];
          const bus = MetaLoader.loadBusiness(name);
          if (bus) {
            const operation = {};
            operation[NAME] = op[NAME];
            operation[MODE] = bus.mode;
            operation[CONDITION] = op[CONDITION];
            if (Mode.Entity === bus.mode && !this.page.currentSelectedRow) {
              operation[DISABLED] = true;
            }
            this.operations.push(operation);
          }
        } else if ('Action' === op.type) {
          const name = this.page.business[TYPENAME] + '@' + op[CONTENT];
          const action = MetaLoader.loadAction(name);
          if (action) {
            const operation = {};
            operation[NAME] = op[NAME];
            operation[MODE] = action.mode;
            operation[CONDITION] = op[CONDITION];
            if (Mode.Entity === action.mode && !this.page.currentSelectedRow) {
              operation[DISABLED] = true;
            }
            this.operations.push(operation);
          }
        } else {
          const operation = {};
          operation[NAME] = op[NAME];
          operation[MODE] = op[MODE] || Mode.Collection;
          operation[CONDITION] = op[CONDITION];
          this.operations.push(operation);
        }
      }
    }
  }

  getOperations() {
    return this.operations;
  }

  onOpClick(name) {
    if (name === '删除') {
      this.page.trash();
    } else {
      this.rendererMeta.doExecuteOperation(name, null, this.page);
    }
  }
}
