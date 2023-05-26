import { Timesheet } from "./timesheet";

export class BusinessDay {

  id: number;
  hoursNumber: string;
  currentMonth: string;
  day : number;
  timesheet : Timesheet;
  
  constructor(hoursNumber: string, day : number, currentMonth: string) {
    this.hoursNumber = hoursNumber;
    this.day = day;
    this.currentMonth = currentMonth;
  }
  
}
