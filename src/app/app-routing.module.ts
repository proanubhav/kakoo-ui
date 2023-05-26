import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';
import { HomeComponent } from './home/home.component';
import { NotfoundComponent } from './notfound/notfound.component';
import { OffresComponent } from './offres/offres.component';
import { VideoTestingComponent } from './video-testing/video-testing.component';
import { CgvComponent } from './confidentiality/cgv/cgv.component';
import { ConfidentialityComponent } from './confidentiality/confidentiality.component';
import { DemoComponent } from './demo/demo.component';
import { ChatbotComponent } from './chatbot/chatbot.component';
import { AccueilComponent } from './accueil/accueil.component';

import { UrlPaymentPermission } from './user/UrlPermission/UrlPaymentPermission';
import { RhListComponent } from './rh-management/rh-list/rh-list.component';
import { RhCreateComponent } from './rh-management/rh-create/rh-create.component';
import {DetailsEmployeeComponent} from "./rh-management/details-employee/details-employee.component";
import {ClientListComponent} from "./rh-management/client/client-list/client-list.component";
import {ClientCreateComponent} from "./rh-management/client/client-create/client-create.component";
import {ClientContactComponent} from "./rh-management/client/client-contact/client-contact.component";
import {ContactCreateComponent} from "./rh-management/client/contact-create/contact-create.component";
import {AssignTaskComponent} from "./rh-management/client/assign-task/assign-task.component";
import {TaskListComponent} from "./rh-management/client/task-list/task-list.component";
import {EmployeeConfirmComponent} from "./rh-management/employee-confirm/employee-confirm.component";
import {DashboardEmployeeComponent} from "./rh-management/dashboard-employee/dashboard-employee.component";
import { ArretCreateComponent } from './rh-management/arret-create/arret-create.component';
import { EmployeeTasksManagementComponent } from './rh-management/employee-tasks-management/employee-tasks-management.component';
import { EmployeeNewTimesheetComponent } from './rh-management/employee-new-timesheet/employee-new-timesheet.component';

const routes: Routes = [
  { path: '', component: AccueilComponent },
  { path: 'home/:home', component: AccueilComponent },

  { path: 'offres', component: OffresComponent },
  { path: 'test', component: VideoTestingComponent },
  { path: 'terms', component: ConfidentialityComponent },
  { path: 'demo', component: DemoComponent },
  { path: 'chatbot', component: ChatbotComponent },

  { path: 'rh/list', component: RhListComponent, canActivate: [UrlPaymentPermission]},
  { path: 'rh/create', component: RhCreateComponent, canActivate: [UrlPaymentPermission] },
  { path: 'employee/details/:id', component: DetailsEmployeeComponent, canActivate: [UrlPaymentPermission] },
  { path: 'rh/edit/:id', component: RhCreateComponent, canActivate: [UrlPaymentPermission] },
  { path: 'client/list', component: ClientListComponent, canActivate: [UrlPaymentPermission] },
  { path: 'client/create', component: ClientCreateComponent, canActivate: [UrlPaymentPermission] },
  { path: 'client/edit/:id', component: ClientCreateComponent, canActivate: [UrlPaymentPermission] },
  { path: 'client/contact/:id', component: ClientContactComponent, canActivate: [UrlPaymentPermission] },
  { path: 'client/notFound', component: NotfoundComponent },
  { path: 'contact/client/create/:id', component: ContactCreateComponent, canActivate: [UrlPaymentPermission] },
  { path: 'client/assign-task/:id', component: AssignTaskComponent, canActivate: [UrlPaymentPermission] },
  { path: 'client/assign-task', component: AssignTaskComponent, canActivate: [UrlPaymentPermission] },
  { path: 'contact/client/edit/:contactId', component: ContactCreateComponent, canActivate: [UrlPaymentPermission] },
  { path: 'task/list', component: TaskListComponent, canActivate: [UrlPaymentPermission] },
  { path: 'employees/confirm/:code', component: EmployeeConfirmComponent },
  { path: 'employee/dashboard', component: DashboardEmployeeComponent, canActivate: [UrlPaymentPermission] },
  { path: 'arret/create', component: ArretCreateComponent, canActivate: [UrlPaymentPermission] },
  { path: 'employee/:id/tasks', component: EmployeeTasksManagementComponent, canActivate: [UrlPaymentPermission] },
  { path: 'employee/:idEmployee/add-task', component: AssignTaskComponent, canActivate: [UrlPaymentPermission] },
  { path: 'tasks/edit/:idTask', component: AssignTaskComponent, canActivate: [UrlPaymentPermission] },
  { path: 'employee/:idEmployee/edit-task/:idTask', component: AssignTaskComponent, canActivate: [UrlPaymentPermission] },
  { path: 'employee/:idEmployee/timesheet/:currentMonthS/:currentYear', component: EmployeeNewTimesheetComponent, canActivate: [UrlPaymentPermission] }

];

@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule]
})
export class AppRoutingModule { }
