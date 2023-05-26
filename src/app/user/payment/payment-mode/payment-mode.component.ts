import { Component, OnInit } from '@angular/core';
import { AuthenticationService } from '../../services/authentication.service';
import { MyCharge } from '../models/charge.model';
import { PaymentService } from '../../services/payment.service';
import { MatDialog } from '@angular/material';
import { PaymentComponent } from '../payment.component';
import { RequestEtiGeComponent } from '../request-eti-ge/request-eti-ge.component';
declare var $: any;
declare var jQuery: any;
export interface PriceValue {
  price_1: number;
  price_2: number;
  //price_3: number;
}
@Component({
  selector: 'app-payment-mode',
  templateUrl: './payment-mode.component.html',
  styleUrls: ['./payment-mode.component.scss']
})
export class PaymentModeComponent implements OnInit {

  mycharge: MyCharge = new MyCharge();

  priceValues: PriceValue;
  username: string;
  email: string;
  numberPeriod: number;
  isPeriodTest: boolean = false;
  switchabnt: boolean = false;
  constructor(
    private auth: AuthenticationService,
    public paymentService: PaymentService,
    public matDialog: MatDialog) { }

  ngOnInit() {
    // scoll to top
    window.scroll(0, 0);
    // animation of meilleurs offres
    var elements = document.getElementsByClassName("meilleurs");
    //console.log(elements.length);
    jQuery.each(elements, function (i, element) {
      element.style.animationName = "offres";
      element.style.animationDuration = i / 2 + "s";
    });

    this.getConnectedUser();

    this.isPeriodTests();

    this.switchPrice(!this.switchabnt);
  }


  switchPrice(switchvalue: boolean): void {
    if (switchvalue) {

      // years prices
      this.priceValues = {
        price_1: 99,
        price_2: 199,
        //price_3: 299,
      }
      //console.log("switching");
    }
    else {
      // month prices
      this.priceValues = {
        price_1: 150,
        price_2: 250,
        //price_3: 340,
      }
    }
  }

  getConnectedUser(): void {

    this.auth.getConnectedUser().subscribe(
      resp => {

        if (resp.body) {
          // getting username
          this.username = resp.body['lastName'] + ' ' + resp.body['firstName'];

          // getting email
          this.email = resp.body['email'];

          // getting number of period
          this.paymentService.getNumberOfDays(this.email).subscribe(
            data => {
              this.numberPeriod = data;
              //console.log("number of day : " + data + "type of data is : " + typeof (data));
            }
          );
          //console.log("getConnectedUser from payment component fired : " + this.username);
        }
      }
    );
  }

  openDialogClassPeriod(type: string): void {
    let dialogRef = this.matDialog.open(
      PaymentComponent, {
        width: '600px',
        panelClass: 'my-mat-dialog-container',
        data: { type: type }
      }
    );
  }

  isPeriodTests(): void {
    this.auth.getConnectedUser().subscribe(
      resp => {
        if (resp.body) {
          // getting email
          this.email = resp.body['email'];
          //console.log("isPeriodTests from payment mode component fired : " + this.email);
          this.paymentService.checkPeriodTest(this.email).subscribe(
            data => {
              this.isPeriodTest = data;
            }
          );
        }
      }
    );
  }

  openDialogContactUs(): void {
    let dialogRef = this.matDialog.open(
      RequestEtiGeComponent, {
        width: '800px',
        panelClass: 'my-mat-dialog-container'
      }
    );
  }


}
