import { Pipe, PipeTransform } from '@angular/core';

  // 处理大整数的显示问题

@Pipe({name: 'bigInt'})
export class BigIntPipe implements PipeTransform {
  transform(value: any): string {
    const regPos = / ^\d+$/; // 非负整数
    const regNeg = /^\-[1-9][0-9]*$/; // 负整数
    if (regPos.test(value) || regNeg.test(value)) {
        return value.toLocaleString();
    } else {
      return value;
    }
  }

}
