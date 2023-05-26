import { Component, OnInit } from '@angular/core';
import {FormControl, FormGroup, Validators} from "@angular/forms";
import {ActivatedRoute, Router} from "@angular/router";
import {Client} from '../client';
import {ClientService} from "../client.service";

declare var require: any;

@Component({
  selector: 'app-client-create',
  templateUrl: './client-create.component.html',
  styleUrls: ['./client-create.component.scss']
})
export class ClientCreateComponent implements OnInit {

  clientForm: FormGroup;
  client: Client;
  id: number;
  clientId: number;
  editing = false;
  loader: boolean;

  private jwtToken = null;
  private sub: any;
  private Notyf = require('notyf');
  private notyf2 = new this.Notyf({
    delay: 4000,
    alertIcon: 'fa fa-exclamation-circle',
    confirmIcon: 'fa fa-check-circle'
  });

  constructor(
    public route: ActivatedRoute,
    private router: Router,
    private clientService: ClientService
  ) { }

  ngOnInit() {
    this.loader = false;
    this.loadToken();
    if(!this.jwtToken)
      this.router.navigate(['']);

    this.sub = this.route.params.subscribe(
      params => {
        this.id = params['id'];
      }
    );

    this.clientForm = new FormGroup(
      {
        name: new FormControl('', Validators.required),
        activityArea: new FormControl('', Validators.required),
        state: new FormControl('', Validators.required),
        phone: new FormControl('', Validators.required),
        webSite: new FormControl('', Validators.required),
        email: new FormControl('', [Validators.required, Validators.pattern("[^ @]*@[^ @]*") ]),
        locality: new FormControl('', Validators.required),
        description: new FormControl('')
      }
    );

    if(this.id) {
      this.editing = true;

      this.clientService.findClientById(this.id).subscribe(
        resp => {
          this.clientId = resp.body['id'];

          this.clientForm.patchValue(
            {
              name: resp.body['name'],
              activityArea: resp.body['activityArea'],
              state: resp.body['state'],
              phone: resp.body['phone'],
              webSite: resp.body['webSite'],
              email: resp.body['email'],
              locality: resp.body['locality'],
              description: resp.body['description']
            }
          );
        }
      );
    }
  }

  loadToken() {
    this.jwtToken = localStorage.getItem('token');
  }

  onSubmit() {
    if(this.clientForm.valid) {
      this.loader = true;
      if(this.clientId) {
        let client: Client = new Client(
          this.clientId,
          this.clientForm.controls['name'].value,
          this.clientForm.controls['activityArea'].value,
          this.clientForm.controls['description'].value,
          this.clientForm.controls['state'].value,
          this.clientForm.controls['webSite'].value,
          this.clientForm.controls['phone'].value,
          this.clientForm.controls['email'].value,
          this.clientForm.controls['locality'].value
        );

        this.clientService.updateClient(client).subscribe(
          resp => {
            this.loader = false;
            this.notyf2.confirm('Client modifié avec succès');
            this.redirectClientList();
          }, err => {
            this.loader = false;
            this.notyf2.alert('Echec de modification du client , vous avez des champs invalide');
          }
        );
      } else {
        let client: Client = new Client(
          0,
          this.clientForm.controls['name'].value,
          this.clientForm.controls['activityArea'].value,
          this.clientForm.controls['description'].value,
          this.clientForm.controls['state'].value,
          this.clientForm.controls['webSite'].value,
          this.clientForm.controls['phone'].value,
          this.clientForm.controls['email'].value,
          this.clientForm.controls['locality'].value
        );

        this.clientService.saveClient(client).subscribe(
          resp => {
            this.loader = false;
            this.notyf2.confirm('Nouveau client ajouté');
            this.redirectClientList();
          }, err => {
            this.loader = false;
            this.notyf2.alert('Echec de création du client , vous avez des champs invalides');
          }
        );
      }
    }
  }

  redirectClientList() {
    this.router.navigate(['client/list']);
  }

  cancelOperation() {
    this.router.navigate(['client/list']);
  }

}
