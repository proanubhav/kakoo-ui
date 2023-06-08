import { Component, OnInit } from '@angular/core';

@Component({
  selector: 'app-candidate-sidebar',
  templateUrl: './candidate-sidebar.component.html',
  styleUrls: ['./candidate-sidebar.component.scss']
})
export class CandidateSidebarComponent implements OnInit {

  toggleFlag = false;
  constructor() { }

  ngOnInit() {

  }
  toggleMenu() {
    this.toggleFlag = !this.toggleFlag
  }
}
