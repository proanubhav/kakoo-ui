import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RhManagementRoutingModule } from './rh-management-routing.module';
import { RhListComponent } from './rh-list/rh-list.component';
import { RhHeaderComponent } from './rh-header/rh-header.component';
import { RhCreateComponent } from './rh-create/rh-create.component';
import { DetailsEmployeeComponent } from './details-employee/details-employee.component';

//matautocomplete
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
import {
  MatAutocompleteModule,
  MatInputModule,
  MatSelectModule,
  MatFormFieldModule,
  MatTooltipModule,
  MatCardModule,
  MatDatepickerModule,
  MatTabsModule
} from '@angular/material';
import { MatMenuModule, MatButtonModule, MatIconModule } from '@angular/material';
import { MatRadioModule } from '@angular/material/radio';
import { MatChipsModule } from '@angular/material';
import { MatExpansionModule } from '@angular/material/expansion';
import { MatCheckboxModule } from '@angular/material/checkbox';
import { MatProgressBarModule } from '@angular/material/progress-bar';

import { FormsModule, ReactiveFormsModule } from '@angular/forms';

import { ClientModule } from "./client/client.module";
import { EmployeeConfirmComponent } from './employee-confirm/employee-confirm.component';
import { DashboardEmployeeComponent } from './dashboard-employee/dashboard-employee.component';
import { ArretCreateComponent } from './arret-create/arret-create.component';
import { EmployeeTasksManagementComponent } from './employee-tasks-management/employee-tasks-management.component';
import { EmployeeNewTimesheetComponent, RefuseTimesheetDialog } from './employee-new-timesheet/employee-new-timesheet.component';

@NgModule({
  imports: [
    CommonModule,
    RhManagementRoutingModule,
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
    MatFormFieldModule,
    MatTooltipModule,
    FormsModule,
    ReactiveFormsModule,
    ClientModule,
    MatCardModule,
    MatDatepickerModule,
    MatTabsModule
  ],
  declarations: [
    RhListComponent,
    RhHeaderComponent,
    RhCreateComponent,
    DetailsEmployeeComponent,
    EmployeeConfirmComponent,
    DashboardEmployeeComponent,
    ArretCreateComponent,
    EmployeeTasksManagementComponent,
    EmployeeNewTimesheetComponent,
    RefuseTimesheetDialog
  ]
})
export class RhManagementModule { }
