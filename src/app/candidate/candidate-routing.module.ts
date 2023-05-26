import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';
import { CandidateListComponent } from './candidate-list/candidate-list.component';
import { CandidateCreateComponent } from './candidate-create/candidate-create.component';
import { FormUploadComponent } from '../upload/form-upload/form-upload.component';
import { DetailsCandidateComponent } from './details-candidate/details-candidate.component';
import { SearchCandidateComponent } from './search-candidate/search-candidate.component';
import { NotfoundComponent } from '../notfound/notfound.component';
import { CandidateVideoComponent } from './candidate-video/candidate-video.component';
import { CandidateinterviewListComponent } from './candidateinterview-list/candidateinterview-list.component';
import { CandidateVideosComponent } from './candidate-videos/candidate-videos.component';
import { ReportsListComponent } from './reports-list/reports-list.component';
import { UrlPaymentPermission } from '../user/UrlPermission/UrlPaymentPermission';
import { CandidateEmailComponent } from './candidate-email/candidate-email.component';
import { VideoCallComponent } from './video-call/video-call.component';



const routes: Routes = [
  { path: 'candidate/list', component: CandidateListComponent, canActivate: [UrlPaymentPermission] },
  { path: 'candidate/list/:quizzid', component: CandidateListComponent, canActivate: [UrlPaymentPermission] },
  { path: 'candidate/list/interview/:interviewId', component: CandidateinterviewListComponent, canActivate: [UrlPaymentPermission] },
  { path: 'candidate/create', component: CandidateCreateComponent, canActivate: [UrlPaymentPermission] },
  { path: 'candidate/edit/:id', component: CandidateCreateComponent, canActivate: [UrlPaymentPermission] },
  { path: 'candidate/upload/form/:id', component: FormUploadComponent, canActivate: [UrlPaymentPermission] },
  { path: 'candidate/details/:id', component: DetailsCandidateComponent, canActivate: [UrlPaymentPermission] },
  { path: 'candidate/notfound', component: NotfoundComponent },
  { path: 'candidate/:candidateId/interview/:interviewId', component: CandidateVideoComponent },
  { path: 'candidate/videos/:candidateId', component: CandidateVideosComponent},
  { path: 'candidate/reports/:candidateId', component: ReportsListComponent, canActivate: [UrlPaymentPermission] },
  { path: 'candidate/email/:selectedListCandidats', component: CandidateEmailComponent, canActivate: [UrlPaymentPermission] },
  { path: 'candidate/video-call', component: VideoCallComponent, canActivate: [UrlPaymentPermission] },
  { path: 'candidate/**', component: NotfoundComponent }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class CandidateRoutingModule { }
