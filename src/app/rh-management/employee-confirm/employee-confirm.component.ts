import { Component, OnInit } from '@angular/core';
import {FormControl, FormGroup, Validators} from "@angular/forms";
import {ActivatedRoute, Router} from "@angular/router";
import {RhManagementService} from "../rh-management.service";
import {AuthenticationService} from "../../user/services/authentication.service";

@Component({
  selector: 'app-employee-confirm',
  templateUrl: './employee-confirm.component.html',
  styleUrls: ['./employee-confirm.component.scss']
})
export class EmployeeConfirmComponent implements OnInit {

  private jwtToken = null;

  confirmationForm: FormGroup;
  sub: any;
  confirmedAccount: boolean;
  code: string;
  email: string;

  constructor(
    private router: Router,
    private route: ActivatedRoute,
    private rhService: RhManagementService,
    private authenticationService: AuthenticationService
  ) { }

  ngOnInit() {
    window.scroll(0, 0);

    this.loadToken();
    if(this.jwtToken) {
      this.router.navigate(['/user/profile']);
    }

    this.confirmedAccount = false;

    this.sub = this.route.params.subscribe(
      (params) => {
        this.code = params['code'];
      }
    );

    if(this.code) {
      this.getEmployee(this.code);
    }

    this.confirmationForm = new FormGroup(
      {
        password: new FormControl('', Validators.required),
        passwordConfirm: new FormControl('', Validators.required)
      }
    );
  }

  loadToken() {
    this.jwtToken = localStorage.getItem('token');
  }

  getEmployee(code: string) {
    this.rhService.getEmployeeByToken(code).subscribe(
      (resp) => {
        this.email = resp.body['email'];
        console.log("Email : " + this.email);
      }
    );
  }

  onConfirm() {
    console.log(this.confirmationForm.controls['passwordConfirm'].value);
    this.rhService.confirmRegistration(this.code, this.confirmationForm.controls['password'].value).subscribe(
      () => {
        this.confirmedAccount = true;
      }
    );
  }

  checkPassword(pass: string, passConfirm: string) {
    return !(pass == '' || passConfirm == '' || pass != passConfirm);
  }

  onLogin() {
    this.router.navigate(['/user/login']);
  }

  onCancel() {
    this.router.navigate(['/user/profile']);
  }

}
