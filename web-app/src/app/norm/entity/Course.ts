import {Term} from './Term';
import {User} from './User';
import { Klass } from './Klass';

export class Course {
  id: string;
  name: string;
  sory: number;
  term: Term;
  week: number[];
  day: number[];
  period: number[];
  users: User[];
  klass: Klass;

  constructor(data = {} as {
    id?: string;
    name?: string;
    term?: Term;
    sory?: number;
    week?: number[];
    day?: number[];
    period?: number[];
    users?: User[];
    klass?: Klass
  }) {
    this.id = data.id as string;
    this.name = data.name as string;
    this.sory = data.sory as number;
    this.term = data.term as Term;
    this.week = data.week as number[];
    this.day = data.day as number[];
    this.period = data.period as number[];
    this.users = data.users as User[];
    this.klass = data.klass as Klass;
  }
}
