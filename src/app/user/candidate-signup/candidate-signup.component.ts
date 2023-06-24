import { Component, OnInit } from '@angular/core';
import { FormControl, FormGroup, Validators, FormBuilder, AbstractControl } from "@angular/forms";
import { ActivatedRoute, Router } from '@angular/router';
import { User } from "../user.model";
import { Company } from "../company"
import { UserService } from "../user.service";
import { AuthenticationService } from "../services/authentication.service";
import { Observable } from "rxjs/Observable";
import { Title } from '@angular/platform-browser';
import 'notyf/dist/notyf.min.css';
import { UploadService } from '../../upload/upload.service';
import { COUNTRY } from '../../upload/details-upload/details-upload.component';
declare var require: any;

@Component({
  selector: 'app-candidate-signup',
  templateUrl: './candidate-signup.component.html',
  styleUrls: ['./candidate-signup.component.scss']
})
export class CandidateSignupComponent implements OnInit {
  private jwtToken = null;
  user: User;
  errorBoolean: boolean;
  confirmEmail: boolean;
  emailExist: boolean;
  loader: boolean;
  noCompanyError: boolean;
  noCountryError: boolean;
  private sh: number;
  private emailFormatError: boolean;
  private phoneFormatError: boolean;
  private Notyf = require('notyf');
  private notyf2 = new this.Notyf({
    delay: 5000,
    alertIcon: 'fa fa-exclamation-circle',
    confirmIcon: 'fa fa-check-circle'
  })

  companyTypes: string[] = [];
  country: COUNTRY;
  countries: Array<COUNTRY> = [];
  registrationForm: FormGroup;
  countryName: string;
  typeoffre: string;

  constructor(public route: ActivatedRoute,
    private router: Router,
    private authenticationService: AuthenticationService,
    private titleService: Title,
    private formBuilder: FormBuilder
  ) { }
  public setTitle(newTitle: string) {
    this.titleService.setTitle(newTitle);
  }


  ngOnInit() {
    window.scroll(0, 0);
    this.route.params.subscribe(params => {
      this.typeoffre = params['typeoffre'];
    });
    this.setTitle('Kakoo Software - Inscription');
    this.loadToken();
    if (this.jwtToken) {
      this.router.navigate(['/user/profile']);
    }
    this.emailFormatError = false;
    this.emailExist = false;
    this.loader = false;
    this.sh = 0;
    this.errorBoolean = false;
    this.confirmEmail = false;
    this.registrationForm = this.formBuilder.group({
      firstName: new FormControl('', Validators.required),
      lastName: new FormControl('', Validators.required),
      password: new FormControl('', Validators.required),
      email: new FormControl('',
        [Validators.required, Validators.pattern("[^ @]*@[^ @]*")], this.checkEmail.bind(this)),
    });
  }

  loadToken() {
    this.jwtToken = localStorage.getItem('token');
  }
  
  onSubmit() {
    this.emailExist = false;
    if (this.registrationForm.valid) {
      this.emailFormatError = false;
      this.phoneFormatError = false;
      this.errorBoolean = false;
      this.loader = true;

      // let user: User = new User();
      let user = {
        firstName: this.registrationForm.controls['firstName'].value,
        lastName: this.registrationForm.controls['lastName'].value,
        email: this.registrationForm.controls['email'].value,
        fkCandidateId: 1,
        password: this.registrationForm.controls['password'].value,
      };

      // var toffre = this.typeoffre == undefined ? "signup" : this.typeoffre;
      this.authenticationService.candidateSignup(user).subscribe(
        resp => {
          console.log('Candidate Signup', resp)
          // this.errorBoolean = false;
          // this.confirmEmail = true;
          // this.loader = false;
          // if (resp) {
          //   this.authenticationService.getActivationLink(user.email).subscribe(
          //     r => {
          //       let urlActivation = `users/confirm/${r['link']}/${toffre}`;
          //       this.router.navigate([urlActivation]);
          //     },
          //     err => {
          //     }
          //   );
          // }

        },
        err => {
          this.errorBoolean = true;
          this.notyf2.alert(" Echec d'inscription , Vous devez compléter/corriger les champs en rouge");
          if (err.status == 409) {
            this.emailExist = true;
            this.registrationForm.controls.email.patchValue("");
          }
          if (err.error.errors)
            for (let e of err.error.errors) {
              this.handleErros(e)
            }
          this.loader = false;
        }
      );
    }
    else {
      this.errorBoolean = true;
      this.showAlert();
    }
  }
  showAlert() {
    if (this.sh == 1) {
      this.notyf2.alert(" Echec d'inscription , Vous devez compléter/corriger les champs en rouge");
      this.sh = 0;
    }
    else
      this.sh = 1;
  }

  nextValid() {
    return this.registrationForm.controls['firstName'].valid
      && this.registrationForm.controls['lastName'].valid
      && this.registrationForm.controls['username'].valid
      && this.registrationForm.controls['email'].valid;
  }

  handleErros(err) {
    switch (err) {
      case "email: user.email.format": {
        this.emailFormatError = true;
        this.registrationForm.controls.email.patchValue("");
        break;
      }
      case "phone: user.phone.format": {
        this.phoneFormatError = true;
        this.registrationForm.controls.companyPhone.patchValue("");
        break;
      }
      case "firstName: user.firstName.format": {
        this.emailFormatError = true;
        this.registrationForm.controls.firstName.patchValue("");
        break;
      }
      case "firstName: user.lastName.format": {
        this.emailFormatError = true;
        this.registrationForm.controls.lastName.patchValue("");
        break;

      }
      case "username: user.username.format": {
        this.registrationForm.controls.username.patchValue("");
        break;

      }
      case "com.kakoo.model.Company name: company.name.format": {
        this.registrationForm.controls.companyName.patchValue("");
        break;

      }
      case "com.kakoo.model.Company name: company.name.size": {
        this.registrationForm.controls.companyName.patchValue("");
        break;

      }

      case "com.kakoo.model.Company address: company.address.format": {
        this.registrationForm.controls.companyPostalCode.patchValue("");
        this.registrationForm.controls.companyCity.patchValue("");
        this.registrationForm.controls.companyAddress.patchValue("");
        break;
      }

    }
  }

  public handleError = (error: Response) => { }

  redirectHome() {
    this.router.navigate(['']);
  }

  redirectLogin() {
    this.router.navigate(['/user/login']);
  }
  
  goTerms(): void {
    this.router.navigate(['terms']);
  }

  checkEmail(control: AbstractControl): any {
    return this.authenticationService.isEmailExist(control.value).map(res => {
      console.log(res);
      return (res == true) ? { emailTaken: true } : null;
    });
  }

  checkUsername(control: AbstractControl): any {
    return this.authenticationService.isUsernameExist(control.value).map(res => {
      console.log(res);
      return (res == true) ? { usernameTaken: true } : null;
    });
  }
}
