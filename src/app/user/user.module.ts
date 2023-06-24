import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

import { UserRoutingModule } from './user-routing.module';
import { UserLoginComponent } from './user-login/user-login.component';
import { UserSignupComponent } from './user-signup/user-signup.component';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { UserNavbarComponent } from './user-navbar/user-navbar.component';
import { UserConfirmComponent } from './user-confirm/user-confirm.component';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
import { MatAutocompleteModule, MatInputModule, MatSelectModule, MatSidenavModule, MatSliderModule, MatSlideToggleModule, MatProgressBarModule, MatProgressSpinnerModule, MatRadioModule, MatStepperModule, MatTooltipModule } from '@angular/material';

import { MatMenuModule, MatButtonModule, MatIconModule } from '@angular/material';
import { MatButtonToggleModule } from '@angular/material/button-toggle';
import { MatDialogModule, MatDialog, MatDialogRef } from '@angular/material';


import { AddRhComponent } from './add-rh/add-rh.component';
import { UserProfileComponent } from './user-profile/user-profile.component';
import { CompanyUsersComponent } from './company-users/company-users.component';
import { UserSettingsComponent } from './user-settings/user-settings.component';
import { PaymentComponent } from './payment/payment.component';

import { NotificationsModule, NotificationsService } from 'angular4-notify';
import { PaymentModeComponent } from './payment/payment-mode/payment-mode.component';
import { MatCardModule } from '@angular/material/card';
import { PaymentNotificationComponent } from './payment/payment-notification/payment-notification.component';
import { MySubscriptionComponent } from './payment/my-subscription/my-subscription.component';
import { UnsubscribedComponent } from './payment/unsubscribed/unsubscribed.component';
import { DmdUnsubscribeComponent } from './payment/dmd-unsubscribe/dmd-unsubscribe.component';
import { UrlPermission } from './UrlPermission/UrlPermission';
import { UrlPaymentPermission } from './UrlPermission/UrlPaymentPermission';
import { RequestEtiGeComponent } from './payment/request-eti-ge/request-eti-ge.component';

import { CKEditorModule } from 'ngx-ckeditor';
import { DetailsUploadComponent } from '../upload/details-upload/details-upload.component';
import { RhdeletedComponent } from './rhdeleted/rhdeleted.component';
import { MessageDialogUnsubscribeComponent } from './payment/message-dialog-unsubscribe/message-dialog-unsubscribe.component';
import { EtiGePaymentComponent } from './payment/eti-ge-payment/eti-ge-payment.component';
import { InternationalPhoneModule } from 'ng4-intl-phone';
import { UserSidebarComponent } from './user-sidebar/user-sidebar.component';
import { CandidateSignupComponent } from './candidate-signup/candidate-signup.component';
import { forgotPasswordComponent } from './forgot-password/forgot-password.component';



@NgModule({
  imports: [
    CommonModule,
    UserRoutingModule,
    FormsModule,
    ReactiveFormsModule,
    MatInputModule,
    MatAutocompleteModule,
    MatSelectModule,
    BrowserAnimationsModule,
    MatMenuModule,
    MatButtonModule,
    MatIconModule,
    MatButtonToggleModule,
    MatDialogModule,
    MatButtonModule,
    MatSelectModule,
    NotificationsModule,
    MatCardModule,
    MatSidenavModule,
    MatSliderModule,
    MatSlideToggleModule,
    MatProgressBarModule,
    MatProgressSpinnerModule,
    MatRadioModule,
    MatStepperModule,
    CKEditorModule,
    MatTooltipModule,
    InternationalPhoneModule
  ],
  declarations: [
    UserLoginComponent,
    forgotPasswordComponent,
    UserSignupComponent,
    CandidateSignupComponent,
    UserNavbarComponent,
    UserSidebarComponent,
    UserConfirmComponent,
    AddRhComponent,
    UserProfileComponent,
    CompanyUsersComponent,
    UserSettingsComponent,
    PaymentComponent,
    PaymentModeComponent,
    PaymentNotificationComponent,
    MySubscriptionComponent,
    UnsubscribedComponent,
    DmdUnsubscribeComponent,
    RequestEtiGeComponent,
    RhdeletedComponent,
    MessageDialogUnsubscribeComponent,
    EtiGePaymentComponent,
  ],
  providers: [NotificationsService, UrlPermission, UrlPaymentPermission],
  entryComponents: [PaymentComponent, RequestEtiGeComponent, DetailsUploadComponent, MessageDialogUnsubscribeComponent],
})
export class UserModule { }

