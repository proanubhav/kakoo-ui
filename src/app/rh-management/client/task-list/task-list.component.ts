import { Component, OnInit } from '@angular/core';
import { FormControl, FormGroup } from "@angular/forms";
import { ILoader, SharedService } from "../../services/shared.service";
import { Task } from "../task";
import { Router } from "@angular/router";
import { AuthenticationService } from "../../../user/services/authentication.service";
import { ClientService } from "../client.service";
import { PagerService } from "../../services/pager.service";
import {Sort} from "@angular/material";
import 'notyf/dist/notyf.min.css';
declare var require: any;

@Component({
  selector: 'app-task-list',
  templateUrl: './task-list.component.html',
  styleUrls: ['./task-list.component.scss']
})
export class TaskListComponent implements OnInit {

  private jwtToken: string;
  public advanced:boolean=false;
  pagedItems: Task[];
  pager: any = {};
  searchForm: FormGroup;
  search: string;
  loader: ILoader;
  selectAllTasks = false;

  public task: Task;
  public tasks: Task[];
  public allTasks;
  public allItems: Task[];
  public noTasks: boolean = false;
  public filter;
  private Notyf = require('notyf');
  private notyf2 = new this.Notyf({
      delay: 4000,
      alertIcon: 'fa fa-exclamation-circle',
      confirmIcon: 'fa fa-check-circle'
  });
  constructor(
    private router: Router,
    private sharedService: SharedService,
    private authenticationService: AuthenticationService,
    private clientService: ClientService,
    private pagerService: PagerService
  ) {
    this.loader = this.sharedService.loader;
  }

  ngOnInit() {
    this.loadToken();
    if(!this.jwtToken) {
      this.router.navigate(['']);
    }
    this.sharedService.showLoader();
    this.getConnectedUser();

    this.searchForm = new FormGroup({ searchItem: new FormControl() });
  }

  loadToken() {
    this.jwtToken = localStorage.getItem('token');
  }

  getConnectedUser() {
    this.authenticationService.getConnectedUser().subscribe(
      resp => {
        if(resp)
          this.getTasks();
      }, err => {
        this.router.navigate(['user/login']);
      }
    );
  }

  getTasks() {
    this.clientService.getAllTasks().subscribe(
      tasks => {
        //console.log(tasks);
        this.allTasks = tasks;
        this.allItems = [];
        if(this.allTasks) {
          this.allTasks.reverse();
          for(let task of this.allTasks)
            this.allItems.push(task);
        }
        this.setPage(1);
      }, err => {
      }, () => {
        this.sharedService.hideLoader();
      }
    );
  }

  setPage(page: number) {
    if(page < 1 || page > this.pager.totalPages)
      return;

    if(this.allItems && this.allItems.length != 0) {
      this.pager = this.pagerService.getPager(this.allItems.length, page);
      this.pagedItems = this.allItems.slice(this.pager.startIndex, this.pager.endIndex + 1);
    }else {
      this.noTasks = true;
    }
  }

  sendSearch() {

  }

  sortData(sort: Sort){}

  onFilterChange(task: Task) {
    task.selected = !task.selected;
    if(!task.selected)
      this.selectAllTasks = false;
  }

  redirectNewTaskPage() {
    this.router.navigate(['client/assign-task']);
  }

  deleteTask(task: Task) {
    if (task) {
      this.clientService.deleteTaskById(task.id).subscribe(
        res => {
          this.getTasks();
          this.notyf2.confirm('Misson supprimée avec succès');
        }, err => {
          //console.log(err);
          this.notyf2.alert('Error');
        }
      );
    }
  }

  editTask(task: Task) {
    if (task) {
        this.router.navigate(['/tasks/edit/' + task.id ]);
    }
}
}
