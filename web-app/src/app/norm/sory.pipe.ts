import {Pipe, PipeTransform} from '@angular/core';

@Pipe({
  name: 'sory'
})
export class SoryPipe implements PipeTransform {

  transform(value?: number): string {
    if (value === undefined || value === null) {
      return '-';
    }

    if (value) {
      return '必修';
    } else {
      return '选修';
    }
  }
}
