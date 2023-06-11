import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';

@Component({
  selector: 'app-user-sidebar',
  templateUrl: './user-sidebar.component.html',
  styleUrls: ['./user-sidebar.component.scss']
})
export class UserSidebarComponent implements OnInit {
  
  toggleFlag = false;
  constructor(private router: Router) { }

  ngOnInit() {

  }
  toggleMenu() {
    this.toggleFlag = !this.toggleFlag
  }
  
  disconnect() {
    localStorage.removeItem('token');
    this.router.navigate(['']);
  }
}
