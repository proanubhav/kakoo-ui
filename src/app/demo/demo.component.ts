import { Component, OnInit } from '@angular/core';
import { DateAdapter } from '@angular/material';
import { FormControl, FormGroup, Validators } from "@angular/forms";
import { DemoService } from "./demo.service";
import { UserDemo } from "./userDemo";
import { DatePipe } from '@angular/common';
import { ActivatedRoute } from '@angular/router';
declare var $: any;
declare var jQuery: any;

@Component({
  selector: 'app-demo',
  templateUrl: './demo.component.html',
  styleUrls: ['./demo.component.scss']
})
export class DemoComponent implements OnInit {
  myDate: Date;
  putCode: boolean;
  chooseDate: boolean;
  done: boolean = false;
  registrationForm: FormGroup;
  userDemo: UserDemo;
  emailCompany: boolean = true;
  code: String = "";
  genCode: String;
  isHome: boolean = true;
  constructor(private dateAdapter: DateAdapter<any>,
    private demoService: DemoService, public datepipe: DatePipe, public route: ActivatedRoute) { this.dateAdapter.setLocale('fr'); }

  ngOnInit() {

    this.route.params.subscribe(params => {
      if (params['home'] != undefined) {
        this.isHome = false;
      }
    });

    this.genCode = this.randomString();
    this.putCode = false;
    this.chooseDate = false;
    this.registrationForm = new FormGroup({
      firstName: new FormControl('', Validators.required),
      lastName: new FormControl('', Validators.required),
      companyName: new FormControl('', Validators.required),
      companyPhone: new FormControl('', Validators.required),
      email: new FormControl('', [
        Validators.required,
        Validators.pattern("[^ @]*@[^ @]*")

      ]),
    });

    // animation of meilleurs offres
    var elements = document.getElementsByClassName("meilleurs");
    //console.log(elements.length);
    jQuery.each(elements, function (i, element) {
      element.style.animationName = "offres";
      element.style.animationDuration = i / 2 + "s";
    });

  }
  askDemo() {

    if (this.registrationForm.valid) {

      let d = this.datepipe.transform(this.myDate, 'dd-MM-yyyy HH:mm').toString();
      this.userDemo = new UserDemo(this.registrationForm.controls['firstName'].value, this.registrationForm.controls['lastName'].value, this.registrationForm.controls['email'].value,
        this.registrationForm.controls['companyName'].value, this.registrationForm.controls['companyPhone'].value, d, this.genCode);
      //console.log(this.userDemo)
      this.demoService.askForDemo(this.userDemo).subscribe(
        resp => {
          //console.log(resp);
          this.done = true;
        }
      );

    }
  }

  nextValidToCode() {
    if (this.registrationForm.controls['firstName'].valid
      && this.registrationForm.controls['lastName'].valid
      && this.registrationForm.controls['companyName'].valid
      && this.registrationForm.controls['companyPhone'].valid
      && this.registrationForm.controls['email'].valid
      && this.checkcompanyMail(this.registrationForm.controls['email'].value)
    ) {
      this.putCode = true;
      this.userDemo = new UserDemo(this.registrationForm.controls['firstName'].value, this.registrationForm.controls['lastName'].value, this.registrationForm.controls['email'].value,
        this.registrationForm.controls['companyName'].value, this.registrationForm.controls['companyPhone'].value, null, this.genCode);
      this.demoService.sendCodeValidation(this.userDemo).subscribe(
        resp => {
          //console.log(resp);
          return true;
        }
      );

    }
    else return false
  }

  nextValidToDate() {
    if (this.code == this.genCode) {
      this.chooseDate = true;
      return true;
    } else return false;
  }

  sendValid() {
    if (this.myDate != null && this.myDate != null) {
      return true;
    } else return false;
  }

  randomString() {
    var result = '';
    var chars = '0123456789abcdefghijklmnopqrstuvwxyzABCDEFGHIJKLMNOPQRSTUVWXYZ';
    for (var i = 6; i > 0; --i) result += chars[Math.floor(Math.random() * chars.length)];
    return result;
  }

  checkcompanyMail(email: String) {
    if (email.indexOf("gmail") >= 0 || email.indexOf("hotmail") >= 0 || email.indexOf("live") >= 0
      || email.indexOf("yahoo") >= 0) {
      this.registrationForm.controls.email.patchValue("");
      this.emailCompany = false;
      return false;
    } else {
      this.emailCompany = true;
      return true;
    }

  }
}
