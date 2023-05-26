import { Component, OnInit } from '@angular/core';
import { PaymentService } from '../../services/payment.service';
import { NotificationsService } from 'angular4-notify';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { MyCharge } from '../models/charge.model';
import { SubscriptionTypes, PaymentComponent } from '../payment.component';
declare var $: any;
declare var jQuery: any;
import 'notyf/dist/notyf.min.css';
import { MatDialog } from '@angular/material';
import { ActivatedRoute } from '@angular/router';
declare var require: any;
@Component({
  selector: 'app-eti-ge-payment',
  templateUrl: './eti-ge-payment.component.html',
  styleUrls: ['./eti-ge-payment.component.scss']
})
export class EtiGePaymentComponent implements OnInit {


  mycharge: MyCharge = new MyCharge();
  constructor(public matDialog: MatDialog, public route: ActivatedRoute) { }

  ngOnInit() {
    this.route.params.subscribe(params => {
      this.mycharge.amount = params['amount'];
      this.mycharge.rhnumber = params['rh'];
      this.mycharge.token = params['token'];

    });

    let dialogRef = this.matDialog.open(
      PaymentComponent, {
        width: '600px',
        data: { mycharge: this.mycharge }
      }
    );
  }

}
