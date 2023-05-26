import { Component, OnInit } from '@angular/core';
import {FormControl, Validators} from "@angular/forms";
import {ActivatedRoute, Router} from "@angular/router";
import {environment} from "../../../assets/environments/environment";
import {Arret} from "../Arret";
import {RhManagementService} from "../rh-management.service";

declare var require: any;

@Component({
  selector: 'app-dashboard-employee',
  templateUrl: './dashboard-employee.component.html',
  styleUrls: ['./dashboard-employee.component.scss']
})
export class DashboardEmployeeComponent implements OnInit {

  public arrets: Arret[];
  public arret: Arret;


  public jwtToken = null;
  public allItems: Arret[];
  advanced: boolean = false;
  public found: boolean = true;
  public apiUrl = environment.apiUrl;
  public sub: any;

  public filter;
  public Notyf = require('notyf');
  public notyf2 = new this.Notyf({
    delay: 4000,
    alertIcon: 'fa fa-exclamation-circle',
    confirmIcon: 'fa fa-check-circle'
  });

  // pager object
  pager: any = {};

  // paged items
  pagedArretItems: Arret[];

  allArrets;
  myFilter = (d: Date): boolean =>{
    const day = d.getDay();
    // Prevent Saturday and Sunday from being selected.
    return day !== 0 && day !== 6;};

  constructor(private route: ActivatedRoute, private router: Router, private rhManagementService: RhManagementService){ }


  ngOnInit(){
    this.getArrets();
  }

  addArrets(){
    //this.router.navigate(['arret/create']);
  }

  getArrets(){
  }

}
