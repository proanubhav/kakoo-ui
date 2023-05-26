import { Component, OnInit } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { PaymentService } from '../../services/payment.service';

@Component({
  selector: 'app-dmd-unsubscribe',
  templateUrl: './dmd-unsubscribe.component.html',
  styleUrls: ['./dmd-unsubscribe.component.scss']
})
export class DmdUnsubscribeComponent implements OnInit {

  token: string;
  checktoken: boolean = false;
  constructor(
    public route: ActivatedRoute,
    private paymentService: PaymentService
  ) { }

  ngOnInit() {
    this.route.params.subscribe(params => {
      this.token = params['token'];
      if (this.token != undefined) {
        this.checktoken = true;
        this.paymentService.unsubscribeUser(this.token).subscribe(resp => {
          //console.log(resp);
        });
      } else {
        this.checktoken = false;
      }
    });

  }

}
