import { Component, OnInit } from '@angular/core';
import {environment} from "../../../../assets/environments/environment";
import {ActivatedRoute, Router} from "@angular/router";
import {ClientService} from "../client.service";
import {Client} from "../client";
import {HttpEventType, HttpResponse} from "@angular/common/http";
import {ContactClient} from "../contact-client";
import {PagerService} from "../../services/pager.service";
import {ILoader, SharedService} from "../../services/shared.service";
import {AuthenticationService} from "../../../user/services/authentication.service";

declare var require: any;

@Component({
  selector: 'app-client-contact',
  templateUrl: './client-contact.component.html',
  styleUrls: ['./client-contact.component.scss']
})
export class ClientContactComponent implements OnInit {

  private apiUrl = environment.apiUrl;
  private jwtToken = null;
  private sub: any;
  private Notyf = require('notyf');
  private notyf2 = new this.Notyf(
    {
      delay: 4000,
      alertIcon: 'fa fa-exclamation-circle',
      confirmIcon: 'fa fa-check-circle'
    }
  );

  id: number;
  pagedItems: ContactClient[];
  allContacts;
  pager: any = {};
  selectedFiles: FileList;
  currentFileUpload: File;
  progress: { percentage: number } = { percentage: 0 };
  loader: ILoader;
  deleteImg: string;

  public client: Client;
  public allItems: ContactClient[];
  public imgSrc: string;
  public name: string;
  public activityArea: string;
  public deleteClientConfirm: boolean;

  constructor(
    private router: Router,
    public route: ActivatedRoute,
    private authenticationService: AuthenticationService,
    private clientService: ClientService,
    private pagerService: PagerService,
    private sharedService: SharedService
  ) {
    this.loader = this.sharedService.loader;
  }

  ngOnInit() {

    this.deleteImg = "assets/home/images/delete.png";

    this.loadToken();
    if(!this.jwtToken)
      this.router.navigate(['']);
    this.sharedService.showLoader();

    this.sub = this.route.params.subscribe(
      params => {
        //console.log(params);
        this.id = params['id'];
      }
    );

    if(this.id) {
      //console.log(this.id);
      this.getClient(this.id);
    }

    this.getConnectedUser();

    this.imgSrc = "assets/home/images/loading.gif";
  }

  loadToken() {
    this.jwtToken = localStorage.getItem('token');
  }

  getClientContacts(clientId: number) {
    this.clientService.getAllClientContacts(clientId).subscribe(
      contacts => {
        //console.log(contacts);
        this.allContacts = contacts;
        this.allItems = [];
        if(this.allContacts) {
          this.allContacts.reverse();
          for(let contact of this.allContacts)
            this.allItems.push(contact);
        }
        this.setPage(1);
      }, err => {
        //console.log(err);
      }, () => {
        this.sharedService.hideLoader();
      }
    );
  }

  setPage(page: number) {
    if(page < 1 || page > this.pager.totalPages)
      return;

    if (this.allItems && this.allItems.length != 0) {
      this.pager = this.pagerService.getPager(this.allItems.length, page);

      this.pagedItems = this.allItems.slice(this.pager.startIndex, this.pager.endIndex + 1);
    }
  }

  getConnectedUser() {
    this.authenticationService.getConnectedUser().subscribe(
      resp => {
        if(resp)
          this.getClientContacts(this.id);
      }
    );
  }

  selectFile(event) {
    this.selectedFiles = event.target.files;
    if(this.selectedFiles.item(0))
      this.upload();
  }

  upload() {
    this.progress.percentage = 0;
    this.currentFileUpload = this.selectedFiles.item(0 );
    this.clientService.pushFileToStorage(this.currentFileUpload, this.client.id).subscribe(
      event => {
        if(event.type === HttpEventType.UploadProgress) {
          this.progress.percentage = Math.round(100 * event.loaded / event.total);
          this.imgSrc = this.apiUrl + "clients/" + this.client.id + "/downloadPhoto";
        }else if(event instanceof HttpResponse) {
          this.imgSrc = this.apiUrl + "clients/" + this.client.id + "/downloadPhoto";
          this.selectedFiles = undefined;
        }
      }, progress => {
        //console.log(progress);
      }
    );
  }

  getClient(idClient: number) {
    if(idClient) {
      this.clientService.findClientById(idClient).subscribe(
        resp => {
          //console.log(resp);
          if(resp.body) {
            this.client = new Client(
              resp.body['id'],
              resp.body['name'],
              resp.body['activityArea'],
              resp.body['description'],
              resp.body['state'],
              resp.body['webSite'],
              resp.body['phone'],
              resp.body['email'],
              resp.body['locality']
            );

            this.name = resp.body['name'];
            this.activityArea = resp.body['activityArea'];

            if(resp.body['photo'])
              this.imgSrc = this.apiUrl + 'clients/' + idClient + '/downloadPhoto';
            else
              this.imgSrc = "assets/home/images/logo-default.png";
          }else {
            this.router.navigate(['client/notFound']);
          }
        }
      );
    }
  }

  redirectEditPageClient(client: Client) {
    if(client)
      this.router.navigate(['client/edit/' + client.id]);
  }

  redirectNewContact(client: Client) {
    this.router.navigate(['contact/client/create/' + client.id]);
  }

  deleteClient(client: Client) {
    if(client) {
      this.clientService.deleteClientById(client.id).subscribe(
        resp => {
          this.notyf2.confirm('Client supprimer avec succès.');
          this.router.navigate(['client/list']);
        }
      );
    }
  }

  redirectEditPageContact(contactId: number) {
    this.router.navigate(['contact/client/edit/' + contactId]);
  }

  redirectNewTask(contactId: number) {
    this.router.navigate(['client/assign-task/' + contactId]);
  }

  deleteContact(contactId: number) {
    if(contactId) {
      this.clientService.deleteClientContactById(contactId).subscribe(
        resp => {
          this.getClientContacts(this.id);
          this.notyf2.confirm('Contact supprimer avec succès.');
        }
      );
    }
  }
}
