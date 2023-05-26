import { Component, OnInit, Inject, Renderer2 } from '@angular/core';
import { AuthenticationService } from '../services/authentication.service';
import { PaymentService } from '../services/payment.service';
import { NotificationsService } from 'angular4-notify';
import { MyCharge } from './models/charge.model';
import { MatDialogRef, MAT_DIALOG_DATA } from '@angular/material';
import { Validators, FormBuilder, FormGroup } from '@angular/forms';

declare var $: any;
declare var jQuery: any;
import 'notyf/dist/notyf.min.css';
import { Router } from '@angular/router';
import { DOCUMENT } from '@angular/common';
declare var require: any;
export interface SubscriptionTypes {
  value: number;
  viewValue: string;
}

@Component({
  selector: 'app-payment',
  templateUrl: './payment.component.html',
  styleUrls: ['./payment.component.scss']
})
export class PaymentComponent implements OnInit {

  mycharge: MyCharge = new MyCharge();
  chooser: boolean = true;
  // value of card
  cardNumber: number;
  expMonth: number;
  expYear: number;
  cvc: number;


  private Notyf = require('notyf');
  private notyf2 = new this.Notyf({
    delay: 5000,
    alertIcon: 'fa fa-exclamation-circle',
    confirmIcon: 'fa fa-check-circle'
  })
  mmyy: string;
  // declar var section
  bool: boolean;
  private jwtToken = null;
  selectedValue: number;
  errorMessage: string = null;

  subscriptionTypes: SubscriptionTypes[];
  firstFormGroup: FormGroup;
  secondFormGroup: FormGroup;
  email: string;
  type: string;
  loader: boolean = false;
  rhnumber: number;
  // inject dependencies 
  constructor(
    public dialogRef: MatDialogRef<PaymentComponent>,
    @Inject(MAT_DIALOG_DATA) public data: any,
    public router: Router,
    private paymentService: PaymentService,
    private notificationsService: NotificationsService,
    private authenticationService: AuthenticationService,
    private _formBuilder: FormBuilder, private renderer2: Renderer2,
    @Inject(DOCUMENT) private _document
  ) { }

  // init var 
  ngOnInit() {
    const s = this.renderer2.createElement('script');
    s.onload = this.loadNextScript.bind(this);
   s.type = 'text/javascript';
   s.src = 'https://js.stripe.com/v2/';
   s.text = '';
   this.renderer2.appendChild(this._document.body, s);

    this.firstFormGroup = this._formBuilder.group({
      type: ['', Validators.required]
    });
    this.secondFormGroup = this._formBuilder.group({
      cardNumber: ['', Validators.required],
      mmyy: ['', Validators.required],
      cvc: ['', Validators.required],
      username: ['', Validators.required],
    });


    // if not etige 
    if (this.data.type != undefined) {
      switch (this.data.type) {
        case 'Silver':
          this.subscriptionTypes = [
            { value: 150, viewValue: 'Mensuel' },
            { value: 99 * 12, viewValue: 'Annuel' }
          ];
          break;

        case 'Gold':
          this.subscriptionTypes = [
            { value: 250, viewValue: 'Mensuel' },
            { value: 199 * 12, viewValue: 'Annuel' }
          ];
          break;

      }
    } else {
      this.subscriptionTypes = [
        { value: this.data.mycharge.amount, viewValue: 'Annuel' },
        { value: this.data.mycharge.amount, viewValue: 'Annuel' }
      ];
    }

  }

  loadNextScript() {
    const s2 = this.renderer2.createElement('script');
    s2.type = 'text/javascript';
    s2.text = "Stripe.setPublishableKey('pk_test_1KhXCRAbHZLYjB6QVFS2wAXJ')";
    
    this.renderer2.appendChild(this._document.body, s2);
  }
  // functoins sections 
  chargeCreditCard() {

    this.loader = true;
    setInterval(() => { // i used this setInterval cause message insie stripe response fuction does not bind value of loader variable  
      this.loader = false;
    }, 5500);
    this.expMonth = parseInt(this.mmyy[0] + this.mmyy[1]);
    this.expYear = parseInt(this.mmyy[3] + this.mmyy[4]);
    this.getConnectedUser();
    (<any>window).Stripe.card.createToken({

      number: this.cardNumber,
      exp_month: this.expMonth,
      exp_year: this.expYear,
      cvc: this.cvc


    }, (status: number, response: any) => {
      if (status === 200) {
        let token = response.id;
        switch (this.selectedValue) {

          case 150:
            this.type = "Silver";// Silver;
            this.rhnumber = 1;
            break;
          case 250:
            this.type = "Gold";// Gold;
            this.rhnumber = 5;
            break;
          case 99 * 12:
            this.type = "Silver";// Silver;
            this.rhnumber = 1;
            break;
          case 199 * 12:
            this.type = "Gold";// Gold;
            this.rhnumber = 5;
            break;
          default:
            this.type = "Platinium";// Platinium;
            this.rhnumber = this.data.mycharge.rhnumber;
            break;

        }

        if (this.data.mycharge != undefined) {
          this.mycharge = {
            token: token,
            email: this.email,
            amount: this.selectedValue,
            rhnumber: this.rhnumber,
            type: this.type,
          };
        } else {
          this.mycharge = {
            token: token,
            email: this.email,
            amount: this.selectedValue,
            rhnumber: this.rhnumber,
            type: this.type,
          };
        }


        this.paymentService.chargeCard(this.mycharge).subscribe(

          res => {
            if (res) {
              this.loader = false;

              this.notificationsService.addInfo("Paiement réussi");

              setInterval(() => { // i used this setInterval cause message insie stripe response fuction does not bind value of loader variable  

                if (this.data.mycharge == undefined) {
                  location.reload();
                } else {
                  this.router.navigate['user/my-subscription'];
                }
              }, 8000);


            } else {
              this.notificationsService.addWarning("votre abonnement n'a pas effectué");

            }
          }
        );

      } else {
        this.errorMessage = "Error : " + response.error.message;
        this.loader = false;
        this.notificationsService.addError(this.errorMessage);

      }
    });
  }
  close(): void {
    this.dialogRef.close();
  }

  check() {

    this.authenticationService.getConnectedUser().subscribe(
      resp => {

        if (resp.body) {
          this.email = resp.body['email'];
          //console.log("getConnectedUser from payment component fired : " + this.email);
          this.paymentService.checkSubscription(this.email).subscribe(
            data => {
              //console.log("value of data is = " + data + "type of data is " + typeof (data));
              if (data) {

                this.notificationsService.addInfo("you are already been subscribed");
              } else {

                this.notificationsService.addWarning("ooops! you are not subscribed yet Plz charge your credit card");
              }
            }
          );
        }
      }
    );

  }


  getConnectedUser(): void {

    this.authenticationService.getConnectedUser().subscribe(
      resp => {

        if (resp.body) {
          this.email = resp.body['email'];
          //console.log("getConnectedUser from payment component fired : " + this.email);
        }
      }
    );
  }

  // onkeyup function to append /
  pushSlash(): void {

    var arr = Array.from(this.mmyy);
    if (arr.length == 2 && this.name(event) !== 8) {
      this.mmyy = this.mmyy + "/";
    }
  }
  name(event) { // code 8 for return
    return (event.keyCode);
  }

  changeLoader(): void {
    this.loader = !this.loader;
  }
}
