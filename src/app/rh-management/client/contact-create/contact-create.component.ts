import { Component, OnInit } from '@angular/core';
import {FormControl, FormGroup, Validators} from "@angular/forms";
import {ContactClient} from "../contact-client";
import {ActivatedRoute, Router} from "@angular/router";
import {ClientService} from "../client.service";
import {Client} from "../client";

declare var require: any;

@Component({
  selector: 'app-contact-create',
  templateUrl: './contact-create.component.html',
  styleUrls: ['./contact-create.component.scss']
})
export class ContactCreateComponent implements OnInit {

  contactForm: FormGroup;
  id: number;
  contactId: number;
  client: Client;
  uClient: Client;
  editing: boolean = false;
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
    private router: Router,
    public route: ActivatedRoute,
    private clientService: ClientService
  ) { }

  ngOnInit() {
    this.loader = false;
    this.loadToken();
    if(!this.jwtToken)
      this.router.navigate(['']);

    this.sub = this.route.params.subscribe(
      params => {
        console.log(params);
        this.id = params['id'];
        this.contactId = params['contactId'];
      }
    );

    this.contactForm = new FormGroup(
      {
        civility: new FormControl('', Validators.required),
        firstName: new FormControl('', Validators.required),
        lastName: new FormControl('', Validators.required),
        poste: new FormControl('', Validators.required),
        service: new FormControl('', Validators.required),
        state: new FormControl('', Validators.required),
        email: new FormControl('', [Validators.required, Validators.pattern("[^ @]*@[^ @]*") ]),
        phone: new FormControl('', Validators.required),
        address: new FormControl('', Validators.required),
        postalCode: new FormControl('', Validators.required),
        city: new FormControl('', Validators.required),
        country: new FormControl('', Validators.required)
      }
    );

    if(this.contactId) {
      this.editing = true;

      this.clientService.findClientContactById(this.contactId).subscribe(
        resp => {
          this.uClient = resp.body['client'];
          this.contactForm.patchValue(
            {
              civility: resp.body['gender'],
              firstName: resp.body['firstName'],
              lastName: resp.body['lastName'],
              poste: resp.body['poste'],
              service: resp.body['service'],
              state: resp.body['state'],
              email: resp.body['email'],
              phone: resp.body['phone'],
              address: resp.body['address'],
              postalCode: resp.body['postalCode'],
              city: resp.body['city'],
              country: resp.body['country']
            }
          );
        }
      );
    }

    if(this.id)
      this.getClient(this.id);
  }

  loadToken() {
    this.jwtToken = localStorage.getItem('token');
  }

  onSubmit() {
    this.loader = true;

    if(this.contactForm.valid) {
      if(this.contactId) {
        let contact = new ContactClient(
          this.contactId,
          this.contactForm.controls['firstName'].value,
          this.contactForm.controls['lastName'].value,
          this.contactForm.controls['civility'].value,
          this.contactForm.controls['poste'].value,
          this.contactForm.controls['service'].value,
          this.contactForm.controls['state'].value,
          this.contactForm.controls['email'].value,
          this.contactForm.controls['phone'].value,
          this.contactForm.controls['address'].value,
          this.contactForm.controls['postalCode'].value,
          this.contactForm.controls['city'].value,
          this.contactForm.controls['country'].value,
          this.uClient
        );

        this.clientService.updateClientContact(contact).subscribe(
          res => {
            this.loader = false;
            this.notyf2.confirm('Contact modifier avec succès.');
            this.redirectClientContact();
          }, err => {
            this.loader = false;
            this.notyf2.alert('Echec de modification du contact , vous avez des champs invalide');
          }
        );
      }else {
        let contact = new ContactClient(
          0,
          this.contactForm.controls['firstName'].value,
          this.contactForm.controls['lastName'].value,
          this.contactForm.controls['civility'].value,
          this.contactForm.controls['poste'].value,
          this.contactForm.controls['service'].value,
          this.contactForm.controls['state'].value,
          this.contactForm.controls['email'].value,
          this.contactForm.controls['phone'].value,
          this.contactForm.controls['address'].value,
          this.contactForm.controls['postalCode'].value,
          this.contactForm.controls['city'].value,
          this.contactForm.controls['country'].value,
          this.client
        );

        this.clientService.saveClientContact(contact).subscribe(
          resp => {
            this.loader = false;
            this.notyf2.confirm('Nouveau contact ajouté');
            this.redirectClientContact();
          }, err => {
            this.loader = false;
            this.notyf2.alert('Echec de création du contact , vous avez des champs invalides');
          }
        );
      }
    }
  }

  redirectClientContact() {
    if(this.id)
      this.router.navigate(['client/contact/' + this.id]);
    else
      this.router.navigate(['client/list']);
  }

  cancelOperation() {
    if(this.id)
      this.router.navigate(['client/contact/' + this.id]);
    else
      this.router.navigate(['client/list']);
  }

  getClient(id: number) {
    this.clientService.findClientById(id).subscribe(
      resp => {
        //console.log(resp);
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
      }, err => {
        console.log(err);
      }
    );
  }

}
