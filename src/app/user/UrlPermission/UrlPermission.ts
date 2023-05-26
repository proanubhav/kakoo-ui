import { Injectable } from '@angular/core';
import { Router, CanActivate, ActivatedRouteSnapshot, RouterStateSnapshot } from '@angular/router';
import { AuthenticationService } from '../services/authentication.service';
import { PaymentService } from '../services/payment.service';


@Injectable()
export class UrlPermission implements CanActivate {
    userRole: any;
    isAdmin: boolean = false;
    email: any;

    constructor(
        private router: Router,
        private authenticationService: AuthenticationService) { }

    canActivate(route: ActivatedRouteSnapshot, state: RouterStateSnapshot) {
        if (localStorage.getItem('token')) {
            this.authenticationService.getConnectedUser().subscribe(resp => {
                //console.log("fired from Url Permission old ");
                this.userRole = resp.body['roles'][0].role;
                if (this.userRole == "ADMIN") {
                    this.isAdmin = true;
                } else if (this.userRole == "RH") {
                    this.router.navigate(['candidate/list'], { queryParams: { returnUrl: state.url } });
                }
            });
        }
        return this.isAdmin;
    }
}
