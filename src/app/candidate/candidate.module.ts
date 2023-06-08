import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { CandidateRoutingModule } from './candidate-routing.module';
import { CandidateListComponent } from './candidate-list/candidate-list.component';
import { CandidateVideoComponent } from './candidate-video/candidate-video.component';
import { CandidateCreateComponent } from './candidate-create/candidate-create.component';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { DetailsCandidateComponent } from './details-candidate/details-candidate.component';
//matautocomplete
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
import { MatAutocompleteModule, MatInputModule, MatSelectModule, MatFormFieldModule, MatTooltipModule, MatSortModule, } from '@angular/material';
import { CandidateHeaderComponent } from './candidate-header/candidate-header.component';
import { SearchCandidateComponent } from './search-candidate/search-candidate.component';
import { MatMenuModule, MatButtonModule, MatIconModule } from '@angular/material';
import { MatRadioModule } from '@angular/material/radio';
import { MatChipsModule } from '@angular/material';
import { MatExpansionModule } from '@angular/material/expansion';
import { MatCheckboxModule } from '@angular/material/checkbox';
import { MatProgressBarModule } from '@angular/material/progress-bar';
import { CandidateinterviewListComponent } from './candidateinterview-list/candidateinterview-list.component';
import { CandidateVideosComponent } from './candidate-videos/candidate-videos.component';
import { NgbModule } from '@ng-bootstrap/ng-bootstrap';
import { ReportsListComponent } from './reports-list/reports-list.component';
import { CKEditorModule } from 'ngx-ckeditor';
import { CandidateEmailComponent } from './candidate-email/candidate-email.component';
import { VideoCallComponent } from './video-call/video-call.component';
import { SidebarComponent } from '../sidebar/sidebar.component';




@NgModule({
  imports: [
    CommonModule,
    CandidateRoutingModule,
    CandidateRoutingModule,
    FormsModule,
    ReactiveFormsModule,
    MatInputModule,
    MatAutocompleteModule,
    MatSelectModule,
    BrowserAnimationsModule,
    MatMenuModule,
    MatButtonModule,
    MatIconModule,
    MatChipsModule,
    MatRadioModule,
    MatExpansionModule,
    MatCheckboxModule,
    MatProgressBarModule,
    NgbModule,
    CKEditorModule,
    MatFormFieldModule,
    MatTooltipModule,
    MatSortModule,
    SidebarComponent,

  ],
  exports: [
    MatSortModule,
  ],
  declarations: [
    CandidateListComponent,
    CandidateCreateComponent,
    DetailsCandidateComponent,
    CandidateHeaderComponent,
    SearchCandidateComponent,
    CandidateVideoComponent,
    CandidateinterviewListComponent,
    CandidateVideosComponent,
    ReportsListComponent,
    VideoCallComponent,
    CandidateEmailComponent]
})
export class CandidateModule { }
