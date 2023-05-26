import { Component, OnInit } from '@angular/core';
import { Location } from '@angular/common';
import { PaymentService } from '../../services/payment.service';
import { NotificationsService } from 'angular4-notify';
import { AuthenticationService } from '../../services/authentication.service';

@Component({
  selector: 'app-unsubscribed',
  templateUrl: './unsubscribed.component.html',
  styleUrls: ['./unsubscribed.component.scss']
})
export class UnsubscribedComponent implements OnInit {
  valuechooser: any;
  txtraison: string;
  selectValue: boolean = false;
  email: any;
  loader: boolean = false;
  form: boolean = true;
  messageSuccess: boolean = false;

  constructor(private location: Location,
    private paymentService: PaymentService,
    private notificationsService: NotificationsService,
    private authenticationService: AuthenticationService, ) { }

  ngOnInit() {
    //console.log(this.selectValue);

  }
  unsubscribed(): void {



    if (this.valuechooser !== undefined) {
      this.form = false;
      this.loader = true;
      this.selectValue = false;
      //console.log("fired");
      if (this.valuechooser == 0 && this.txtraison !== undefined) {
        if (this.txtraison.length > 5 && this.txtraison.length < 255) {
          this.txtraison = this.txtraison;
          /// save unsub
          this.saveUnsub();
        }
        else {
          //console.log("text more then 255 " + this.txtraison);
        }
      } else {
        switch (this.valuechooser) {
          case 1:
            this.txtraison = "le service n'est professionnel";
            break;

          case 2:
            this.txtraison = "le recherche par mot clé donne des résultats erronés";
            break;

          case 3:
            this.txtraison = "nous ne somme pas satisfaits par KAKOO";
            break;

          case 4:
            this.txtraison = "nous avons cessé nos activités";
            break;
        }
        this.saveUnsub();
      }

    } else {
      this.selectValue = true;
    }


  }
  back(): void {
    this.location.back();
  }


  saveUnsub(): void {
    this.authenticationService.getConnectedUser().subscribe(
      resp => {

        if (resp.body) {
          this.email = resp.body['email'];
          this.paymentService.saveUnsubscription(this.email, this.txtraison).subscribe(res => {
            this.selectValue = false;
            this.loader = false;
            this.messageSuccess = true;

            //console.log(res);
          });
        }
      }
    );
  }
}
