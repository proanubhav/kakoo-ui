import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { Routes, RouterModule } from '@angular/router';
import { RhListComponent } from './rh-list/rh-list.component';
import { UrlPaymentPermission } from '../user/UrlPermission/UrlPaymentPermission';
import { RhCreateComponent } from './rh-create/rh-create.component';
import {DetailsEmployeeComponent} from "./details-employee/details-employee.component";
import {NotfoundComponent} from "../notfound/notfound.component";
import {EmployeeTasksManagementComponent} from "./employee-tasks-management/employee-tasks-management.component";

const routes: Routes = [
  { path: 'rh/getAll', component: RhListComponent, canActivate: [UrlPaymentPermission]},
  { path: 'rh/create', component: RhCreateComponent, canActivate: [UrlPaymentPermission]},
  { path: 'rh/edit/:id', component: RhCreateComponent, canActivate: [UrlPaymentPermission] },
  { path: 'employee/:id', component: DetailsEmployeeComponent, canActivate: [UrlPaymentPermission] },
  { path: 'employee/notFound', component: NotfoundComponent },
  { path: 'employee/tasks/:id', component: EmployeeTasksManagementComponent, canActivate: [UrlPaymentPermission] }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class RhManagementRoutingModule { }
