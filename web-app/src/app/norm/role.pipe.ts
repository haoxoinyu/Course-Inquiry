import {Pipe, PipeTransform} from '@angular/core';

@Pipe({
  name: 'role'
})
export class RolePipe implements PipeTransform {

  transform(value?: number): string | null {
    if (value === undefined || value === null) {
      return '-';
    }

    if (value === 1) {
      return '超级管理员';
    }
    if (value === 2) {
      return '管理员';
    }
    if (value === 3) {
      return '普通用户';
    }

    return null;
  }
}
