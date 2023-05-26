import { Component, OnInit, Inject } from '@angular/core';
import { Router, ActivatedRoute } from '@angular/router';
import { AuthenticationService } from '../../user/services/authentication.service';
import { RhManagementService } from '../rh-management.service';
import { ClientService } from '../client/client.service';
import { FormGroup, FormControl, Validators, FormArray, FormControlName, FormBuilder } from '@angular/forms';
import 'notyf/dist/notyf.min.css';
import { Timesheet } from '../timesheet';
import { Employee } from '../employee';
import { BusinessDay } from '../businessDay';
import * as moment from 'moment-ferie-fr';
import {MatDialog, MatDialogRef, MAT_DIALOG_DATA} from '@angular/material/dialog';
declare var require: any;
declare var $: any;
@Component({
  selector: 'app-employee-new-timesheet',
  templateUrl: './employee-new-timesheet.component.html',
  styleUrls: ['./employee-new-timesheet.component.scss']
})
export class EmployeeNewTimesheetComponent implements OnInit {
   //moment = require('moment');

  public jwtToken = null;
  private sub: any;
  //currentUser;
  currentMonthYear;
  currentMonthS;
  currentMonthN;
  currentYear;
  daysInCurrentMonth;
  weekendsInMonth;
  feriesInMonth;
  workingDays;
  timeSheetForm : FormGroup;
  public timesheetsOfThisMonth : Timesheet[];
  idEmployee: number;
  dailyTotal = [];
  isDayInf = [];
  isDaysNbrSup : boolean = false;
  public adminRole: boolean = false;
  isCurrentMonthValidatedByEmp : boolean = false;
  isCurrentMonthValidatedByAdmin : boolean = false;
  isAnyTimesheetRefused : boolean = false;
  employee;
  date = new Date();
  activity = new Map().set("production", 0)
                      .set("interne", 0)
                      .set("conge", 0)
                      .set("absence", 0);
  Notyf = require('notyf');
  notyf2 = new this.Notyf({
    delay: 4000,
    alertIcon: 'fa fa-exclamation-circle',
    confirmIcon: 'fa fa-check-circle'
  })
  
  constructor(private rhManagementService: RhManagementService, private clientService: ClientService,
    private authenticationService: AuthenticationService,
    private router: Router,public route: ActivatedRoute, private fb: FormBuilder,
    public dialog: MatDialog) { }

  ngOnInit() {
    this.loadToken();
    if (!this.jwtToken) {
      this.router.navigate([''])
    }
    this.sub = this.route.params.subscribe(params => {
      this.idEmployee = params['idEmployee'];
      this.currentMonthS = params['currentMonthS'];
      this.currentYear = params['currentYear'];
      let months = ["Janvier", "Février", "Mars", "Avril", "Mai", "Juin", "Juillet", "Aout", "Septembre", "Octobre", "Novembere", "Décembere"];
      this.currentMonthN = months.indexOf(this.currentMonthS);
      this.currentMonthYear = this.currentMonthS + ' ' + this.currentYear;

      this.rhManagementService.findEmployeeById(this.idEmployee).subscribe(
        resp => {
           this.employee = resp.body;
        }
      );
    });
      
    this.daysInCurrentMonth = Array.from({length: this.daysInMonth(this.currentMonthN, this.currentYear)}, (v, k) => k+1);
    this.getWeekendsInMonth();
    this.getFerieDaysInMonth();
    this.workingDays = this.daysInCurrentMonth.filter(e => !(this.weekendsInMonth.includes(e) || this.feriesInMonth.includes(e)));
    this.getTimesheetsOfThisMonth(this.idEmployee);
    
    this.timeSheetForm = this.fb.group({
      type : new FormControl('', Validators.required),
      designation : new FormControl('', Validators.required)
      /* bDays: this.fb.array(this.daysInCurrentMonth.map(t=> {
        if ( !this.weekendsInMonth.includes(t) ){
          this.fb.control('', [Validators.max(100), Validators.min(0)])
        }
      })) */
    });
  }

  loadToken() {
    this.jwtToken = localStorage.getItem('token');
  }

  ngOnDestroy(): void {
  this.sub.unsubscribe();
  }

  daysInMonth (month, year) {
    return new Date(year, month, 0).getDate();
  }

  getBDays(id:string) {
    let businessDays : Array<BusinessDay> = [];
    this.workingDays.forEach((i) => {
      let inputValue = $(id + i).get(0).value;
      if ( inputValue != '' && !isNaN(inputValue)) {
        businessDays.push(new BusinessDay(inputValue, i, this.currentMonthYear));
      }
    });
    return businessDays;
  }

  onSubmit(timesheet: Timesheet) {
    if (timesheet == null) {
      if (this.timeSheetForm.valid) {
        let bDays = this.getBDays('#');
        if (bDays.length > 0) {
          let newTimesheet: Timesheet = new Timesheet(
            0,
            this.timeSheetForm.controls['type'].value,
            this.timeSheetForm.controls['designation'].value,
            false,
            new Employee(this.idEmployee),
            this.currentMonthYear
          );
          newTimesheet.businessDays = bDays;
          this.rhManagementService.saveEmployeeTimeSheet(newTimesheet).subscribe(
            resp => {
              this.getTimesheetsOfThisMonth(this.idEmployee);
              this.resetForm();
              this.notyf2.confirm('Nouvelle feuille de temps ajoutée');
            }, err => {
              this.notyf2.alert('Echec de création , vous avez des champs invalides')
            }
          );
        } else {
          this.notyf2.alert('Veuillez remplir les jours travaillés');
        }
      }
    } else {
        let bDays = this.getBDays('#t' + timesheet.id);
        if (bDays.length > 0) {
          let toldbDays : Array<BusinessDay> = [];
          timesheet.businessDays.forEach(b => {
            toldbDays.push(new BusinessDay(b.hoursNumber, b.day, b.currentMonth));
          });
          if (JSON.stringify(toldbDays) != JSON.stringify(bDays)) {
            timesheet.businessDays = bDays;
            this.rhManagementService.updateTimesheet(timesheet).subscribe(
              resp => {
                this.getTimesheetsOfThisMonth(this.idEmployee);
                this.resetForm();
                this.notyf2.confirm('Feuille de temps modifiée');
              }, err => {
                this.notyf2.alert('Echec de modification , vous avez des champs invalides')
              }
            );
          } else {
            this.notyf2.alert('Aucune modification detectée..');
          }
        } else {
          this.notyf2.alert('Veuillez remplir les jours travaillés');
        }
      }
    
  }

  getWeekendsInMonth() {
    var getTot = this.daysInMonth(this.currentMonthN,this.currentYear); //Get total days in a month
    this.weekendsInMonth = new Array(); 
    for(var i=1; i<=getTot; i++){    
        var day = new Date(this.currentYear,this.currentMonthN,i)
        if( day.getDay()==0 || day.getDay()==6 ){   
          this.weekendsInMonth.push(i);
        }
    }
    return this.weekendsInMonth;
  }

  getFerieDaysInMonth() {
    var getTot = this.daysInMonth(this.currentMonthN,this.currentYear); 
    this.feriesInMonth = new Array(); 
    for(var i=1; i <= getTot; i++){    
      let day = moment(i + "-" + (parseInt(this.currentMonthN) + 1 ) + "-" + this.currentYear, "DD-MM-YYYY");
        if( day.isFerie() ){   
          this.feriesInMonth.push(i);
        }
    }
    return this.feriesInMonth;
  }

  isWeekend(day: number){
    return (this.weekendsInMonth.includes(day) ? true : false);
  }

  isFerie(day) {
     return (this.feriesInMonth.includes(day) ? true : false);
  }

  isWorking(day : number){

    return this.workingDays.includes(day);
  }
  selectAll() {
    let isChecked = $('#checkAll').get(0).checked;
    if (isChecked) {
      this.workingDays.forEach(i => {
        $('#' + i).get(0).value = '1' ;
      });
    } else {
      this.workingDays.forEach(i => {
        $('#' + i).get(0).value =  '' ;
      }); 
    }
  }

  getTimesheetsOfThisMonth(idEmployee: number) {
      this.rhManagementService.getEmployeeTimeSheets(idEmployee).subscribe(
          resp => {
              this.timesheetsOfThisMonth = resp.filter(elt => elt.currentMonthYear == this.currentMonthYear);
              this.getDailyTotal();
              if (this.timesheetsOfThisMonth.length > 0) {
                this.activityRapport(this.timesheetsOfThisMonth);
                this.isCurrentMonthValidatedByAdmin = this.timesheetsOfThisMonth[0].approvedByAdmin;
                this.isCurrentMonthValidatedByEmp = this.timesheetsOfThisMonth[0].approvedByEmp;
                this.timesheetsOfThisMonth.filter(t=>t.raisonIfRefused != null).length > 0
                ? this.isAnyTimesheetRefused = true : false;
              } 
          }
      );
  }

  deleteTimeSheet(timesheet : Timesheet) {
    if (timesheet) {
      this.rhManagementService.deleteTimeSheetById(timesheet.id).subscribe(
      res => {
          this.getTimesheetsOfThisMonth(this.idEmployee);
          this.notyf2.confirm('Feuille de temps supprimée avec succès');
      }, err => {
          this.notyf2.alert('Erreur!');
      }
      );
    }
  }
  activityRapport(timesheetsOfThisMonth) {
    this.activity.set("production", 0);
    this.activity.set("interne", 0);
    this.activity.set("absence", 0);
    this.activity.set("conge", 0);
    timesheetsOfThisMonth.forEach(t => {      
      if (t.type == 'Mission') {
        let sum = 0;
        t.businessDays.forEach(b => {
          sum = sum +  parseFloat(b.hoursNumber);
        });
        this.activity.set("production", sum);
      } else if (t.type == 'Interne') {
        let sum = 0;
        t.businessDays.forEach(b => {
          sum = sum +  parseFloat(b.hoursNumber);
        });
        this.activity.set("interne", sum);
      } else if (t.type == 'Congé') {
        let sum = 0;
        t.businessDays.forEach(b => {
          sum = sum +  parseFloat(b.hoursNumber);
        });
        this.activity.set("conge", sum);
      } else if (t.type == 'Absence') {
        let sum = 0;
        t.businessDays.forEach(b => {
          sum = sum +  parseFloat(b.hoursNumber);
        });
        this.activity.set("absence", sum);
      }
    });
  }
  validateTimesheets(validate : boolean) {
    if (this.idEmployee) {
      if (this.timesheetsOfThisMonth.filter(t=>t.raisonIfRefused != null).length == 0)  {
        this.rhManagementService.validateMonthTimeSheets(this.idEmployee, this.currentMonthYear, this.adminRole, validate).subscribe(
        res => {
          this.getTimesheetsOfThisMonth(this.idEmployee);
          this.notyf2.confirm(validate ? 'Feuille de temps validée avec succès' : 'Validation annulée!');
        }, err => {
          this.notyf2.alert(validate ? 'Erreur de validation!' : 'Erreur dans l annulation de validation!');
        });
      } else {
        this.notyf2.alert('Erreur de validation : Veuillez modifier ou supprimer les feuilles de temps refusées ..');

      }
    }
  }

  resetForm() {
    this.workingDays.forEach(i => {
      $('#' + i).get(0).value = '' ;
    });
    $('#checkAll').get(0).checked = false;
  }

  isDayWorked(t:Timesheet, i:number) {
    let value='';
    t.businessDays.forEach(b=> {
      if (b.day==i && b.hoursNumber != '0') {
        value = b.hoursNumber ;
      }
    });
    return value;
  }

  getDailyTotal() {
    this.dailyTotal = [];
    this.isDayInf = [];
    let totalWorked = 0;
    this.daysInCurrentMonth.forEach(i => {
      let sum = 0;
      this.timesheetsOfThisMonth.forEach((value) => {
        value.businessDays.forEach(b => {
          if (b.day == i){
           sum = sum + parseFloat(b.hoursNumber);
          }
        })
      });
      this.dailyTotal.push(sum);
      this.isDayInf.push(sum <= 1 ? true : false);
      totalWorked = totalWorked + sum;
    });

    this.isDaysNbrSup = totalWorked > this.workingDays.length;
  }

  onAdminRole(adminRole: boolean) {
    adminRole? this.adminRole = true: false;
  }

 openDialog(timesheet: Timesheet): void {
    const dialogRef = this.dialog.open(RefuseTimesheetDialog, {
      width: '450px',
      data: {timesheet: timesheet}
    });

    dialogRef.afterClosed().subscribe(result => {
      console.log('The dialog was closed');
    });
  }
}

@Component({
  providers : [EmployeeNewTimesheetComponent],
  selector: 'dialog-overview-example-dialog',
  template: ' <form novalidate [formGroup]="refuseForm" (ngSubmit)="onSubmit(data.timesheet)">'+ 
  '<h1 mat-dialog-title>Raison du refus :</h1>' +
  '<div mat-dialog-content>' +
    '<mat-form-field class="col-sm-12"> <textarea matInput formControlName="refuseComment"></textarea> </mat-form-field> </div>' +
  '<div mat-dialog-actions> <button mat-button (click)="onNoClick()">Annuler</button>' +
    '<button mat-raised-button cdkFocusInitial type="submit" [disabled]="!refuseForm.valid">Refuser</button>  </div></form>'
})
export class RefuseTimesheetDialog {

  refuseForm: FormGroup;
  private Notyf = require('notyf');
  private notyf2 = new this.Notyf({
    delay: 4000,
    alertIcon: 'fa fa-exclamation-circle',
    confirmIcon: 'fa fa-check-circle'
  })

  constructor(private rhManagementService: RhManagementService, private newTimeshhetComp: EmployeeNewTimesheetComponent,
     public dialogRef: MatDialogRef<RefuseTimesheetDialog>,
    @Inject(MAT_DIALOG_DATA) public data: Timesheet) {
      this.refuseForm = new FormGroup({ refuseComment: new FormControl('', Validators.required) });
    }

  onNoClick(): void {
    this.dialogRef.close();
  }

  onSubmit(timesheet : Timesheet) {
    if (this.refuseForm.valid && timesheet) {
      timesheet.raisonIfRefused = this.refuseForm.controls['refuseComment'].value;
      this.rhManagementService.refuseTimesheet(timesheet).subscribe(resp => {
        this.onNoClick();
        this.notyf2.confirm('feuille de temps refusée..');
        this.newTimeshhetComp.timesheetsOfThisMonth;
      }, err => {
        this.notyf2.alert('Erreur..');
      });
    }
  }
}
