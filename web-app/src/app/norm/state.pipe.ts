import {Pipe, PipeTransform} from '@angular/core';

@Pipe({
  name: 'state'
})
export class StatePipe implements PipeTransform {

  transform(value?: number): string {
    if (value === undefined || value === null) {
      return '-';
    }

    if (value === 1) {
      return '已启用';
    } else {
      return '已冻结';
    }
  }
}
