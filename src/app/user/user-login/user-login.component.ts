import { Component, OnInit } from '@angular/core';
import { FormControl, FormGroup, Validators } from "@angular/forms";
import { UserService } from "../user.service";
import { User } from "../user.model";
import { AuthenticationService } from "../services/authentication.service";
import { ActivatedRoute, Router } from '@angular/router';
import { ReactiveFormsModule } from "@angular/forms";
import { Title } from '@angular/platform-browser';
import 'notyf/dist/notyf.min.css';

declare var require: any;

@Component({
  selector: 'app-user-login',
  templateUrl: './user-login.component.html',
  styleUrls: ['./user-login.component.scss']
})
export class UserLoginComponent implements OnInit {

  private jwtToken = null;
  hide = true;
  loginForm: FormGroup;
  sub: any;
  info: string;
  private userRole: string;

  private Notyf = require('notyf');
  private notyf2 = new this.Notyf({
    delay: 5000,
    alertIcon: 'fa fa-exclamation-circle',
    confirmIcon: 'fa fa-check-circle'
  });
  b: boolean;
  wrongData: boolean;
  getPassword: boolean;
  resetFailure: boolean;
  resetSuccess: boolean;
  loader: boolean;
  routedUrl: any = ''
  constructor(
    public route: ActivatedRoute,
    private router: Router,
    private authenticationService: AuthenticationService,
    private titleService: Title
  ) { }
  public setTitle(newTitle: string) {
    this.titleService.setTitle(newTitle);
  }

  ngOnInit() {
    this.routedUrl = localStorage.getItem('routed');
    window.scroll(0, 0);
    this.setTitle('Kakoo Software - Connexion');
    this.loadToken();
    if (this.jwtToken) {
      this.router.navigate(['/user/profile'])
    }
    this.loader = false;
    this.resetSuccess = false;
    this.resetFailure = false;
    this.getPassword = false;
    this.wrongData = false;
    this.b = false;
    this.sub = this.route.params.subscribe(params => {
      this.info = params['info'];
    });
    if (this.info) {
      this.b = true;
    }
    this.loginForm = new FormGroup({
      username: new FormControl('', Validators.required),
      password: new FormControl('', Validators.required)

    })
  }

  loadToken() {
    this.jwtToken = localStorage.getItem('token');
  }

  onLogin(user) {
    this.authenticationService.login(user)
      .subscribe(resp => {
        let jwt = resp.headers.get('authorization');
        this.authenticationService.saveToken(jwt);
        this.authenticationService.getConnectedUser().subscribe(resp => {
          this.userRole = resp.body['roles'][0].role;
          switch (this.userRole) {
            case "SUPERADMIN":
              this.router.navigate(['/user/profile']);
              break;
            case "ADMIN":
              this.router.navigate(['/user/profile']);
              break;
            case "RH":
              this.router.navigate(['/candidate/list']);
              break;
            case 'EMPLOYEE':
              this.router.navigate(['user/profile']);
              break;
            case 'CANDIDATE':
              if (this.routedUrl) {
                this.router.navigate([this.routedUrl])
              } else {
                this.router.navigate(['/user/profile'])
              }
              break;
          }
        });
      },
        error => {
          this.notyf2.alert("Email ou mot de passe incorrect , Réessayez!");
          this.b = false;
          this.wrongData = true;
          this.loginForm.controls.password.reset();
          //console.log('not ok');
        })
  }

  redirectHome() {
    this.router.navigate(['']);
  }
  redirectSignup() {
    this.router.navigate(['/user/signup'])
  }

  setupPassword(email: string) {
    this.authenticationService.setup(email).subscribe(
      resp => {
        this.resetSuccess = true;
        //console.log('reset ok');      
        //console.log(resp);
        this.resetFailure = false;
        this.loader = false;
      },
      err => {
        //console.clear();
        //console.log('reset not ok')
        //console.log(err)
        this.resetFailure = true;
        this.loader = false;
      }
    );



  }

}
