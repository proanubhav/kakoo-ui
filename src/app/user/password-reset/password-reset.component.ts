import { Component, OnInit } from '@angular/core';
import { FormControl, FormGroup, Validators } from "@angular/forms";
import { ActivatedRoute, Router } from '@angular/router';
import { AuthenticationService } from '../services/authentication.service';

@Component({
  selector: 'app-password-reset',
  templateUrl: './password-reset.component.html',
  styleUrls: ['./password-reset.component.scss']
})
export class PasswordResetComponent implements OnInit {
  hide = true;
  private jwtToken = null;
  resetForm: FormGroup;
  sub: any;
  code: string;
  b: boolean;
  validPassword: boolean;
  confirmedAccount: boolean;
  email: string;
  constructor(public route: ActivatedRoute,
    private router: Router,
    private authenticationService: AuthenticationService) { }

  ngOnInit() {
    this.loadToken();
    if (this.jwtToken) {
      this.router.navigate(['/user/profile']);
    }
    this.confirmedAccount = false;
    this.validPassword = false;
    this.sub = this.route.params.subscribe(params => {
      this.code = params['code'];
    });
    if (this.code) {
      this.b = true;
      this.getUser(this.code);

    }
    this.resetForm = new FormGroup({
      password: new FormControl('', Validators.required),
      passwordConfirm: new FormControl('', Validators.required)

    });

  }
  loadToken() {
    this.jwtToken = localStorage.getItem('token');
  }
  checkValidPassword(pass1: string, pass2: string) {
    if (pass1 == '' || pass2 == '' || pass1 != pass2)
      return false;
    else
      return true;

  }
  getUser(token: string) {
    this.authenticationService.getUserByToken(token).subscribe(
      resp => {
        //this.email=user.email;
        //console.log(this.email);
        //console.log(resp)
        this.email = resp.body['email'];
      }, err => {
        //console.log(err)
      }
    )
  }
  onReset() {
    this.authenticationService.reset(this.code, this.resetForm.controls['password'].value).subscribe(
      resp => {
        this.confirmedAccount = true;
        this.router.navigate(['/user/login']);
        //console.log('ok');
      },
      err => {
        //console.log('not ok')
      }
    )


  }
  redirectHome() {
    this.router.navigate(['']);

  }
  onLogin() {
    let user = {
      username: this.email,
      password: this.resetForm.controls['password'].value
    }
    this.authenticationService.login(user)
      .subscribe(resp => {
        let jwt = resp.headers.get('authorization');
        //console.log(jwt);
        //console.log('ok');
        //console.log(resp);
        this.authenticationService.saveToken(jwt);
        this.router.navigate(['/user/profile']);

      },
        err => {
          //console.log('not ok');
        })
  }

}
