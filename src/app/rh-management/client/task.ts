import {ContactClient} from "./contact-client";
import {Employee} from "../employee";
import { Client } from "./client";

export class Task {

  id: number;
  name: string;
  startDate: string;
  duration: string;
  currency: string;
  cjm: number;
  client: Client;
  employee: Employee;
  isImmediate : boolean;
  description : string;
  preavis : string;
  selected : boolean;

  constructor(id: number, name: string, startDate: string, duration: string, currency: string, cjm: number, client: Client,
              employee: Employee, isImmediate : boolean, description : string, preavis : string) {
    this.id = id;
    this.name = name;
    this.startDate = startDate;
    this.duration = duration;
    this.currency = currency;
    this.cjm = cjm;
    this.client = client;
    this.employee = employee;
    this.isImmediate = isImmediate;
    this.description = description;
    this.preavis = preavis;
  }
}
