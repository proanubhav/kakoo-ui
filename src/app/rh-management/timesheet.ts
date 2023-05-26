import { Employee } from "./employee";
import { BusinessDay } from "./businessDay";

export class Timesheet {

  id: number;
  type: string;
  designation: string;
  employee: Employee;
  approvedByEmp: boolean;
  approvedByAdmin: boolean;
  businessDays : Array<BusinessDay>;
  currentMonthYear: string;
  raisonIfRefused : string;
  constructor(id: number, type: string, designation: string, approved: boolean, employee: Employee, currentMonthYear: string) {
    this.id = id;
    this.type = type;
    this.designation = designation;
    this.approvedByEmp = approved;
    this.employee = employee;
    this.currentMonthYear = currentMonthYear;
  }
  
}
