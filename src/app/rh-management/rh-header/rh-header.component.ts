import { Component, OnInit, EventEmitter, Output } from '@angular/core';
import { Router } from '@angular/router';
import { AuthenticationService } from '../../user/services/authentication.service';
import { environment } from '../../../assets/environments/environment';
import { User } from '../../user/user.model';


@Component({
  selector: 'app-rh-header',
  templateUrl: './rh-header.component.html',
  styleUrls: ['./rh-header.component.scss']
})
export class RhHeaderComponent implements OnInit {
public firstName: string;
  public lastName: string;
  private role: string;
  public imageUrl: string;
  private userId: number;
  private apiUrl = environment.apiUrl;
  public notifs;
  private userRole: string;
  public jwtToken: string;
  public isAdminRole: boolean = false;
  companyName: any;
  isEmployee: boolean = false;
  currentUser;

  @Output() adminRole = new EventEmitter<boolean>();
  //@Output() getCurrentUser = new EventEmitter<User>();
  constructor(private router: Router, private authenticationService: AuthenticationService) { }

  ngOnInit() {
    this.loadToken();
    if (this.jwtToken != null) {
      this.getConnectedUser();
      this.imageUrl = "./assets/home/images/user.png";
      this.notifs = [];
    }
  }
  goRecrutement() {
    this.router.navigate(['quizz/create']);
  }
  disconnect() {
    localStorage.removeItem('token');
    this.router.navigate(['']);

  }
  goProfile() {
    this.router.navigate(['/user/profile']);
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
  isAdmin() {
    if (this.role == 'ADMIN')
      return true;
    else return false;
  }

  goSettings() {
    this.router.navigate(['user/settings']);
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
  getConnectedUser() {
    this.authenticationService.getConnectedUser().toPromise().then(
      resp => { 
        // Success
        this.currentUser = resp.body;
        this.userRole = resp.body['roles'][0].role;
        if (this.userRole == "ADMIN") {
          this.isAdminRole = true;
          this.isEmployee = false
          //console.log("************* yes ***************");
        } else if (this.userRole == "RH") {
          this.isAdminRole = false;
          this.isEmployee = false;
        } else if(this.userRole == 'EMPLOYEE') {
          this.isEmployee = true;
          this.isAdminRole = false;
        }

        this.firstName = resp.body['lastName'];
        this.lastName = resp.body['firstName'];
        this.role = resp.body['roles'][0].role;
        this.userId = resp.body['id'];
        this.companyName = resp.body['company'].name;

        this.getUnseenNotifs();
        if (resp.body['photo']) {
          this.imageUrl = this.apiUrl + "users/" + this.userId + "/downloadPhoto";
        } else {
          this.imageUrl = "./assets/home/images/user.png";
        }
        this.adminRole.emit(this.isAdminRole);
        //this.getCurrentUser.emit(this.currentUser);
      }
    );
     
  }

  loadToken() {
    this.jwtToken = localStorage.getItem('token');
  }

  goRH() {
    this.router.navigate(['rh/list']);
  }

  goClients() {
    this.router.navigate(['client/list']);
  }

  goTasks() {
    this.router.navigate(['task/list']);
  }

  toDasboard() {
    this.router.navigate(['employee/dashboard']);
  }

  goMyTasks(id) {
    if (id) {
       this.router.navigate(['/employee/' + id + '/tasks']);
    } 
   }
}
