import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { AuthenticationService } from '../../user/services/authentication.service';
//
import 'rxjs/add/operator/map'
import { environment } from '../../../assets/environments/environment';
//
import { Employee } from "../employee";
import { RhManagementService } from '../rh-management.service';
import { PagerService } from '../services/pager.service';
import { Sort } from '@angular/material';
import { FormControl, FormGroup, Validators, ReactiveFormsModule } from "@angular/forms";
import { Title } from "@angular/platform-browser";
//
import 'notyf/dist/notyf.min.css';
import { ILoader, SharedService } from "../services/shared.service";

declare var $: any;
declare var require: any;

@Component({
    selector: 'app-rh-list',
    templateUrl: './rh-list.component.html',
    styleUrls: ['./rh-list.component.scss'],
    providers: [RhManagementService, PagerService, SharedService]
})
export class RhListComponent implements OnInit  {
    public advanced: boolean = false;
    public apiUrl = environment.apiUrl;
    public jwtToken = null;
    public employee: Employee;
    public employees: Employee[];
    allEmployees;
    public noEmployees: boolean = false;
    public allItems: Employee[];
    public found: boolean = true;
    pagedItems: Employee[];
    pager: any = {};
    timesheetsValidation = new Map();
    private Notyf = require('notyf');
    private notyf2 = new this.Notyf({
        delay: 4000,
        alertIcon: 'fa fa-exclamation-circle',
        confirmIcon: 'fa fa-check-circle'
    });

    searchForm: FormGroup;
    advancedForm: FormGroup;
    name;
    matricule;
    service;
    experienceNbr;
    profile;
    recrutDate;
    salaryMin;
    salaryMax;
    search: string;
    loader: ILoader;

    constructor(private rhService: RhManagementService,
        private authenticationService: AuthenticationService,
        private pagerService: PagerService,
        private router: Router,
        private titleService: Title,
        private sharedService: SharedService) {
        this.loader = this.sharedService.loader;
    }

    public setTitle(newTitle: string) {
        this.titleService.setTitle(newTitle);
    }

    ngOnInit() {
        this.setTitle('Kakoo Software - Liste des employés');

        this.loadToken();
        if (!this.jwtToken) {
            this.router.navigate([''])
        }
        // console.log(this.jwtToken);

        this.sharedService.showLoader();

        this.getConnectedUser();
        // this.getEmployees();
        this.searchForm = new FormGroup({
            searchItem: new FormControl(),
            searchCriterion: new FormControl('', Validators.required)
        });
        this.advancedForm = new FormGroup({
            name: new FormControl(),
            matricule: new FormControl(),
            service: new FormControl(),
            yearsOfExperience: new FormControl(),
            job: new FormControl(),
            recruitmentDate: new FormControl(),
            salaryMin: new FormControl(),
            salaryMax: new FormControl()
        });
    }

    getEmployees() {
        this.rhService.getAllEmployees()
            .subscribe(employees => {
                this.allEmployees = employees;
                
                this.allEmployees.forEach(element => {
                    this.isValidatedByEmp(element.id);
                });
                this.allItems = [];
                if (this.allEmployees) {
                    this.allEmployees.reverse();
                    for (let employee of this.allEmployees) {
                        this.getEmployeePic(employee);
                        this.allItems.push(employee);
                    }
                }
                this.setPage(1);

            } , err => {
            },() => {
                this.sharedService.hideLoader();
            })

    }
    getEmployeePic(employee: Employee) {

        if (employee.photo) {
            employee.photoUrl = this.apiUrl + 'employees/' + employee.id + "/downloadPhoto";
            //console.log(employee.email)
            //console.log(employee.photo)
        }
        else {
            if (employee.gender == 'Homme') {
                employee.photoUrl = "./assets/home/images/male-candidate.png"
            }
            if (employee.gender == 'Femme') {
                employee.photoUrl = "./assets/home/images/female-candidate.png"
            }
        }
    }
    loadToken() {
        this.jwtToken = localStorage.getItem('token');
    }
    getConnectedUser() {
        this.authenticationService.getConnectedUser().subscribe(
            resp => {
                //
                if (resp) {
                    this.getEmployees();
                }
                else {
                    //console.log('non resp')
                    // console.log(resp)
                }
            }
        )
    }

    sendSearch() {
        this.search = $("#searchItem").val();
        if (this.search == "" || this.search == undefined) {
            this.getEmployees();
        } else {
            this.getFilteredEmployees(this.search.trim());
        }
    }

    getFilteredEmployees(filtered: string) {
        this.rhService.findByName(filtered).subscribe(
            employees => {
                //console.log(employees);
                if (employees && employees['length'] != 0) {
                    this.found = true;
                    this.allEmployees = employees;
                    this.allItems = [];
                    if (this.allEmployees) {
                        this.allEmployees.reverse();
                        for (let employee of this.allEmployees) {
                            this.getEmployeePic(employee);
                            this.allItems.push(employee);
                        }
                    }
                    this.setPage(1);
                } else {
                    this.found = false;
                }
            }, err => {
                console.log(err);
            }
        );
    }

    advancedSearch() {
        this.employees = [];

        if (!this.advancedForm.controls['name'].value || this.advancedForm.controls['name'].value.trim() == '')
            this.name = null;
        else
            this.name = this.advancedForm.controls['name'].value;

        if (!this.advancedForm.controls['matricule'].value || this.advancedForm.controls['matricule'].value.trim() == '')
            this.matricule = null;
        else
            this.matricule = this.advancedForm.controls['matricule'].value;

        if (!this.advancedForm.controls['service'].value || this.advancedForm.controls['service'].value.trim() == '')
            this.service = null;
        else
            this.service = this.advancedForm.controls['service'].value;

        if (!this.advancedForm.controls['yearsOfExperience'].value || this.advancedForm.controls['yearsOfExperience'].value.trim() == '')
            this.experienceNbr = -1;
        else
            this.experienceNbr = this.advancedForm.controls['yearsOfExperience'].value;

        if (!this.advancedForm.controls['job'].value || this.advancedForm.controls['job'].value.trim() == '')
            this.profile = null;
        else
            this.profile = this.advancedForm.controls['job'].value;

        if (!this.advancedForm.controls['recruitmentDate'].value || this.advancedForm.controls['recruitmentDate'].value.trim() == '')
            this.recrutDate = null;
        else
            this.recrutDate = this.advancedForm.controls['recruitmentDate'].value;

        if (!this.advancedForm.controls['salaryMin'].value || this.advancedForm.controls['salaryMin'].value.trim() == '')
            this.salaryMin = 0;
        else
            this.salaryMin = this.advancedForm.controls['salaryMin'].value;

        if (!this.advancedForm.controls['salaryMax'].value || this.advancedForm.controls['salaryMax'].value.trim() == '')
            this.salaryMax = 0;
        else
            this.salaryMax = this.advancedForm.controls['salaryMax'].value;

        if (this.name == null && this.matricule == null && this.service == null && this.experienceNbr == -1 && this.profile == null &&
            this.recrutDate == null && this.salaryMax == 0 && this.salaryMin == 0)
            this.getEmployees();
        else {
            this.rhService.advancedSearching(
                this.name,
                this.matricule,
                this.service,
                this.experienceNbr,
                this.profile,
                this.recrutDate,
                this.salaryMin,
                this.salaryMax).subscribe(
                    employees => {
                        //console.log(employees);
                        this.allEmployees = employees;
                        this.allItems = [];
                        if (this.allEmployees && this.allEmployees['length'] != 0) {
                            this.found = true;
                            this.allEmployees.reverse();
                            for (let employee of this.allEmployees) {
                                this.getEmployeePic(employee);
                                this.allItems.push(employee);
                            }
                            this.setPage(1);
                        } else {
                            this.found = false;
                            this.allEmployees = [];
                            this.allItems = [];
                            this.employees = [];
                            this.pagedItems = [];
                        }
                    }, error1 => {
                        //console.log(error1);
                    }
                );
        }
    }

    setPage(page: number) {
        if (page < 1 || page > this.pager.totalPages) {
            return;
        }

        // get pager object from service
        if (this.allItems && this.allItems.length != 0) {
            this.pager = this.pagerService.getPager(this.allItems.length, page);

            // get current page of items
            this.pagedItems = this.allItems.slice(this.pager.startIndex, this.pager.endIndex + 1);
        }
        else {
            this.noEmployees = true;
        }
    }

    sortData(sort: Sort) {
        if (!sort.active || sort.direction === '') {
            // this.getCandidates();
            return;
        }

        this.allItems = this.allItems.sort((a, b) => {
            const isAsc = sort.direction === 'asc';
            switch (sort.active) {
                //   case 'name': return compare(a.name, b.name, isAsc);
                // case 'calories': return compare(a.calories, b.calories, isAsc);
                //  case 'fat': return compare(a.fat, b.fat, isAsc);
                case 'experienceNbr': return compare(a.experienceNbr, b.experienceNbr, isAsc);
                default: return 0;
            }
        });
        this.setPage(1);
        this.pagedItems = this.pagedItems.sort((a, b) => {
            const isAsc = sort.direction === 'asc';
            switch (sort.active) {
                //   case 'name': return compare(a.name, b.name, isAsc);
                // case 'calories': return compare(a.calories, b.calories, isAsc);
                //  case 'fat': return compare(a.fat, b.fat, isAsc);
                case 'experienceNbr': return compare(a.experienceNbr, b.experienceNbr, isAsc);
                default: return 0;
            }
        });

        function compare(a: number | string, b: number | string, isAsc: boolean) {
            return (a < b ? -1 : 1) * (isAsc ? 1 : -1);
        }
    }

    redirectNewEmployeePage() {
        this.router.navigate(['/rh/create']);
    }

    editEmployeePage(employee: Employee) {
        //console.log(employee);
        if (employee)
            this.router.navigate(['/rh/edit/' + employee.id]);
    }

    deleteEmployee(employee: Employee) {
        if (employee) {
            this.rhService.deleteEmployeeById(employee.id).subscribe(
                res => {
                    //console.log(res);
                    this.getEmployees();
                    this.notyf2.confirm('Employé supprimé avec succès');
                }, err => {
                    //console.log(err);
                    this.notyf2.alert('Error');
                }
            );
        }
    }

    displayEmployeePage(employee: Employee) {
        this.router.navigate(['employee/details/' + employee.id]);
    }

    manageTasks(employee: Employee) {
        if (employee) {
            this.router.navigate(['/employee/' + + employee.id + '/tasks']);
        }
    }

    isValidatedByEmp(id: number) {
        let date = new Date();
        let months = ["Janvier", "Février", "Mars", "Avril", "Mai", "Juin", "Juillet", "Aout", "Septembre", "Octobre", "Novembere", "Décembere"]; 
        let currentMonthYear = months[date.getMonth()] + ' ' + date.getFullYear();
       
        if (id) {
          this.rhService.isValidatedByEmp(id, currentMonthYear).subscribe(resp => {
            this.timesheetsValidation.set(id, resp);
          }, err => {});
        }
      }

      goToTimeSheetOf(idEmp : number){
        let date = new Date();
        let months = ["Janvier", "Février", "Mars", "Avril", "Mai", "Juin", "Juillet", "Aout", "Septembre", "Octobre", "Novembere", "Décembere"]; 
        this.router.navigate(['employee/' + idEmp  + '/timesheet/' + months[date.getMonth()]   + '/' + date.getFullYear() ]);
     }
}
