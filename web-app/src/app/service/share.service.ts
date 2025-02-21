import { Injectable } from '@angular/core';
import { User } from '../norm/entity/User';

@Injectable({
  providedIn: 'root'
})
export class ShareService {

  data: User | undefined;
  private someValue: any;
  value: any;

  getId() {
    console.log(this.value);
    return this.value;
  }

  setId(id: number) {
    console.log(id);
    this.value = id;
  }

  getSomeValue() {
    console.log(this.someValue);
    return this.someValue;
  }

  setSomeValue(value: any) {
    console.log(value);
    this.someValue = value;
  }

  getData() {
    console.log(this.data);
    return this.data;
  }

  setData(newData: User) {
    console.log(newData);
    this.data = newData;
    console.log(this.data);
  }
}
