import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';

@Component({
  selector: 'app-rhdeleted',
  templateUrl: './rhdeleted.component.html',
  styleUrls: ['./rhdeleted.component.scss']
})
export class RhdeletedComponent implements OnInit {

  constructor(private route: Router) { }

  ngOnInit() {
  }
  goAllUser(): void {
    this.route.navigate(['company/allusers']);
  }
}
