import { Component, OnInit } from '@angular/core';
import { FormControl, FormGroup, Validators, RadioControlValueAccessor } from "@angular/forms";
import { ActivatedRoute, Router } from '@angular/router';
import { UserService } from "../user.service";
import { AuthenticationService } from "../services/authentication.service";
import { Title } from '@angular/platform-browser';
import 'notyf/dist/notyf.min.css';

declare var require: any;

@Component({
  selector: 'app-add-rh',
  templateUrl: './add-rh.component.html',
  styleUrls: ['./add-rh.component.scss']
})
export class AddRhComponent implements OnInit {
  rhForm: FormGroup;
  confirmEmail: boolean;
  emailExist: boolean;
  loader: boolean;
  errorMessage: boolean;
  private role: string;
  private firstName: string;
  private lastName: string;
  private companyName: string;
  private userId: number;
  private userRole;
  private Notyf = require('notyf');
  private notyf2 = new this.Notyf({
    delay: 5000,
    alertIcon: 'fa fa-exclamation-circle',
    confirmIcon: 'fa fa-check-circle'
  })
  sub:any;
  id:any;



  constructor(private userService: UserService,
    private authenticationService: AuthenticationService,
    private router: Router,public route: ActivatedRoute,
    private titleService: Title,
  ) { }
  public setTitle(newTitle: string) {
    this.titleService.setTitle(newTitle);
  }

  ngOnInit() {
    this.setTitle("Kakoo Software - Ajout d'un collaborateur");
    this.sub = this.route.params.subscribe(params => {
      this.id = params['id'];
    });
    console.log('iddd', this.sub, this.id)
    this.getConnectedUser();
    this.checkAdmin();
    this.loader = false;
    this.errorMessage = false;
    this.confirmEmail = false;
    this.emailExist = false;
    this.rhForm = new FormGroup({
      firstName: new FormControl('', Validators.required),
      lastName: new FormControl('', Validators.required),
      username: new FormControl('', Validators.required),
      phone: new FormControl('', Validators.required),
      userRole: new FormControl('', Validators.required),
      email: new FormControl('', [
        Validators.required,
        Validators.pattern("[^ @]*@[^ @]*")

      ]),


    });



    // Display an alert notification 
    //notyf.confirm('Remplissez ce formulaire pour ajouter un nouveau collaborateur')



  }
  redirectProfile() {
    this.router.navigate(['user/profile']);
  }
  redirectSettings() {
    this.router.navigate(['/user/settings']);

  }
  redirectAllUsers() {
    this.router.navigate(['/company/allusers']);
  }

  goProfile() {
    this.router.navigate(['/user/profile']);
  }
  refresh() {
    window.location.href = window.location.href;
  }
  checkAdmin() {
    this.authenticationService.getConnectedUser().subscribe(
      resp => {
        if (resp) {
          this.role = resp.body['roles'][0].role;
          if (this.role != "ADMIN")
            this.router.navigate(['user/profile'])

        }
        else {
          this.router.navigate(['']);
        }
      }
    )
  }
  getConnectedUser() {
    this.authenticationService.getConnectedUser().subscribe(
      resp => {
        //
        if (resp) {//console.log('resp exist')
          //console.log(resp.body)
          //console.log('le canddiate connecté est ')
          this.firstName = resp.body['firstName'];
          this.lastName = resp.body['lastName'];
          this.companyName = resp.body['company'].name;


        }
        else {
          // //console.log('non resp')
        }
      }
    )
  }
  addRole(id, role) {
    this.authenticationService.addRole(id, role).subscribe(resp => {
      // //console.log('role adding'+id+' ')
      //console.log(role)
      //console.log(resp)
      this.router.navigate(['company/allusers']);

    });
  }
  showAlert() {
    this.notyf2.alert(" Echec d'ajout , Vous devez compléter/corriger les champs en rouge");

  }
  showErrors(errorMessage: string) {
    this.notyf2.alert(errorMessage);

  }
  showSuccess() {
    this.notyf2.confirm("Collaborateur ajouté , un mail lui a été envoyer pour confirmer son inscription");

  }
  handleErros(err) {
    switch (err) {
      case "email: user.email.format": {
        this.rhForm.controls.email.patchValue("");

        break;
      }

      case "firstName: user.firstName.format": {
        this.rhForm.controls.firstName.patchValue("");
        break;

      }
      case "lastName: user.lastName.format": {
        this.rhForm.controls.lastName.patchValue("");
        break;

      }
      case "username: user.username.format": {
        this.rhForm.controls.username.patchValue("");
        break;

      }
      case "phone: user.phone.format": {
        this.rhForm.controls.phone.patchValue("");
        break;

      }

    }
  }
  redirectAllUsersPage() {
    this.router.navigate(['company/allusers']);
  }
  createRh() {
    this.emailExist = false;
    if (this.rhForm.valid) {
      this.loader = true;
      this.userRole = {
        description: 'NULL',
        role: this.rhForm.controls['userRole'].value
      };
      //console.log(this.userRole);
      let user = {
        firstName: this.rhForm.controls['firstName'].value,
        lastName: this.rhForm.controls['lastName'].value,
        email: this.rhForm.controls['email'].value,
        username: this.rhForm.controls['username'].value,
        phone: this.rhForm.controls['phone'].value,
        password: "password"
      };
      //console.log(user);
      this.authenticationService.addRh(user).subscribe(
        resp => {
          this.confirmEmail = true;
          //console.log(resp.body['id']);
          this.userId = resp.body['id'];
          this.addRole(this.userId, this.userRole);
          this.loader = false;
          this.showSuccess();

        },
        err => {
          this.loader = false;
          this.errorMessage = true;

          // var keys = Object.keys(err);
          if (err.status == 403) {
            let msg = "Impossible de créer  Un utilisateur avec nom : " + user.lastName + " RH max atteint.";
            this.showErrors(msg);
          } else {
            this.showAlert();
          }

          // //console.log('adding not ok')
          // //console.log(err)
          if (err.status == 409) {
            this.emailExist = true;
            this.rhForm.controls.email.patchValue("");
          }
          if (err.error.errors)
            for (let e of err.error.errors) {
              //  //console.log(e)
              this.handleErros(e)
            }

        }
      );
    }
    else {
      this.showAlert();
      // //console.log('invalid form');
      // //console.log(this.rhForm)
    }
  }

}

