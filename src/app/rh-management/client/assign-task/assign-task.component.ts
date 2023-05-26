import { Component, OnInit, OnDestroy } from '@angular/core';
import { FormControl, FormGroup, Validators } from "@angular/forms";
import { ActivatedRoute, Router } from "@angular/router";
import { AuthenticationService } from "../../../user/services/authentication.service";
import { ClientService } from "../client.service";
import { environment } from "../../../../assets/environments/environment";
import { Task } from "../task";
import { DatePipe } from "@angular/common";
import { Observable } from "rxjs";
import { Client } from '../client';
import { RhManagementService } from '../../rh-management.service';
import { Employee } from '../../employee';

declare var require: any;

@Component({
	selector: 'app-assign-task',
	templateUrl: './assign-task.component.html',
	styleUrls: ['./assign-task.component.scss']
})
export class AssignTaskComponent implements OnInit, OnDestroy {

	private apiUrl = environment.apiUrl;
	private jwtToken = null;
	private sub: any;
	private Notyf = require('notyf');
	private notyf2 = new this.Notyf({
		delay: 4000,
		alertIcon: 'fa fa-exclamation-circle',
		confirmIcon: 'fa fa-check-circle'
	});
	private firstName: string;
	private lastName: string;
	private clientName2: string;

	idParamEmployee: number;
	idParamTask: number;

	idIsInherited = false;
	allContacts;
	contacts: string[];
	filteredContacts: Observable<string[]>;
	selected1 = 'undefined';
	selected2 = 'eur';
	assignTaskForm: FormGroup;
	loader: boolean;
	disableSelect1 = new FormControl(false);
	disableSelect2 = new FormControl(true);

	public contactName: string;
	public clientName1: string;
	public contact;

	public allClients;
	public allEmployees;

	public knownEmployee: boolean = false;
	public employee;
	public task;
	public editing = false;
	constructor(
		private router: Router,
		public route: ActivatedRoute,
		private authenticationService: AuthenticationService,
		private clientService: ClientService,
		private datePipe: DatePipe,
		private rhService: RhManagementService
	) { }

	ngOnInit() {
		this.loader = false;
		this.loadToken();
		if (!this.jwtToken) {
			this.router.navigate(['']);
		}
		this.sub = this.route.params.subscribe(
			params => {
				this.idParamEmployee = params['idEmployee'];
				this.idParamTask = params['idTask'];
			}
		);
		this.route.url.subscribe(
			params => {
				if (params != null ) {
					if ((params.length >= 2 && params[1].path == "edit") 
					     || (params.length >= 3 && params[2].path == "edit-task")){
							this.editing = true;
						 }
				} 
			}
		);

		this.assignTaskForm = new FormGroup(
			{
				name: new FormControl('', Validators.required),
				duration: new FormControl('', Validators.required),
				preavis: new FormControl({ value: '', disabled: true }),
				startDate: new FormControl({ value: '', disabled: true }),
				currency: new FormControl('', Validators.required),
				cjm: new FormControl('', Validators.required),
				description: new FormControl(''),
				clientName: new FormControl('', Validators.required),
				employeeID: new FormControl('')
			}
		);

		if (this.editing && this.idParamTask) {
			this.clientService.findTaskById(this.idParamTask).subscribe(
				resp => {
					this.task = resp.body;
					this.assignTaskForm.patchValue({
					  name: resp.body['name'],
					  cjm: resp.body['cjm'],
					  duration: resp.body['duration'],
					  preavis: resp.body['preavis'],
					  startDate: resp.body['startDate'],
					  currency: resp.body['currency'],
					  description: resp.body['description'],
					  clientName: resp.body['client'].id,
					  employeeID: resp.body['employee'] != null ? resp.body['employee'].id : 0
					  });
					if (this.task.startDate != null) {
						this.disableSelect2 = new FormControl(false);
					}
					if (this.task.preavis != null) {
						this.disableSelect1 = new FormControl(true);
					}
				  }
			);
		}
		if (this.idParamEmployee) {
			this.knownEmployee = true;
			this.getEmployeeById(this.idParamEmployee);
		}

		this.getClients();
		this.getEmployees();

	}

	loadToken() {
		this.jwtToken = localStorage.getItem('token');
	}

	getClients() {
		this.clientService.getAllClients().subscribe(
			clients => {
				//console.log(resp);
				this.allClients = clients;
			}, err => {
				console.log(err);
			}
		);
	}

	onSubmit() {
		this.loader = true;
		if (this.assignTaskForm.valid) {
			if (this.disableSelect2.value == true) {
				this.assignTaskForm.controls['startDate'].setValue('');
			}
			if (this.disableSelect1.value == false) {
				this.assignTaskForm.controls['preavis'].setValue('');
			}
			let client: Client = new Client(this.assignTaskForm.controls['clientName'].value);
			let employee = this.knownEmployee ? this.employee : new Employee(this.assignTaskForm.controls['employeeID'].value);
		
			if (this.editing && this.idParamTask) {
				
				let task: Task = new Task(
					this.idParamTask,
					this.assignTaskForm.controls['name'].value,
					this.datePipe.transform(this.assignTaskForm.controls['startDate'].value, 'yyyy-MM-dd'),
					this.assignTaskForm.controls['duration'].value,
					this.assignTaskForm.controls['currency'].value,
					this.assignTaskForm.controls['cjm'].value,
					client,
					employee,
					this.disableSelect2.value,
					this.assignTaskForm.controls['description'].value,
					this.assignTaskForm.controls['preavis'].value
				);
				this.clientService.updateTask(task).subscribe(
					resp => {
						this.loader = false;
						this.notyf2.confirm(' Mission modifiée avec succès');
						this.redirectTaskList();
					}, err => {
						this.loader = false;
						this.notyf2.alert('Echec de modification de la mission , vous avez des champs invalide');
					}
				);

			} else {

				let task1: Task = new Task(
					0,
					this.assignTaskForm.controls['name'].value,
					this.datePipe.transform(this.assignTaskForm.controls['startDate'].value, 'yyyy-MM-dd'),
					this.assignTaskForm.controls['duration'].value,
					this.assignTaskForm.controls['currency'].value,
					this.assignTaskForm.controls['cjm'].value,
					client,
					employee,
					this.disableSelect2.value,
					this.assignTaskForm.controls['description'].value,
					this.assignTaskForm.controls['preavis'].value
				);

				this.clientService.saveTask(task1).subscribe(
					resp => {
						console.log(resp);
						this.loader = false;
						this.notyf2.confirm('Nouvelle mission ajoutée.');
						this.redirectTaskList();
					}, err => {
						console.log(err);
						this.loader = false;
						this.notyf2.alert('Echec de création, vous avez des champs invalides');
					}
				);
			}
		}
	}

	cancelOperation() {
		if (this.knownEmployee) {
			this.manageTasks(this.employee);
		} else {
			this.router.navigate(['task/list']);
		}
	}

	redirectTaskList() {
		if (this.knownEmployee) {
            this.router.navigate(['/employee/' + this.idParamEmployee + '/tasks']);
		} else {
			this.router.navigate(['task/list']);
		}
	}

	getEmployees() {
		this.rhService.getAllEmployeesByCompany()
			.subscribe(employees => {
				this.allEmployees = employees;
			}, err => { })
	}
	getEmployeeById(idEmployee: number) {
		this.rhService.findEmployeeById(idEmployee).subscribe(
			resp => {
				this.employee = resp.body;
			}
		);
	}
	manageTasks(employee: Employee) {
		if (employee) {
			this.router.navigate(['/employee/' + + employee.id + '/tasks']);
		}
	}
	ngOnDestroy(): void {
		this.sub.unsubscribe();
	}

	getTaskById(idTask: number) {
		this.clientService.findTaskById(idTask).subscribe(
			resp => {
				this.task = resp.body;
			}
		);
	}
}
