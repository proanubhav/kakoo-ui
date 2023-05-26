import { Component, OnInit } from '@angular/core';
import { AuthenticationService } from '../services/authentication.service';
import { User } from '../user.model';
import { Router } from '@angular/router';
import { FormControl, FormGroup, Validators } from "@angular/forms";
import 'notyf/dist/notyf.min.css';
declare var require: any;



@Component({
  selector: 'app-user-settings',
  templateUrl: './user-settings.component.html',
  styleUrls: ['./user-settings.component.scss']
})
export class UserSettingsComponent implements OnInit {
  public change: boolean;
  private userConnect: string;
  private firstName: string;
  private lastName: string;
  private companyName: string;
  private companyAddress: string;
  private role: string;
  private mail: string;
  private phone: string;
  private companyPhone: string;
  private username: string;
  private companyType: string;
  private users: User[];
  changeForm: FormGroup;
  private Notyf = require('notyf');
  private notyf2 = new this.Notyf({
    delay: 5000,
    alertIcon: 'fa fa-exclamation-circle',
    confirmIcon: 'fa fa-check-circle'
  })


  constructor(private router: Router,
    private authenticationService: AuthenticationService) { }

  ngOnInit() {
    this.change = false;
    this.getConnectedUser();
    this.changeForm = new FormGroup({
      oldpassword: new FormControl('', Validators.required),
      password: new FormControl('', Validators.required),
      passwordConfirm: new FormControl('', Validators.required)

    });

  }
  checkValidPassword(pass1: string, pass2: string) {
    if (pass1 == '' || pass2 == '' || pass1 != pass2)
      return false;
    else
      return true;

  }
  changePassword() {
    var oldPassword = this.changeForm.controls['oldpassword'].value;
    var newPassword = this.changeForm.controls['password'].value;
    this.authenticationService.changePassword(oldPassword, newPassword).subscribe(
      resp => {
        this.change = false;
        this.notyf2.confirm('Votre mot de passe a été modifié')
        this.changeForm.reset();
      }, err => {
        console.clear();
        this.notyf2.alert('Mot de passe actuel incorrect')
        this.changeForm.reset();


      }
    );
  }
  addnewRhPage() {
    this.router.navigate(['/users/add-user']);
  }
  isAdmin() {
    if (this.role == 'ADMIN')
      return true;
    else return false;
  }
  redirectSettings() {
    this.router.navigate(['/user/settings']);

  }
  redirectAllUsers() {
    this.router.navigate(['/company/allusers']);
  } getConnectedUser() {
    this.authenticationService.getConnectedUser().subscribe(
      resp => {
        //
        if (resp) {//console.log('resp exist')
          //console.log(resp.body)
          //console.log('le canddiate connecté est ')
          this.userConnect = resp.body['lastName'] + ' ' + resp.body['firstName'];
          this.firstName = resp.body['firstName'];
          this.lastName = resp.body['lastName'];
          this.phone = resp.body['phone'];
          this.mail = resp.body['email'];
          this.username = resp.body['username'];
          this.companyName = resp.body['company'].name;
          this.companyAddress = resp.body['company'].address;
          this.companyType = resp.body['company'].type;
          this.role = resp.body['roles'][0].role;
          this.companyPhone = resp.body['company'].phone;
          //console.log('company s name')
          //console.log(resp.body['company'].name);
        }
        else {
          // //console.log('non resp')
          //console.log(resp)
        }
      }
    )
  }

}
