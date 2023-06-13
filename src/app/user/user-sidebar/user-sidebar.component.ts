import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { AuthenticationService } from '../services/authentication.service';
import { environment } from '../../../assets/environments/environment';

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
  userRole: any;

  toggleFlag = false;
  constructor(private router: Router, private authenticationService: AuthenticationService) { }

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

  getConnectedUser2() {
    this.authenticationService.getConnectedUser().subscribe(
      resp => {
        if (resp.body) {
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
          this.firstName = resp.body['firstName'];
          this.lastName = resp.body['lastName'];
          this.userId = resp.body['id'];
          this.companyName = resp.body['company'].name;
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
