import { Component, OnInit } from '@angular/core';
import { FormGroup, Validators, FormControl, FormBuilder } from '@angular/forms';
import { Employee } from '../employee';
import { ActivatedRoute, Router } from '@angular/router';
import { AuthenticationService } from '../../user/services/authentication.service';
import { RhManagementService } from '../rh-management.service';
import { AbstractControl, ValidatorFn } from '@angular/forms';

import 'notyf/dist/notyf.min.css';
import {Service} from "../service";

declare var require: any;

export class customValidationService {
  static checkLimit(min: number, max: number): ValidatorFn {
    return (c: AbstractControl): { [key: string]: boolean } | null => {
      if (c.value && (isNaN(c.value) || c.value < min || c.value > max)) {
        return { 'range': true };
      }
      return null;
    };
  }
}

@Component({
  selector: 'app-rh-create',
  templateUrl: './rh-create.component.html',
  styleUrls: ['./rh-create.component.scss'],
  providers: [RhManagementService]
})
export class RhCreateComponent implements OnInit {

  employeeForm: FormGroup;
  employee : Employee;
  serviceId: number;
  loader: boolean;
  id: number;
  employeeId: number;
  editing = false;

  private jwtToken = null;
  private sub: any;
  private Notyf = require('notyf');
  private notyf2 = new this.Notyf({
    delay: 4000,
    alertIcon: 'fa fa-exclamation-circle',
    confirmIcon: 'fa fa-check-circle'
  });

  constructor(public route: ActivatedRoute,
    private router: Router,
    private rhService: RhManagementService,
    private authenticationService: AuthenticationService,
    private formBuilder: FormBuilder) { }

  ngOnInit() {
    this.loader = false;
    this.loadToken();
    if (!this.jwtToken) {
      this.router.navigate([''])
    }
    this.sub = this.route.params.subscribe(
      params => {
        this.id = params['id'];
      }
    );

    this.employeeForm = this.formBuilder.group({
        matricule: new FormControl('', Validators.required),
        firstName: new FormControl('', Validators.required),
        lastName: new FormControl('', Validators.required),
        familySituation: new FormControl('', Validators.required),
        childrenNbr: new FormControl('', Validators.required),
        service: new FormControl('', Validators.required),
        salary: new FormControl('', Validators.required),
        email: new FormControl('', [Validators.required, Validators.pattern("[^ @]*@[^ @]*") ], this.checkEmail.bind(this)),
        address: new FormControl('', Validators.required),
        civility: new FormControl('', Validators.required),
        phone: new FormControl('', Validators.required),
        profile: new FormControl('', Validators.required),
        experience: new FormControl('', Validators.required),
        username: new FormControl('', Validators.required, this.checkUsername.bind(this))
    });

    if(this.id) {
      this.editing = true;

      this.rhService.findEmployeeById(this.id).subscribe(
        res => {
          //console.log(res.body['profile']);
          this.serviceId  = res.body['service'] != null ?res.body['service'].id : -1;
          this.employeeId = res.body['id'];
          this.employeeForm.patchValue({
            matricule: res.body['matricule'],
            firstName: res.body['firstName'],
            lastName: res.body['lastName'],
            familySituation: res.body['familySituation'],
            childrenNbr: res.body['childrenNbr'],
            service: this.serviceId != -1 ? res.body['service'].name : "",
            salary: res.body['salary'],
            email: res.body['email'],
            username: res.body['username'],
            phone: res.body['phone'],
            experience: res.body['experienceNbr'],
            address: res.body['address'],
            civility: res.body['gender'],
            profile: res.body['profile']
            });
        }
      );
    }

  }
  ngOnDestroy(): void {
    this.sub.unsubscribe();
  }
  loadToken() {
    this.jwtToken = localStorage.getItem('token');
  }

  onSubmit() {
    //console.log(this.employeeId);
    // if (this.employeeForm.valid) {
    this.loader = true;
    if (this.employeeId) {
      let service1: Service = new Service(this.serviceId, this.employeeForm.controls['service'].value);
      let employee: Employee = new Employee(
        this.employeeId,
        this.employeeForm.controls['matricule'].value,
        this.employeeForm.controls['firstName'].value,
        this.employeeForm.controls['lastName'].value,
        this.employeeForm.controls['familySituation'].value,
        this.employeeForm.controls['childrenNbr'].value,
        this.employeeForm.controls['phone'].value,
        this.employeeForm.controls['email'].value,
        this.employeeForm.controls['address'].value,
        this.employeeForm.controls['civility'].value,
        this.employeeForm.controls['experience'].value,
        this.employeeForm.controls['username'].value,
        this.employeeForm.controls['salary'].value,
        this.employeeForm.controls['profile'].value,
        service1
      );
      this.rhService.updateEmployee(employee).subscribe(
        resp => {
          this.loader = false;
          this.notyf2.confirm(' Employé modifié avec succès');
          //console.log(resp)
          this.redirectRhPage();
          //this.redirectAssignTask(employee);

        }, err => {
          //console.log(err);
          this.loader = false;
          this.notyf2.alert('Echec de modification de l\'employé , vous avez des champs invalide');


        }
      );


    }else {
      let service2: Service = new Service(0, this.employeeForm.controls['service'].value);
      let employee: Employee = new Employee(
        0,
        this.employeeForm.controls['matricule'].value,
        this.employeeForm.controls['firstName'].value,
        this.employeeForm.controls['lastName'].value,
        this.employeeForm.controls['familySituation'].value,
        this.employeeForm.controls['childrenNbr'].value,
        this.employeeForm.controls['phone'].value,
        this.employeeForm.controls['email'].value,
        this.employeeForm.controls['address'].value,
        this.employeeForm.controls['civility'].value,
        this.employeeForm.controls['experience'].value,
        this.employeeForm.controls['username'].value,
        this.employeeForm.controls['salary'].value,
        this.employeeForm.controls['profile'].value,
        service2
      );

      //console.log(employee);

      this.rhService.saveEmployee(employee).subscribe(
        resp => {
          this.loader = false;
          this.notyf2.confirm('Nouveau employé ajouté');
          this.redirectRhPage();
          //this.redirectAssignTask(employee);
        }, err => {
          //console.log(err);
          this.loader = false;
          this.notyf2.alert('Echec de création de l\'employé , vous avez des champs invalide');
        }
      );
    }

    // }

  }
  redirectRhPage() {
    this.router.navigate(['/rh/list/']);

  }

   cancelOperation() {
    // if (this.editing)
    //   this.router.navigate(['/candidate/details/', this.id]);
    // else
      this.router.navigate(['/rh/list']);

  }

  redirectAssignTask(employee: Employee) {
    if(employee)
      this.router.navigate(['/rh/assign-task/' + employee.id]);
  }

  checkEmail(control: AbstractControl): any {
    return this.authenticationService.isEmailExist(control.value).map(res => {
     console.log(res);
     return  (res == true) ? { emailTaken: true } : null;
   });
  }

  checkUsername(control: AbstractControl): any {
    return this.authenticationService.isUsernameExist(control.value).map(res => {
     console.log(res);
     return  (res == true) ? { usernameTaken: true } : null;
   });
  }
}
