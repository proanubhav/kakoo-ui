import { Component, OnInit } from '@angular/core';
import { AuthenticationService } from '../services/authentication.service';
import { User } from '../user.model';
import { Router } from '@angular/router';
import 'rxjs/add/operator/map';
import { NgbModal, ModalDismissReasons } from '@ng-bootstrap/ng-bootstrap';
import * as _ from 'underscore';
import { PagerService } from '../../candidate/services/pager.service';
declare var require: any;
declare var $: any;

@Component({
  selector: 'app-company-users',
  templateUrl: './company-users.component.html',
  styleUrls: ['./company-users.component.scss']
})
export class CompanyUsersComponent implements OnInit {
  private jwtToken = null;
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
  private closeResult: string;
  allUsers: any = [];

  private Notyf = require('notyf');
  private notyf2 = new this.Notyf({
    delay: 4000,
    alertIcon: 'fa fa-exclamation-circle',
    confirmIcon: 'fa fa-check-circle'
  })
  private allItems;
  // pager object
  pager: any = {};

  // paged items
  pagedItems: any[];

  //private users:User[];

  constructor(private router: Router, private pagerService: PagerService,
    private authenticationService: AuthenticationService, private modalService: NgbModal) { }

  ngOnInit() {
    this.loadToken();
    if (!this.jwtToken) {
      this.router.navigate(['']);
    }
    this.getConnectedUser();
    this.getCompanyUsers();
  }
  loadToken() {
    this.jwtToken = localStorage.getItem('token');
  }
  addnewRhPage() {
    this.router.navigate(['/users/add-user']);
  }
  redirectProfile() {
    this.router.navigate(['user/profile']);
  }
  isAdmin() {
    return this.role == 'ADMIN';
  }

  editUser(user) {
    console.log('user UUID', user.id)
    this.router.navigate(['/users/add-user']);
  }

  setPage(page: number) {
    if (page < 1 || page > this.pager.totalPages) {
      return;
    }
    // get pager object from service
    this.pager = this.pagerService.getPager(this.allItems.length, page);

    // get current page of items
    this.pagedItems = this.allUsers.slice(this.pager.startIndex, this.pager.endIndex + 1);
  }
  getCompanyUsers() {
    this.authenticationService.getCompanyUsers().subscribe(
      users => {
        let userArray: any = [];
        userArray = users;
        userArray.forEach((elem: any) => {
          // if (elem.enabled) {
            this.allUsers.push(elem);
          // }
        });
        this.allItems = users;
        this.allItems.reverse();
        for (let u of this.allItems) {
        }
        this.setPage(1);
      }
    );
  }
  // activatedAccount(data) {
  //   if (data.enabled)
  //     return 'Oui';
  //   else return 'Non';
  // }
  redirectSettings() {
    this.router.navigate(['user/settings']);
  }
  getConnectedUser() {
    this.authenticationService.getConnectedUser().subscribe(
      resp => {
        //
        if (resp) {
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
  deleteRH(user: User): void {
    this.authenticationService.deleteRh(user).subscribe(

      resp => {
        this.notyf2.confirm('rh ' + user.lastName + ' supprimé');
        this.getCompanyUsers();
        //console.log("must delete and refresh");
      },
      err => {

        this.notyf2.alert('rh ' + user.lastName + ' non supprimé, Réessayez');
      }
    );
  }

  activeUser(eve: any, user: User) {
    if (eve.target.checked) {
      this.authenticationService.activateUser(user).subscribe(
        resp => {
          this.notyf2.confirm(resp);
          this.getCompanyUsers();
        },
        err => {
          this.notyf2.alert(err);
        }
      );
    }
  }

  userInfo: any;
  viewUser(content, user) {
    this.userInfo = user;
    console.log('user info', this.userInfo)
    this.modalService.open(content, { size: 'lg' }).result.then((result) => {

    }, (reason) => {
      this.closeResult = `Dismissed ${this.getDismissReason(reason)}`;
    });
  }

  private getDismissReason(reason: any): string {
    if (reason === ModalDismissReasons.ESC) {
      return 'by pressing ESC';
    } else if (reason === ModalDismissReasons.BACKDROP_CLICK) {
      return 'by clicking on a backdrop';
    } else {
      return `with: ${reason}`;
    }
  }

}
