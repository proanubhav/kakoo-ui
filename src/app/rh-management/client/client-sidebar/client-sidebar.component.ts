import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { environment } from "../../../../assets/environments/environment";
import { AuthenticationService } from "../../../user/services/authentication.service";

@Component({
  selector: 'app-client-sidebar',
  templateUrl: './client-sidebar.component.html',
  styleUrls: ['./client-sidebar.component.scss']
})
export class ClientSidebarComponent implements OnInit {

  toggleFlag = true;

  private apiUrl = environment.apiUrl;
  public jwtToken: string;
  private userId: number;
  private role: string;
  private userRole: string;

  public notifs;
  public imgUrl: string;
  public firstName: string;
  public lastName: string;
  public isAdmin: boolean = false;
  public isEmployee: boolean = true;

  constructor(private authenticationService: AuthenticationService, private router: Router) { }

  ngOnInit() {

    this.loadToken();
    this.getConnectedUser();

    this.imgUrl = './assets/home/images/user.png';
    this.notifs = [];

    if (this.jwtToken != null) {
      this.authenticationService.getConnectedUser().subscribe(
        resp => {
          this.userRole = resp.body['roles'][0].role;
          if (this.userRole == "ADMIN") {
            this.isAdmin = true;
            this.isEmployee = false
            //console.log("************* yes ***************");
          } else if (this.userRole == "RH") {
            this.isAdmin = false;
            this.isEmployee = false;
          } else if (this.userRole == 'EMPLOYEE') {
            this.isEmployee = true;
            this.isAdmin = false;
          }
        }
      );
    }
  }

  loadToken() {
    this.jwtToken = localStorage.getItem('token');
  }

  getConnectedUser() {
    this.authenticationService.getConnectedUser().subscribe(
      resp => {
        this.userId = resp.body['id'];
        this.role = resp.body['roles'][0].role;
        this.firstName = resp.body['firstName'];
        this.lastName = resp.body['lastName'];

        this.getUnseenNotifs();

        if (resp.body['photo'])
          this.imgUrl = this.apiUrl + 'users/' + this.userId + '/downloadPhoto';
        else
          this.imgUrl = './assets/home/images/user.png';
      }
    );
  }

  getUnseenNotifs() {
    this.authenticationService.getUnseenNotif(this.userId).subscribe(
      resp => {
        this.notifs = resp.body;
        this.notifs.reverse();
      }
    );
  }

  checkNotifs(notif) {
    window.open(notif['url']);

    this.authenticationService.disableNotif(notif['id']).subscribe(
      resp => {
        this.getUnseenNotifs();
      }
    );
  }

  viewUsers() {
    this.router.navigate(['/company/allusers']);
  }

  goCandidates() {
    this.router.navigate(['/candidate/list'])
  }

  goRecruitment() {
    this.router.navigate(['quizz/create']);
  }

  goRH() {
    this.router.navigate(['rh/list']);
  }

  goClients() {
    this.router.navigate(['client/list'])
  }

  goTasks() {
    this.router.navigate(['task/list']);
  }

  goProfile() {
    this.router.navigate(['/user/profile']);
  }

  goSettings() {
    this.router.navigate(['user/settings']);
  }
  toggleMenu() {
    this.toggleFlag = !this.toggleFlag
  }

  disconnect() {
    localStorage.removeItem('token');
    this.router.navigate(['']);
  }
}
