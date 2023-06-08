import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ClientListComponent } from './client-list/client-list.component';
import { ClientHeaderComponent } from './client-header/client-header.component';
import {
	MatAutocompleteModule,
	MatCheckboxModule, MatDatepickerModule,
	MatFormFieldModule,
	MatIconModule,
	MatInputModule,
	MatMenuModule, MatRadioModule,
	MatSelectModule,
	MatButtonModule, MatLabel
} from "@angular/material";
import { FormsModule, ReactiveFormsModule } from "@angular/forms";
import { SharedService } from "../services/shared.service";
import { PagerService } from "../services/pager.service";
import { ClientService } from "./client.service";
import { ClientCreateComponent } from './client-create/client-create.component';
import { ClientContactComponent } from './client-contact/client-contact.component';
import { ContactCreateComponent } from './contact-create/contact-create.component';
import { CustomTitleCase } from "../../custom-title-case";
import { AssignTaskComponent } from './assign-task/assign-task.component';
import { RouterModule } from "@angular/router";
import { TaskListComponent } from './task-list/task-list.component';
import { NgbModule } from '@ng-bootstrap/ng-bootstrap';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
import { ClientSidebarComponent } from './client-sidebar/client-sidebar.component';

@NgModule({
	imports: [
		CommonModule,
		RouterModule,
		MatMenuModule,
		MatIconModule,
		FormsModule,
		ReactiveFormsModule,
		MatFormFieldModule,
		MatInputModule,
		MatCheckboxModule,
		MatSelectModule,
		MatRadioModule,
		MatDatepickerModule,
		MatAutocompleteModule,
		NgbModule,
		BrowserAnimationsModule,
		MatButtonModule
	],
	declarations: [
		ClientListComponent,
		ClientHeaderComponent,
		ClientCreateComponent,
		ClientContactComponent,
		ClientSidebarComponent,
		ContactCreateComponent,
		CustomTitleCase,
		AssignTaskComponent,
		TaskListComponent
	],
	providers: [
		ClientService,
		SharedService,
		PagerService
	]
})
export class ClientModule { }
