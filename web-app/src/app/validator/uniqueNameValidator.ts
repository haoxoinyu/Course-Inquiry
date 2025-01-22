import { AbstractControl, AsyncValidatorFn, ValidationErrors } from '@angular/forms';
import { Observable, of } from 'rxjs';
import { debounceTime, map, catchError, switchMap } from 'rxjs/operators';
import {TermService} from "../service/term.service";

export function uniqueNameValidator(termService: TermService): AsyncValidatorFn {
  return (control: AbstractControl): Observable<ValidationErrors | null> => {
    const termName = control.value;

    // 如果字段为空，则不进行验证
    if (!termName) {
      return of(null);
    }

    // 使用 debounceTime 来优化请求频率
    return termService.checkIfNameExists(termName).pipe(
      debounceTime(300),  // 延迟300ms后开始请求
      map((exists: boolean) => {
        return exists ? { nameExists: true } : null;  // 如果学期名称存在，返回错误对象
      }),
      catchError(() => of(null))  // 错误处理，如果请求失败，返回 null
    );
  };
}
