import { BrowserModule } from '@angular/platform-browser';
import { NgModule, NO_ERRORS_SCHEMA } from '@angular/core';
import { AppRoutingModule } from './app-routing.module';
import { AppComponent } from './app.component';
import { HttpModule } from '@angular/http';
import { HeaderComponent } from './header/header.component';
import { HomeComponent } from './home/home.component';
import { FooterComponent } from './footer/footer.component';
import { UploadService } from './upload/upload.service';
import { EvaluationService } from './evaluation/evaluation.service';
import { CandidateService } from './candidate/candidate.service';
import { ChatbotService } from "./chatbot/chatbot.service";
import { DemoService } from './demo/demo.service';
import { HttpClientModule, HttpClient, HttpHandler } from '@angular/common/http';  // replaces previous Http service
import { HttpClientService } from './config/http-client.service';
import { NgbModule } from '@ng-bootstrap/ng-bootstrap';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
//import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { OwlDateTimeModule, OwlNativeDateTimeModule, OWL_DATE_TIME_LOCALE, OwlDateTimeIntl } from 'ng-pick-datetime';
import { UserModule } from './user/user.module';
import { UploadModule } from './upload/upload.module';
import { UserService } from './user/user.service';
import { AuthenticationService } from './user/services/authentication.service';
import { PagerService } from './candidate/services/pager.service';
import { Title } from '@angular/platform-browser';
import { NotfoundComponent } from './notfound/notfound.component';
import { CandidateModule } from './candidate/candidate.module' //Candidate Module
import { EvaluationModule } from './evaluation/evaluation.module';
import { APP_BASE_HREF, LocationStrategy, HashLocationStrategy } from '@angular/common';
import { PaymentService } from './user/services/payment.service';
import { MDBBootstrapModule } from 'angular-bootstrap-md';
import { OffresComponent } from './offres/offres.component';
import { VideoTestingComponent } from './video-testing/video-testing.component';
import { MatSlideToggleModule, MatButtonModule, MatTabsModule, MatDatepickerModule, MatInputModule, MatIconModule } from '@angular/material';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { CgvComponent } from './confidentiality/cgv/cgv.component';
import { PrivacyPolicyComponent } from './confidentiality/privacy-policy/privacy-policy.component';
import { CguComponent } from './confidentiality/cgu/cgu.component';
import { ConfidentialityComponent } from './confidentiality/confidentiality.component';
import { ModalModule } from 'angular-bootstrap-md/modals/modal.module';
import { DemoComponent } from './demo/demo.component';
import { DatePipe } from '@angular/common';
import { ChatbotComponent } from './chatbot/chatbot.component';
import { MessageListComponent } from './chatbot/components/message-list/message-list.component';
import { MessageItemComponent } from './chatbot/components/message-item/message-item.component';
import { MessageFormComponent } from './chatbot/components/message-form/message-form.component';
import { DialogflowService } from './chatbot/services/dialogflow.service';
import { FileDropModule } from 'ngx-file-drop';
import { AccueilComponent } from './accueil/accueil.component';
import { AutoVisuelPolitiqueComponent } from './confidentiality/auto-visuel-politique/auto-visuel-politique.component';

import { RhManagementModule } from './rh-management/rh-management.module';
import {RhManagementService} from "./rh-management/rh-management.service";
import {MatDialogModule} from '@angular/material/dialog';
import { RefuseTimesheetDialog } from './rh-management/employee-new-timesheet/employee-new-timesheet.component';

// here is the default text string
export class DefaultIntl extends OwlDateTimeIntl {
  /** A label for the up second button (used by screen readers).  */
  upSecondLabel = 'Add a second';

  /** A label for the down second button (used by screen readers).  */
  downSecondLabel = 'Minus a second';

  /** A label for the up minute button (used by screen readers).  */
  upMinuteLabel = 'Add a minute';

  /** A label for the down minute button (used by screen readers).  */
  downMinuteLabel = 'Minus a minute';

  /** A label for the up hour button (used by screen readers).  */
  upHourLabel = 'Add a hour';

  /** A label for the down hour button (used by screen readers).  */
  downHourLabel = 'Minus a hour';

  /** A label for the previous month button (used by screen readers). */
  prevMonthLabel = 'Previous month';

  /** A label for the next month button (used by screen readers). */
  nextMonthLabel = 'Next month';

  /** A label for the previous year button (used by screen readers). */
  prevYearLabel = 'Previous year';

  /** A label for the next year button (used by screen readers). */
  nextYearLabel = 'Next year';

  /** A label for the previous multi-year button (used by screen readers). */
  prevMultiYearLabel = 'Previous 21 years';

  /** A label for the next multi-year button (used by screen readers). */
  nextMultiYearLabel = 'Next 21 years';

  /** A label for the 'switch to month view' button (used by screen readers). */
  switchToMonthViewLabel = 'Change to month view';

  /** A label for the 'switch to year view' button (used by screen readers). */
  switchToMultiYearViewLabel = 'Choose month and year';

  /** A label for the cancel button */
  cancelBtnLabel = 'Annuler';

  /** A label for the set button */
  setBtnLabel = 'Enregistrer';

  /** A label for the range 'from' in picker info */
  rangeFromLabel = 'From';

  /** A label for the range 'to' in picker info */
  rangeToLabel = 'To';

  /** A label for the hour12 button (AM) */
  hour12AMLabel = 'AM';

  /** A label for the hour12 button (PM) */
  hour12PMLabel = 'PM';
}

@NgModule({
  declarations: [
    AppComponent,
    HeaderComponent,
    HomeComponent,
    FooterComponent,
    NotfoundComponent,
    OffresComponent,
    VideoTestingComponent,
    CgvComponent,
    PrivacyPolicyComponent,
    CguComponent,
    ConfidentialityComponent,
    DemoComponent,
    ChatbotComponent,
    MessageListComponent,
    MessageItemComponent,
    MessageFormComponent,
    AccueilComponent,
    AutoVisuelPolitiqueComponent

  ],
  imports: [
    BrowserModule,
    AppRoutingModule,
    MDBBootstrapModule.forRoot(),
    CandidateModule,
    UserModule,
    UploadModule,
    EvaluationModule,
    HttpModule,
    HttpClientModule,
    NgbModule.forRoot(),
    BrowserAnimationsModule,
    MatSlideToggleModule,
    FormsModule,
    ReactiveFormsModule,
    MatButtonModule,
    MatTabsModule,
    ModalModule,
    MatDatepickerModule,
    MatIconModule,
    MatInputModule,
    OwlDateTimeModule,
    OwlNativeDateTimeModule,
    FileDropModule,
    RhManagementModule,
    MatDialogModule
  ],
  providers: [
    DialogflowService,
    ChatbotService,
    UploadService,
    CandidateService,
    HttpClientService,
    HttpClient,
    UserService,
    AuthenticationService,
    PagerService,
    Title,
    EvaluationService,
    PaymentService,
    DemoService,
    DatePipe,
    { provide: APP_BASE_HREF, useValue: '/' },
    { provide: LocationStrategy, useClass: HashLocationStrategy },
    { provide: OWL_DATE_TIME_LOCALE, useValue: 'fr' },
    { provide: OwlDateTimeIntl, useClass: DefaultIntl },
    RhManagementService
  ],
  bootstrap: [AppComponent],
  schemas: [NO_ERRORS_SCHEMA],
  entryComponents: [
    OffresComponent,
    AutoVisuelPolitiqueComponent,
    RefuseTimesheetDialog
  ]
})
export class AppModule { }
