import { Component, OnInit } from '@angular/core';
import { AuthenticationService } from '../services/authentication.service';
import { User } from '../user.model';
import { Router } from '@angular/router';
import { HttpClient, HttpResponse, HttpEventType } from '@angular/common/http';
import { environment } from '../../../assets/environments/environment';
import 'notyf/dist/notyf.min.css';

declare var require: any;
declare var $: any;

@Component({
  selector: 'app-user-profile',
  templateUrl: './user-profile.component.html',
  styleUrls: ['./user-profile.component.scss']
})
export class UserProfileComponent implements OnInit {
  private apiUrl = environment.apiUrl;
  private jwtToken = null;
  private userConnect: string;
  public firstName: string;
  public lastName: string;
  private userImage: string;
  public companyName: string;
  public companyAddress: string;
  public role: string;
  public mail: string;
  public phone: string;
  public companyPhone: string;
  private notifs;
  public username: string;
  userId: number;
  public companyType: string;
  private users: User[];
  public imageUrl: string = "./assets/home/images/user.png";
  private imagePath: string;
  selectedFiles: FileList;
  private Notyf = require('notyf');
  private notyf2 = new this.Notyf({
    delay: 4000,
    alertIcon: 'fa fa-exclamation-circle',
    confirmIcon: 'fa fa-check-circle'
  })
  currentFileUpload: File;
  progress: { percentage: number } = { percentage: 0 }





  constructor(private router: Router,
    private authenticationService: AuthenticationService) { }

  ngOnInit() {
    this.loadToken();
    if (!this.jwtToken) {
      this.router.navigate(['']);
    }
    this.getConnectedUser();
  }

  selectFile(event) {
    var reader = new FileReader();
    var fileToUpload = event.target.files.item(0);
    this.selectedFiles = event.target.files;
    if (this.selectedFiles)
      this.upload();
  }

  upload() {
    this.progress.percentage = 0;
    this.currentFileUpload = this.selectedFiles.item(0);
    this.authenticationService.pushFileToStorage(this.currentFileUpload).subscribe(event => {
      if (event.type === HttpEventType.UploadProgress) {

        this.progress.percentage = Math.round(100 * event.loaded / event.total);
        this.imageUrl = this.apiUrl + "users/" + this.userId + "/downloadPhoto";

      } else if (event instanceof HttpResponse) {

        this.imageUrl = this.apiUrl + "users/" + this.userId + "/downloadPhoto";
        this.selectedFiles = undefined;
      }
      progress => {
        if (progress) {
        }
      }
    })
  }
  
  loadToken() {
    this.jwtToken = localStorage.getItem('token');
  }
  
  addnewRhPage() {
    this.router.navigate(['/users/add-user']);
  }
  
  isAdmin() {
    if (this.role == 'ADMIN')
      return true;
    else return false;
  }
  
  isCandidate() {
    if (this.role == 'CANDIDATE')
      return false;
    else return true;
  }

  redirectSettings() {
    this.router.navigate(['/user/settings']);

  }
  
  getNotifs() {
    this.authenticationService.getUnseenNotif(this.userId).subscribe(resp => {
    })
  }

  redirectAllUsers() {
    this.router.navigate(['/company/allusers']);
  } getConnectedUser() {
    this.authenticationService.getConnectedUser().subscribe(
      resp => {
        if (resp.body) {
          this.role = resp.body['roles'][0].role;
          this.userConnect = resp.body['lastName'] + ' ' + resp.body['firstName'];
          this.firstName = resp.body['firstName'];
          this.lastName = resp.body['lastName'];
          this.phone = resp.body['phone'];
          this.mail = resp.body['email'];
          this.username = resp.body['username'];
          this.companyName = resp.body['company'] ? resp.body['company'].name : '';
          this.companyAddress = resp.body['company'] ? resp.body['company'].address : '';
          this.companyType = resp.body['company'] ? resp.body['company'].type : '';
          this.companyPhone = resp.body['company'] ? resp.body['company'].phone : '';
          this.userId = resp.body['id'];
          if (resp.body['photo']) {
            this.imageUrl = this.apiUrl + "users/" + this.userId + "/downloadPhoto";
            this.getNotifs();
          }
          else
            this.imageUrl = "./assets/home/images/user.png";
        }
        else {
          localStorage.removeItem('token');
          this.router.navigate(['']);
        }
      }, err => {
        localStorage.removeItem('token');
        this.router.navigate(['']);

      }
    )
  }
}
