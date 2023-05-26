import { Component, OnInit } from '@angular/core';
import { Location } from '@angular/common';
import { Router } from '@angular/router';


@Component({
  selector: 'app-notfound',
  templateUrl: './notfound.component.html',
  styleUrls: ['./notfound.component.scss']
})
export class NotfoundComponent implements OnInit {

  constructor(private _location: Location, private router: Router) { }

  ngOnInit() {
    // scoll to top
    window.scroll(0, 0);
  }
  backClicked() {
    this._location.back();
    // this._location.back();
  }
  backHome() {
    this.router.navigate(['']);
  }

}
