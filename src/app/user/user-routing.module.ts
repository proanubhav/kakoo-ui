import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';
import { UserLoginComponent } from './user-login/user-login.component';
import { UserSignupComponent } from './user-signup/user-signup.component';
import { UserConfirmComponent } from './user-confirm/user-confirm.component';
import { PasswordResetComponent } from './password-reset/password-reset.component';
import { AddRhComponent } from './add-rh/add-rh.component';
import { UserProfileComponent } from './user-profile/user-profile.component';
import { CompanyUsersComponent } from './company-users/company-users.component';
import { UserSettingsComponent } from './user-settings/user-settings.component';
import { PaymentModeComponent } from './payment/payment-mode/payment-mode.component';
import { PaymentNotificationComponent } from './payment/payment-notification/payment-notification.component';
import { UnsubscribedComponent } from './payment/unsubscribed/unsubscribed.component';
import { MySubscriptionComponent } from './payment/my-subscription/my-subscription.component';
import { DmdUnsubscribeComponent } from './payment/dmd-unsubscribe/dmd-unsubscribe.component';
import { UrlPermission } from './UrlPermission/UrlPermission';
import { UrlPaymentPermission } from './UrlPermission/UrlPaymentPermission';
import { RhdeletedComponent } from './rhdeleted/rhdeleted.component';
import { EtiGePaymentComponent } from './payment/eti-ge-payment/eti-ge-payment.component';
import { PaymentComponent } from './payment/payment.component';




const routes: Routes = [
  { path: 'user/login', component: UserLoginComponent },
  { path: 'user/login/:info', component: UserLoginComponent },
  { path: 'user/signup', component: UserSignupComponent },
  { path: 'user/signup/:typeoffre', component: UserSignupComponent }, /// nos offres 
  { path: 'users/confirm/:code', component: UserConfirmComponent },
  { path: 'users/confirm/:code/:typeoffre', component: UserConfirmComponent },
  { path: 'users/confirm', component: UserConfirmComponent },
  { path: 'users/reset/:code', component: PasswordResetComponent },
  { path: 'users/add-user', component: AddRhComponent, canActivate: [UrlPaymentPermission] },
  { path: 'user/profile', component: UserProfileComponent },
  { path: 'company/allusers', component: CompanyUsersComponent, canActivate: [UrlPaymentPermission] },
  { path: 'user/settings', component: UserSettingsComponent },
  { path: 'user/rhdeleted', component: RhdeletedComponent },
  // abonnement
  { path: 'users/unsubscribed/:token', component: DmdUnsubscribeComponent },
  { path: 'user/unsubscribed', component: UnsubscribedComponent },
  { path: 'user/my-subscription', component: MySubscriptionComponent },
  { path: 'user/subscriptions', component: PaymentModeComponent },
  { path: 'user/notifpayment', component: PaymentNotificationComponent },
  { path: 'user/dmd-unsubscribe', component: DmdUnsubscribeComponent, },
  { path: 'payment/etige/:rh/:amount/:token', component: EtiGePaymentComponent, },
  // fin abonnement 
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class UserRoutingModule { }
