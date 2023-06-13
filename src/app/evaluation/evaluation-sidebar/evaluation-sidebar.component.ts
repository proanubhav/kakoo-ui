import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { AuthenticationService } from '../../user/services/authentication.service';
import { environment } from '../../../assets/environments/environment';

@Component({
  selector: 'app-evaluation-sidebar',
  templateUrl: './evaluation-sidebar.component.html',
  styleUrls: ['./evaluation-sidebar.component.scss']
})
export class EvaluationSidebarComponent implements OnInit {
  
  toggleFlag = false;
  public jwtToken = null;
  private imageUrl;
  private userId;
  private notifs;
  private apiUrl = environment.apiUrl;
  private firstName: string;
  private lastName: string;
  userRole: string;
  isAdminRole: boolean = false;
  isEmployee: boolean = true;
  companyName: any;

  constructor(private router: Router, private authenticationService: AuthenticationService) { }

  ngOnInit() {
    this.notifs = [];
    this.loadToken();
    if (this.jwtToken != null) {
      this.imageUrl = "./assets/home/images/user.png";
      this.getConnectedUser2();

    }
    if (this.jwtToken != null) {
      this.authenticationService.getConnectedUser().subscribe(resp => {
        this.userRole = resp.body['roles'][0].role;
        //console.log("user Role is : " + this.userRole);
        if (this.userRole == "ADMIN") {

          this.isAdminRole = true;
          this.isEmployee = false;
          //console.log("************* yes ***************");
        } else if (this.userRole == "RH") {
          //console.log("************* no ***************");

          this.isEmployee = false;
          this.isAdminRole = false;
        } else if (this.userRole == 'EMPLOYEE') {
          this.isEmployee = true;
          this.isAdminRole = false;
        }
      });
    }
  }
  loadToken() {
    this.jwtToken = localStorage.getItem('token');
  }
  
  checkNotif(notif) {
    //console.log('notif is');
    //console.log(notif['message'])
    window.open(notif['url']);
    //this.router.navigate(['quizz-result/'+notif['url']]);
    this.authenticationService.disableNotif(notif['id']).subscribe(resp => {
      //console.log(resp)
      this.getUnseenNotifs();
    });
  }
  goProfile() {
    this.router.navigate(['/user/profile']);
  }
  goCandidates() {
    this.router.navigate(['/candidate/list']);
  }

  searchCandidate() {
    this.router.navigate(['/candidate/search']);
  }
  viewUsers() {
    this.router.navigate(['/company/allusers']);
  }
  addRh() {
    this.router.navigate(['/users/add-user']);
  }

  goSettings() {
    this.router.navigate(['user/settings']);
  }
  goRecrutement() {
    this.router.navigate(['quizz/create']);
  }
  getConnectedUser2() {
    this.authenticationService.getConnectedUser().subscribe(
      resp => {
        if (resp.body) {
          this.firstName = resp.body['firstName'];
          this.lastName = resp.body['lastName'];
          this.userId = resp.body['id'];
          this.companyName = resp.body['company'].name;

          this.getUnseenNotifs();
        }
        if (resp.body['photo']) {
          this.imageUrl = this.apiUrl + "users/" + this.userId + "/downloadPhoto";
          //console.log(this.imageUrl)
        }
        else
          this.imageUrl = "./assets/home/images/user.png";
      }, err => {
        //do nothing
      }
    )
  }
  getUnseenNotifs() {
    this.authenticationService.getUnseenNotif(this.userId).subscribe(resp => {
      //console.log('notification');
      //console.log(resp)
      this.notifs = resp.body;
      this.notifs.reverse();
      //console.log(this.notifs)
      // this.notyf2.confirm(resp.body[0]['message']);


    })
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
  toggleMenu() {
    this.toggleFlag = !this.toggleFlag
  }
  
  disconnect() {
    localStorage.removeItem('token');
    this.router.navigate(['']);
  }
}
