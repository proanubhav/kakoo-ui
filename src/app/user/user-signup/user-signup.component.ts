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
  selector: 'app-user-signup',
  templateUrl: './user-signup.component.html',
  styleUrls: ['./user-signup.component.scss']
})
export class UserSignupComponent implements OnInit {
  private jwtToken = null;
  user: User;
  errorBoolean: boolean;
  confirmEmail: boolean;
  emailExist: boolean;
  loader: boolean;
  next: boolean;
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
    private userService: UserService,
    private authenticationService: AuthenticationService,
    private titleService: Title,
    private uploadService: UploadService,
    private formBuilder: FormBuilder
  ) { }
  public setTitle(newTitle: string) {
    this.titleService.setTitle(newTitle);
  }


  ngOnInit() {
    window.scroll(0, 0);
    this.route.params.subscribe(params => {
      this.typeoffre = params['typeoffre'];
      //console.log("type offre nginit " + this.typeoffre);

    });
    this.setTitle('Kakoo Software - Inscription');
    this.getCompanies();
    this.getCountries();
    this.loadToken();
    if (this.jwtToken) {
      this.router.navigate(['/user/profile']);
    }
    this.emailFormatError = false;
    this.emailExist = false;
    this.next = false;
    this.loader = false;
    this.sh = 0;
    this.errorBoolean = false;
    this.confirmEmail = false;
    this.registrationForm = this.formBuilder.group({
      firstName: new FormControl('', Validators.required),
      lastName: new FormControl('', Validators.required),
      companyName: new FormControl('', Validators.required),
      companyPostalCode: new FormControl('', Validators.required),
      companyCity: new FormControl('', Validators.required),
      companyCountry: new FormControl('', Validators.required),
      companyPhone: new FormControl('', Validators.required),
      companyType: new FormControl('', Validators.required),
      companyAddress: new FormControl('', Validators.required),
      email: new FormControl('',   
        [Validators.required,Validators.pattern("[^ @]*@[^ @]*")], this.checkEmail.bind(this)),
      username: new FormControl('', Validators.required, this.checkUsername.bind(this)),
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
      let company1: Company = new Company(this.registrationForm.controls['companyAddress'].value + ' ' + this.registrationForm.controls['companyPostalCode'].value + '  ' + this.registrationForm.controls['companyCity'].value + ' ' + this.registrationForm.controls['companyCountry'].value,
        this.registrationForm.controls['companyName'].value,
        this.registrationForm.controls['companyPhone'].value,
        this.registrationForm.controls['companyType'].value);

      let user: User = new User();
      user = {
        username: this.registrationForm.controls['username'].value,
        password: 'password',
        lastName: this.registrationForm.controls['lastName'].value,
        email: this.registrationForm.controls['email'].value,
        firstName: this.registrationForm.controls['firstName'].value,
        phone: this.registrationForm.controls['companyPhone'].value,
        company: company1,

      };

      var toffre = this.typeoffre == undefined ? "signup" : this.typeoffre;
      this.authenticationService.signup(user, toffre).subscribe(
        resp => {
          //console.log('signup ok');
          //console.log(resp);
          this.errorBoolean = false;
          this.confirmEmail = true;
          //console.log(resp);
          this.loader = false;
          // resp true if user has choise of offres
          if (resp) {
            this.authenticationService.getActivationLink(user.email).subscribe(
              r => {
                //console.log("here");
                let urlActivation = `users/confirm/${r['link']}/${toffre}`;
                //console.log("yrl activation" + urlActivation);
                this.router.navigate([urlActivation]);
              },
              err => {
                //console.log("Error parsing");
              }
            );
          }
          //console.log("object keys " + Object.keys(resp));

        },
        err => {
          //console.log("Object Error Keys " + Object.keys(err));
          //console.log("err.headers =>" + err.headers + "err.status =>" + err.status + "err.statusText =>" + err.statusText + "err.url =>" + err.url + "err.ok =>" + err.ok + "err.name =>" + err.name + "err.message =>" + err.message + "error errror" + err.error);
          this.next = false;
          //console.log(err)
          //console.clear()
          //this.handleError(error)
          this.errorBoolean = true;
          this.notyf2.alert(" Echec d'inscription , Vous devez compléter/corriger les champs en rouge");
          // //console.log(err)
          //console.log('signup not ok')
          // //console.log(err.error)
          // //console.log(err.error.errors)
          if (err.status == 409) {
            this.emailExist = true;
            this.registrationForm.controls.email.patchValue("");
          }
          if (err.error.errors)
            for (let e of err.error.errors) {
              //console.log(e)
              this.handleErros(e)
            }
          this.loader = false;
        }
      );



    }
    else {
      // this.errorBoolean=true;
      //this.next=false;
      this.errorBoolean = true;
      this.showAlert();

      console.log("try again")
      // this.notyf2.alert('Compétence ajoutée');


    }
  }
  showAlert() {
    //console.log(this.sh)
    if (this.sh == 1) {
      this.notyf2.alert(" Echec d'inscription , Vous devez compléter/corriger les champs en rouge");
      this.sh = 0;
    }
    else
      this.sh = 1;
    //console.log(this.sh)

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
        // this.registrationForm.controls.companyPhone.reset();

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

  public handleError = (error: Response) => {

    // Do messaging and error handling here
    //console.log('message caught')
    //console.log(error)
    // return Observable.throw(error)
  }

  redirectHome() {
    this.router.navigate(['']);


  }
  redirectLogin() {
    this.router.navigate(['/user/login']);
  }
  getCompanies() {
    this.userService.getCompaniesTypes().subscribe(
      resp => {
        let i = 0;
        while (resp.body[i] != null) {
          this.companyTypes[i] = resp.body[i];
          i++;
        }
      }, err => {
        //console.log('eroors')
        //console.log(err)
        this.noCompanyError = true;
        this.notyf2.alert("La liste des types de sociétés est introuvable");

      }
    )
  }
  // ancienne version
  /* getCountries() {
     this.userService.getCountries().subscribe(
       resp => {
         let i = 0;
         while (resp.body[i] != null) {
           this.countries[i] = resp.body[i]
           i++;
         }
       }, err => {
         //console.log('eroors')
         //console.log(err)
         this.noCountryError = true;
         this.notyf2.alert("La liste des pays est introuvable");
 
       }
     )
   }
 */
  getCountries(): void {
    this.authenticationService.getTrackedUser().subscribe(resp => {
      if ('countryName' in resp.body) {
        this.countryName = resp.body['countryName'];
        //console.log("counry name is " + this.countryName);
      }
    });
    this.uploadService.getCountriesAllInfo().subscribe(

      resp => {
        if ('body' in resp) {
          if (this.countryName !== undefined) {
            //console.log("from if");
            for (let i in resp.body) {
              if (this.countryName !== undefined && resp.body[i].name !== undefined) {
                if (this.countryName == resp.body[i].name) {
                  let name = resp.body[i].name;
                  let flag = resp.body[i].flag;
                  let currency_code = resp.body[i].currencies[0].code;
                  let currency_name = resp.body[i].currencies[0].name;
                  let alpha2Code = resp.body[i].alpha2Code;
                  this.country = new COUNTRY(name, flag, currency_code, currency_name, alpha2Code);

                }
              }
              let name = resp.body[i].name;
              let flag = resp.body[i].flag;
              let currency_code = resp.body[i].currencies[0].code;
              let currency_name = resp.body[i].currencies[0].name;
              let alpha2Code = resp.body[i].alpha2Code;

              let country = new COUNTRY(name, flag, currency_code, currency_name, alpha2Code);
              //console.log("currency Code" + currency_code);
              this.countries.push(country);
            }
          } else {
            //console.log("from else");

            for (let i in resp.body) {
              let name = resp.body[i].name
              let flag = resp.body[i].flag;
              let currency_code = resp.body[i].currencies[0].code;
              let currency_name = resp.body[i].currencies[0].name;
              let alpha2Code = resp.body[i].alpha2Code;

              this.country = new COUNTRY(name, flag, currency_code, currency_name, alpha2Code);
              //console.log("currency Code" + currency_code);
              this.countries.push(this.country);

            }

          }


        }
      }
    );
  }
  goTerms(): void {
    this.router.navigate(['terms']);
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
