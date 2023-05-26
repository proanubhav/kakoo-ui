import { Component, OnInit } from '@angular/core';
import { Employee } from '../employee';
import { Router, ActivatedRoute } from '@angular/router';
import { RhManagementService } from '../rh-management.service';
import { Task } from '../client/task';
import { ClientService } from '../client/client.service';
import { Observable } from 'rxjs';
declare var require: any;

@Component({
    selector: 'app-employee-tasks-management',
    templateUrl: './employee-tasks-management.component.html',
    styleUrls: ['./employee-tasks-management.component.scss']
})
export class EmployeeTasksManagementComponent implements OnInit {

    private jwtToken = null;
    private sub: any;
    private idEmployee: number;
    private tasks : Observable<Task[]>;
    private timeSheets;
    private employee;
    private adminRole: boolean = false;
    private currentMonthYear : string;
    isCurrentMonthCreated : boolean = false;

    private Notyf = require('notyf');
    private notyf2 = new this.Notyf({
        delay: 4000,
        alertIcon: 'fa fa-exclamation-circle',
        confirmIcon: 'fa fa-check-circle'
    });
    

    constructor(private rhManagementService: RhManagementService, private clientService: ClientService,
        public route: ActivatedRoute, private router: Router) { }

    ngOnInit() {

        this.loadToken();
        if (!this.jwtToken) {
            this.router.navigate([''])
        }
        this.sub = this.route.params.subscribe(params => {
            this.idEmployee = params['id'];
            if (this.idEmployee) {
                let date = new Date();
                let months = ["Janvier", "Février", "Mars", "Avril", "Mai", "Juin", "Juillet", "Aout", "Septembre", "Octobre", "Novembere", "Décembere"]; 
                this.currentMonthYear = months[date.getMonth()] + ' ' + date.getFullYear();
                this.getEmployeeById(this.idEmployee);
                this.getEmployeeTasks(this.idEmployee);
                this.getTimeSheets(this.idEmployee);
            }
        });
        
    }

    getEmployeeTasks(idEmployee: number) {
        this.rhManagementService.getEmployeeTasks(idEmployee).subscribe(
            resp => {
                this.tasks = resp;
            }
        );
    }

    getEmployeeById(idEmployee: number) {
        this.rhManagementService.findEmployeeById(idEmployee).subscribe(
            resp => {
                this.employee = resp.body;
            }
        );
    }

    loadToken() {
        this.jwtToken = localStorage.getItem('token');
    }

    ngOnDestroy(): void {
        this.sub.unsubscribe();
    }

    goRH() {
        this.router.navigate(['rh/list']);
    }

    addMission(employee: Employee) {
        if (employee) {
            this.router.navigate(['employee/' + employee.id  + '/add-task' ]);
        }
    }

    deleteTask(task: Task) {
        if (task) {
            this.clientService.deleteTaskById(task.id).subscribe(
            res => {
                this.getEmployeeTasks(this.idEmployee);
                this.notyf2.confirm('Misson supprimée avec succès');
            }, err => {
                //console.log(err);
                this.notyf2.alert('Error');
            }
            );
        }
    }

    editTask(task: Task) {
        if (task) {
            this.router.navigate(['employee/' + this.idEmployee  + '/edit-task/' + task.id]);
        }
    }
    getTimeSheets(idEmployee: number){
        this.timeSheets = [];
        this.rhManagementService.getEmployeeTimeSheets(idEmployee).subscribe(
            resp => {
                if (resp && resp.length > 0) {
                    resp.forEach(t => {
                        if (this.timeSheets.length == 0) {
                            this.timeSheets.push(t);
                        } else {                            
                            if (!this.isListContains(t)) {
                                this.timeSheets.push(t);
                            }
                        }
                    });
                    this.isCurrentMonthCreated = this.currentMonthCreatedIn(this.timeSheets);
                    console.log("this.isCurrentMonthCreated : " + this.isCurrentMonthCreated); 
                }
            }
        );
    }

    isListContains(timesheet) {
        let exist = false ;
        this.timeSheets.forEach(e => {
            if ((e.currentMonthYear == timesheet.currentMonthYear)) {
               exist = true;
               return;
            } 
        });
        return exist;
    }
    currentMonthCreatedIn(timeSheets) {
        let exist = false ;
        timeSheets.forEach(e => {
            if ((e.currentMonthYear == this.currentMonthYear)) {
                exist = true;
                return;
            } 
        });
        return exist;
    }
    goToTimeSheetOf(monthYear : string){
        let monthYearArray = monthYear.split(" ", 2);
        this.router.navigate(['employee/' + this.idEmployee  + '/timesheet/' + monthYearArray[0]  + '/' + monthYearArray[1] ]);
     }

    onAdminRole(adminRole: boolean) {
       adminRole? this.adminRole = true: false;
    }
}
