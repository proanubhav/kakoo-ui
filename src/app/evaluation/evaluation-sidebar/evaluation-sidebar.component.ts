import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';

@Component({
  selector: 'app-evaluation-sidebar',
  templateUrl: './evaluation-sidebar.component.html',
  styleUrls: ['./evaluation-sidebar.component.scss']
})
export class EvaluationSidebarComponent implements OnInit {
  
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
