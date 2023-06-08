import { Component, OnInit } from '@angular/core';

@Component({
  selector: 'app-rh-sidebar',
  templateUrl: './rh-sidebar.component.html',
  styleUrls: ['./rh-sidebar.component.scss']
})
export class RhSidebarComponent implements OnInit {
  
  toggleFlag = true;
  constructor() { }

  ngOnInit() {

  }
  toggleMenu() {
    this.toggleFlag = !this.toggleFlag
  }
}
