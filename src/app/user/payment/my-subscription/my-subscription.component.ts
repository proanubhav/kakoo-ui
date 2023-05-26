import { Component, OnInit } from '@angular/core';
import { PaymentService } from '../../services/payment.service';
import { AuthenticationService } from '../../services/authentication.service';
import { Router } from '@angular/router';

@Component({
  selector: 'app-my-subscription',
  templateUrl: './my-subscription.component.html',
  styleUrls: ['./my-subscription.component.scss']
})
export class MySubscriptionComponent implements OnInit {
  firstName: string;
  lastName: string;

  typepayment: string;
  dateDebut: Date;

  phone: string;
  mail: string;
  numberPeriod: number;
  isPeriodTest: boolean = false;
  isUnsubcribe: boolean = false;
  type: any;
  constructor(private auth: AuthenticationService,
    public paymentService: PaymentService,
    private router: Router) { }

  ngOnInit() {
    this.getConnectedUser();
    this.isUnsubFunction();
    this.isPeriodTests();
    this.getSubscriptionInfo();

  }
  getConnectedUser(): void {

    this.auth.getConnectedUser().subscribe(
      resp => {

        if (resp.body) {
          this.firstName = resp.body['firstName'];
          this.lastName = resp.body['lastName'];
          this.phone = resp.body['phone'];
          this.mail = resp.body['email'];

          // getting number of period
          this.paymentService.getNumberOfDays(this.mail).subscribe(
            data => {
              if (data >= 0) {
                this.numberPeriod = data;

              } else {
                this.numberPeriod = 0; // to avoid dispaying negative numbers

              }
              //console.log("number of day : " + data + "type of data is : " + typeof (data));
            }
          );
          //console.log("getConnectedUser from payment component fired : " + this.firstName);
        }
      }
    );
  }
  isPeriodTests(): void {
    this.auth.getConnectedUser().subscribe(
      resp => {

        if (resp.body) {


          // getting email
          this.mail = resp.body['email'];


          //console.log("isPeriodTests from payment mode component fired : " + this.mail);
          this.paymentService.checkPeriodTest(this.mail).subscribe(
            data => {
              this.isPeriodTest = data;
            }
          );
        }
      }
    );
  }

  getSubscriptionInfo(): void {
    this.auth.getConnectedUser().subscribe(
      resp => {
        if (resp.body) {
          // getting email
          this.mail = resp.body['email'];
          this.paymentService.getSubscription(this.mail).subscribe(
            res => {
              this.dateDebut = res.startSubscription;
              res.psp.forEach(element => {
                this.type = element.type;
              });
              //console.log("expiration periode is : " + res.expitationPeriod);
              this.typepayment = (res.expitationPeriod == 30) ? "Mensuel" : (res.expitationPeriod == 365) ? "Annuel" : "Nous invitons à payer votre abonnement Svp!";
            }

          );
        }
      }
    );

  }



  isUnsubFunction(): void {
    this.auth.getConnectedUser().subscribe(
      resp => {

        if (resp.body) {
          this.mail = resp.body['email'];
          this.paymentService.inUnsubscribed(this.mail).subscribe(res => {
            this.isUnsubcribe = res;
            //console.log("result is " + this.isUnsubcribe);
          });
        }
      }
    );
  }

  goAbonnement(): void {
    this.router.navigate(['/user/subscriptions']);
  }

}
