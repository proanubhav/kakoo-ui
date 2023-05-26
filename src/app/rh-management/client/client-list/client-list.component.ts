import { Component, OnInit } from '@angular/core';
import { FormControl, FormGroup } from "@angular/forms";
import { environment } from "../../../../assets/environments/environment";
import { ILoader, SharedService } from "../../services/shared.service";
import { ClientService } from "../client.service";
import { Router } from "@angular/router";
import { PagerService } from "../../services/pager.service";
import { AuthenticationService } from "../../../user/services/authentication.service";
import { Client } from "../client";
import { Sort } from "@angular/material";

declare var require: any;

@Component({
  selector: 'app-client-list',
  templateUrl: './client-list.component.html',
  styleUrls: ['./client-list.component.scss']
})
export class ClientListComponent implements OnInit {
  public advanced: boolean = false;
  private apiUrl = environment.apiUrl;
  private jwtToken: string;
  private Notyf = require('notyf');
  private notyf2 = new this.Notyf({
    delay: 4000,
    alertIcon: 'fa fa-exclamation-circle',
    confirmIcon: 'fa fa-check-circle'
  });
  private isConnected: boolean = false;

  public client: Client;
  public clients: Client[];
  public allClients;
  public allItems: Client[];
  public filter;
  public noClients: boolean = false;

  pagedItems: Client[];
  pager: any = {};
  searchForm: FormGroup;
  search: string;
  loader: ILoader;
  selectAllClient = false;

  constructor(
    private clientService: ClientService,
    private authenticationService: AuthenticationService,
    private router: Router,
    private pagerService: PagerService,
    private sharedService: SharedService
  ) {
    this.loader = this.sharedService.loader;
  }

  ngOnInit() {

    this.loadToken();
    if (!this.jwtToken) {
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
        if (resp)
          this.getClients();
      }, err => {
        this.router.navigate(['user/login']);
      }
    );
  }

  setPage(page: number) {
    if (page < 1 || page > this.pager.totalPages)
      return;

    if (this.allItems && this.allItems.length != 0) {
      this.pager = this.pagerService.getPager(this.allItems.length, page);
      this.pagedItems = this.allItems.slice(this.pager.startIndex, this.pager.endIndex + 1);
    } else {
      this.noClients = true;
    }
  }

  getClients() {
    this.clientService.getAllClients().subscribe(
      clients => {
        //console.log(clients);
        this.allClients = clients;
        this.allItems = [];
        if (this.allClients) {
          this.allClients.reverse();
          for (let client of this.allClients) {
            this.getClientPic(client);
            this.allItems.push(client);
          }
        }
        this.setPage(1);
      }, err => {
      }, () => {
        this.sharedService.hideLoader();
      }
    );
  }

  getClientPic(client: Client) {
    if (client.photo)
      client.photoUrl = this.apiUrl + 'clients/' + client.id + '/downloadPhoto';
  }

  sendSearch() {

  }

  redirectNewClientPage() {
    this.router.navigate(['/client/create']);
  }

  sortData(sort: Sort) {

  }

  selectAll() {
    this.selectAllClient = !this.selectAllClient;
    this.filter = this.selectAllClient;
    for (let item of this.allItems)
      item.selected = this.selectAllClient;
  }

  onFilterChange(client: Client) {
    client.selected = !client.selected;
    if (!client.selected)
      this.selectAllClient = false;
  }

  displayClientContact(client: Client) {
    this.router.navigate(['client/contact/' + client.id]);
  }

  editClientPage(client: Client) {
    if (client)
      this.router.navigate(['client/edit/' + client.id])
  }


  deleteClient(client: Client) {
    if (client) {
      this.clientService.deleteClientById(client.id).subscribe(
        resp => {
          this.getClients();
          this.notyf2.confirm('Client supprimé avec succès.')
        }, err => {
          this.notyf2.alert('Error');
        }
      );
    }
  }

}
