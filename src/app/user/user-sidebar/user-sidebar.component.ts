import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { AuthenticationService } from '../services/authentication.service';
import { environment } from '../../../assets/environments/environment';
import { CandidateService } from '../../candidate/candidate.service';

@Component({
  selector: 'app-user-sidebar',
  templateUrl: './user-sidebar.component.html',
  styleUrls: ['./user-sidebar.component.scss']
})
export class UserSidebarComponent implements OnInit {
  public jwtToken = null;
  private userId: number;
  private imageUrl: string;
  private apiUrl = environment.apiUrl;
  private firstName: string;
  private lastName: string;
  private notifs;
  private A;
  public companyName: string;

  isAdmin: boolean = false;
  isEmployee: boolean = true;
  isCandidate: boolean = false;
  userRole: any;

  toggleFlag = false;
  constructor(private router: Router, private authenticationService: AuthenticationService, private candidateService: CandidateService,) { }

  ngOnInit() {
    this.notifs = [];
    this.loadToken();
    if (this.jwtToken != null) {
      this.imageUrl = "./assets/home/images/user.png";

      this.getConnectedUser2();
      this.A = ['TEST', 'TEST'];
    }

  }

  loadToken() {
    this.jwtToken = localStorage.getItem('token');
  }

  candidateUuid: any = '';
  getConnectedUser2() {
    this.authenticationService.getConnectedUser().subscribe(
      resp => {
        if (resp.body) {
          // this.candidateUuid = resp.body['candidateId'];
          this.candidateUuid = 1034734452;
          this.userRole = resp.body['roles'][0].role;
          if (this.userRole == "ADMIN") {
            this.isAdmin = true;
            this.isEmployee = false
          } else if (this.userRole == "RH") {
            this.isAdmin = false;
            this.isEmployee = false;
          } else if (this.userRole == 'EMPLOYEE') {
            this.isEmployee = true;
            this.isAdmin = false;
          } else if (this.userRole == 'CANDIDATE') {
            this.isEmployee = false;
            this.isAdmin = false;
            this.isCandidate = true;
          }
          this.firstName = resp.body['firstName'];
          this.lastName = resp.body['lastName'];
          this.userId = resp.body['id'];
          this.companyName = resp.body['company'] ? resp.body['company'].name : '';
          this.getUnseenNotifs();

        }
        if (resp.body['photo']) {
          this.imageUrl = this.apiUrl + "users/" + this.userId + "/downloadPhoto";
          //console.log(this.imageUrl)
        } else
          this.imageUrl = "./assets/home/images/user.png";
      }, err => {
        //do nothing
      }
    )
  }
  
  dispReports() {
    if (this.candidateUuid) {
      //console.log("uuid form get candidate is " + can.uuid);
      this.candidateService.findByUuid(this.candidateUuid).subscribe(
        res => {
          let token = res.body['convocationToken'];
          let url = "candidate/reports/" + this.candidateUuid;
          this.router.navigate([url]);
        }
      );
    }
  }

  getUnseenNotifs() {
    this.authenticationService.getUnseenNotif(this.userId).subscribe(resp => {
      this.notifs = resp.body;
      this.notifs.reverse();
    })
  }

  checkNotif(notif) {
    window.open(notif['url']);
    this.authenticationService.disableNotif(notif['id']).subscribe(resp => {
      this.getUnseenNotifs();
    });
  }

  goMyTasks(id) {
    if (id) {
      this.router.navigate(['/employee/' + id + '/tasks']);
    }
  }

  toggleMenu() {
    this.toggleFlag = !this.toggleFlag
  }

  disconnect() {
    localStorage.removeItem('token');
    this.router.navigate(['']);
  }
}
