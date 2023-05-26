import { Component, OnInit } from '@angular/core';
import { FormControl, FormGroup, Validators } from "@angular/forms";
import { ActivatedRoute, Router } from '@angular/router';
import { AuthenticationService } from '../services/authentication.service';
import { PaymentComponent } from '../payment/payment.component';
import { MatDialog } from '@angular/material';
import { RequestEtiGeComponent } from '../payment/request-eti-ge/request-eti-ge.component';

@Component({
  selector: 'app-user-confirm',
  templateUrl: './user-confirm.component.html',
  styleUrls: ['./user-confirm.component.scss']
})
export class UserConfirmComponent implements OnInit {
  private jwtToken = null;
  confirmForm: FormGroup;
  sub: any;
  code: string;
  b: boolean;
  email: string;
  validPassword: boolean;
  confirmedAccount: boolean;
  typeoffre: any;


  constructor(public route: ActivatedRoute,
    private router: Router,
    private authenticationService: AuthenticationService,
    public matDialog: MatDialog) { }

  ngOnInit() {

    window.scroll(0, 0);
    this.route.params.subscribe(params => {
      this.typeoffre = params['typeoffre'];
      //console.log("type offre nginit " + this.typeoffre);

    });
    this.loadToken();
    if (this.jwtToken) {
      this.router.navigate(['/user/profile'])
    }
    this.confirmedAccount = false;
    this.validPassword = false;
    this.sub = this.route.params.subscribe(params => {
      this.code = params['code'];
      //console.log("Code " + this.code);
    });
    if (this.code) {
      this.b = true;
      this.getUser(this.code);

    }
    this.confirmForm = new FormGroup({
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
        //console.log(resp.body['email'])
        this.email = resp.body['email'];
        // //console.log(this.email)
      }, err => {
        // //console.log(err)
      }
    )
  }

  onConfirm() {
    console.log(this.confirmForm.controls['password'].value);
    this.authenticationService.confirm(this.code, this.confirmForm.controls['password'].value).subscribe(
      resp => {
        //console.log('ok');
        if (this.typeoffre !== undefined) {
          this.onLogin();
        }
        this.confirmedAccount = true;

      },
      err => {
        //this.mode=1;
        //console.log('not ok')
      }
    )


  }
  onLogin() {
    this.router.navigate(['/user/login']);
    // let user = {
    //   username: this.email,
    //   password: this.confirmForm.controls['password'].value
    // }
    // this.authenticationService.login(user)
    //   .subscribe(resp => {
    //     let jwt = resp.headers.get('authorization');
    //     //console.log(jwt);
    //     //console.log('ok');
    //     //console.log(resp);
    //     this.authenticationService.saveToken(jwt);
    //     if (this.typeoffre == undefined) {
    //       this.router.navigate(['/user/profile']);
    //     }
    //     else {
    //       if (this.typeoffre == "ETI") {
    //         this.openDialogContactUs();
    //       } else {
    //         this.openDialogPayment(this.typeoffre);

    //       }
    //     }

    //   },
    //     err => {
    //       //console.log('not ok');
    //     })
  }

  openDialogPayment(type: string): void {
    let dialogRef = this.matDialog.open(
      PaymentComponent, {
      width: '600px',
      panelClass: 'my-mat-dialog-container',
      data: { type: type }
    }
    );
  }

  openDialogContactUs(): void {
    let dialogRef = this.matDialog.open(
      RequestEtiGeComponent, {
      width: '800px',
      panelClass: 'my-mat-dialog-container'
    }
    );
  }
}
