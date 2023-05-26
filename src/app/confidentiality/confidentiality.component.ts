import { Component, OnInit } from '@angular/core';

@Component({
  selector: 'app-confidentiality',
  templateUrl: './confidentiality.component.html',
  styleUrls: ['./confidentiality.component.scss']
})
export class ConfidentialityComponent implements OnInit {

  conntectedUser: boolean = false;
  constructor() { }

  ngOnInit() {
    // scoll to top
    window.scroll(0, 0);
  }

}
