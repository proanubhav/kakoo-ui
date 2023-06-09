import { Component, OnInit } from '@angular/core';

@Component({
  selector: 'app-evaluation-sidebar',
  templateUrl: './evaluation-sidebar.component.html',
  styleUrls: ['./evaluation-sidebar.component.scss']
})
export class EvaluationSidebarComponent implements OnInit {
  
  toggleFlag = false;
  constructor() { }

  ngOnInit() {

  }
  toggleMenu() {
    this.toggleFlag = !this.toggleFlag
  }
}
