import {ApiInjector, MockApiInterface, RequestOptions} from '@yunzhi/ng-mock-api';
import {Term} from "../app/norm/entity/Term";
import {HttpParams} from "@angular/common/http";
import {generatePage} from '@yunzhi/ng-common';
import {School} from "../app/norm/entity/School";


export class CourseApi implements MockApiInterface {
    getInjectors(): ApiInjector[] {
        throw new Error('Method not implemented.');
    }
}
