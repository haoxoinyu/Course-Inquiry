import {Term} from './Term';
import {User} from './User';

export class Course {
  id: number;
  name: string;
  sory: number;
  term: Term;
  week: number[];
  day: number[];
  period: number[];
  users: User[];

  constructor(data = {} as {
    id?: number;
    name?: string;
    term?: Term;
    sory?: number;
    week?: number[];
    day?: number[];
    period?: number[];
    users?: User[];
  }) {
    this.id = data.id as number;
    this.name = data.name as string;
    this.sory = data.sory as number;
    this.term = data.term as Term;
    this.week = data.week as number[];
    this.day = data.day as number[];
    this.period = data.period as number[];
    this.users = data.users as User[];
  }
}
