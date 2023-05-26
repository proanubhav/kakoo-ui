import { Injectable, OnInit } from '@angular/core';
import { Router, CanActivate, ActivatedRouteSnapshot, RouterStateSnapshot } from '@angular/router';
import { AuthenticationService } from '../services/authentication.service';
import { PaymentService } from '../services/payment.service';
import { Location } from '@angular/common';
import { MatDialog } from '@angular/material';
import { AddRhComponent } from '../add-rh/add-rh.component';
import { MessageDialogUnsubscribeComponent } from '../payment/message-dialog-unsubscribe/message-dialog-unsubscribe.component';


@Injectable()
export class UrlPaymentPermission implements CanActivate {
    email: any;
    hasAccess: boolean = false;
    constructor(
        private router: Router,
        private authenticationService: AuthenticationService,
        private paymentService: PaymentService,
        public location: Location,
        public MatDialog: MatDialog
    ) { }

    canActivate(route: ActivatedRouteSnapshot, state: RouterStateSnapshot) {
        let check = false;;
        if (localStorage.getItem('token') !== undefined && localStorage.getItem('token') !== null){
            check = true;
        }
        //console.log("Im fired from here ");
        if (check) {
            this.authenticationService.getConnectedUser().subscribe(resp => {
                this.email = resp.body['email'];
                //console.log("user  email " + this.email);

                this.paymentService.checkSubscription(this.email).subscribe(
                    res => {
                        if (res) {

                            this.hasAccess = true;
                            return true;

                        } else {
                            this.MatDialog.open(
                                MessageDialogUnsubscribeComponent, {
                                    width: '500px',
                                    height: '160px'
                                }
                            );
                            this.router.navigate(['user/subscriptions'], { queryParams: { returnUrl: state.url } });
                        }
                    },
                    error => {
                        this.location.back();
                    }
                );
            });
            return true;
        }
        return this.hasAccess;
    }
}
