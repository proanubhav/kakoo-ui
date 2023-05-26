import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';
import { QuizzCreateComponent } from './quizz-create/quizz-create.component';
import { QuizzListComponent } from './quizz-list/quizz-list.component';
import { TakeTestComponent } from './take-test/take-test.component';
import { QuizzPageComponent } from './quizz-page/quizz-page.component';
import { QuizzReportComponent } from './quizz-report/quizz-report.component';
import { NotfoundComponent } from '../notfound/notfound.component';
import { InterviewCreateComponent } from './interview-create/interview-create.component';
import { InterviewListComponent } from './interview-list/interview-list.component';
import { UrlPaymentPermission } from '../user/UrlPermission/UrlPaymentPermission';


const routes: Routes = [
  { path: 'quizz/create', component: QuizzCreateComponent, canActivate: [UrlPaymentPermission] },
  { path: 'quizz/list', component: QuizzListComponent, canActivate: [UrlPaymentPermission] },
  { path: 'quizz/list/:uuid', component: QuizzListComponent, canActivate: [UrlPaymentPermission] },
  { path: 'quizz/take-quizz/:code/:token', component: TakeTestComponent },
  { path: 'quizz-result/:quizzid', component: QuizzPageComponent, canActivate: [UrlPaymentPermission] },
  { path: 'quizz-report', component: QuizzReportComponent, canActivate: [UrlPaymentPermission] },
  { path: 'interview/quizz/list/:name', component: InterviewCreateComponent, canActivate: [UrlPaymentPermission] },
  { path: 'interviews/list', component: InterviewListComponent, canActivate: [UrlPaymentPermission] },
  { path: 'interviews/list/:candidateId', component: InterviewListComponent, canActivate: [UrlPaymentPermission] },
  { path: '**', component: NotfoundComponent }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class EvaluationRoutingModule {

}
