import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

import { EvaluationRoutingModule } from './evaluation-routing.module';
import { QuizzCreateComponent } from './quizz-create/quizz-create.component';


import { FormsModule, ReactiveFormsModule } from '@angular/forms';
//matautocomplete
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
import { MatAutocompleteModule, MatInputModule, MatSelectModule } from '@angular/material';
import { MatMenuModule, MatButtonModule, MatIconModule } from '@angular/material';
import { MatRadioModule } from '@angular/material/radio';
import { MatChipsModule } from '@angular/material';
import { MatExpansionModule } from '@angular/material/expansion';
import { MatCheckboxModule } from '@angular/material/checkbox';
import { QuizzListComponent } from './quizz-list/quizz-list.component';
import { TakeTestComponent } from './take-test/take-test.component';
import { EvalNavbarComponent } from './eval-navbar/eval-navbar.component';
import { MatProgressBarModule } from '@angular/material/progress-bar';
import { QuizzPageComponent } from './quizz-page/quizz-page.component';
import { QuizzReportComponent } from './quizz-report/quizz-report.component';
import { InterviewCreateComponent } from './interview-create/interview-create.component';
import { NgbModule } from '@ng-bootstrap/ng-bootstrap';
import { InterviewListComponent } from './interview-list/interview-list.component';
import { CKEditorModule } from 'ngx-ckeditor';





@NgModule({
  imports: [
    CommonModule,
    EvaluationRoutingModule,
    FormsModule,
    ReactiveFormsModule,
    MatInputModule,
    ReactiveFormsModule,
    MatAutocompleteModule,
    MatSelectModule,
    BrowserAnimationsModule,
    FormsModule,
    MatMenuModule,
    MatButtonModule,
    MatIconModule,
    MatChipsModule,
    MatRadioModule,
    MatExpansionModule,
    MatCheckboxModule,
    MatProgressBarModule,
    NgbModule,
    CKEditorModule
  ],
  declarations: [QuizzCreateComponent, QuizzListComponent, TakeTestComponent, EvalNavbarComponent, QuizzPageComponent, QuizzReportComponent, InterviewCreateComponent, InterviewListComponent]
})
export class EvaluationModule { }
