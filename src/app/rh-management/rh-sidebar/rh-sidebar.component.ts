import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';

@Component({
  selector: 'app-rh-sidebar',
  templateUrl: './rh-sidebar.component.html',
  styleUrls: ['./rh-sidebar.component.scss']
})
export class RhSidebarComponent implements OnInit {
  
  toggleFlag = true;
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
