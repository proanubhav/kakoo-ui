import { Injectable } from '@angular/core';
import { Employee } from "./employee";
import { environment } from '../../assets/environments/environment';
import { HttpHeaders } from '@angular/common/http';
import { Http } from '@angular/http';
import { HttpClient, HttpRequest, HttpEvent, HttpHandler, HttpParams } from '@angular/common/http';
import { Router } from '@angular/router';
import { Observable } from "rxjs";
import { Timesheet } from './timesheet';

@Injectable()
export class RhManagementService {
    private apiUrl = environment.apiUrl;

    private jwtToken = null;

    constructor(private http: Http, private httpClient: HttpClient, private router: Router) { }
    loadToken() {
        this.jwtToken = localStorage.getItem('token');
    }
    getAllEmployees() {
        this.loadToken();
        return this.httpClient.get(this.apiUrl + "employees/all", { headers: new HttpHeaders({ 'authorization': this.jwtToken }) });
    }

    getAllEmployeesByCompany() {
        this.loadToken();
        return this.httpClient.get(this.apiUrl + "myCompany/employees/all", { headers: new HttpHeaders({ 'authorization': this.jwtToken }) });
    }
    //uploading image
    pushFileToStorage(file: File, id: number): Observable<HttpEvent<{}>> {
        this.loadToken();
        let formData: FormData = new FormData();

        formData.append('file', file);

        const req = new HttpRequest('POST', this.apiUrl + 'employees/' + id + '/uploadImage/', formData, {
            reportProgress: true,
            responseType: 'text',
            headers: new HttpHeaders({ 'authorization': this.jwtToken })

        }
        );

        return this.httpClient.request(req);
    }

    saveEmployee(employee: Employee) {
        this.loadToken();
        return this.httpClient.post(this.apiUrl + 'employees', employee, { headers: new HttpHeaders({ 'authorization': this.jwtToken }), observe: 'response' })
    }
    updateEmployee(employee: Employee) {
        this.loadToken();
        return this.httpClient.put(this.apiUrl + 'employees/' + employee.id, employee, { headers: new HttpHeaders({ 'authorization': this.jwtToken }), observe: 'response' })
    }

    findEmployeeById(id: number) {
        this.loadToken();
        return this.httpClient.get(this.apiUrl + 'employees/' + id, { headers: new HttpHeaders({ 'authorization': this.jwtToken }), observe: 'response' });
    }

    deleteEmployeeById(id: number) {
        this.loadToken();
        return this.httpClient.delete(this.apiUrl + 'employees/' + id, { headers: new HttpHeaders({ 'authorization': this.jwtToken }), observe: 'response' });
    }

    findByName(name: string) {
        this.loadToken();
        return this.httpClient.get(this.apiUrl + "employees/search/byName/" + name, { headers: new HttpHeaders({ 'authorization': this.jwtToken }) });
    }

    advancedSearching(name, matricule, service, experienceNbr, profile, recruitmentDate, salaryMin, salaryMax) {
        this.loadToken();
        return this.httpClient.get(this.apiUrl + 'employees/search/advancedSearch/' + name + '/' + matricule + '/' + service + '/' +
            experienceNbr + '/' + profile + '/' + recruitmentDate + '/' + salaryMin + '/' + salaryMax,
            { headers: new HttpHeaders({ 'authorization': this.jwtToken }) });
    }

    getEmployeeByToken(token: string) {
        return this.httpClient.get(this.apiUrl + 'employees/byToken/' + token, { observe: 'response' });
    }

    confirmRegistration(token: string, password: string) {
        return this.httpClient.post(this.apiUrl + 'employees/confirm/' + token, password,
            { observe: 'response' });
    }

    getEmployeeTasks(id: number) : Observable<any>{
        this.loadToken();
        return this.httpClient.get(this.apiUrl + 'employee/' + id + '/tasks' ,{ headers: new HttpHeaders({ 'authorization': this.jwtToken }) });

    }

    getEmployeeTimeSheets(id: number) : Observable<any> {
        this.loadToken();
        return this.httpClient.get(this.apiUrl + 'timesheets/' + id  ,{ headers: new HttpHeaders({ 'authorization': this.jwtToken }) });

    }

    saveEmployeeTimeSheet(timesheet: Object) : Observable<Object> {
        this.loadToken();
        return this.httpClient.post(this.apiUrl + 'timesheets', timesheet, { headers: new HttpHeaders({ 'authorization': this.jwtToken }), observe: 'response' })
    }

    deleteTimeSheetById(id : number) {
        this.loadToken();
        return this.httpClient.delete(this.apiUrl + 'timesheets/delete/' + id, { headers: new HttpHeaders({ 'authorization': this.jwtToken }), observe: 'response' });
    }

    validateMonthTimeSheets(id: number, month: string, isAdmin: boolean, validate : boolean) {
        this.loadToken();
        return this.httpClient.put(this.apiUrl + 'timesheets/employee/' + id + '/validate/' + month + '/isAdmin=' + isAdmin + '/validate=' + validate, { headers: new HttpHeaders({ 'authorization': this.jwtToken }), observe: 'response' })
    }

    isValidatedByEmp(idEmp: number, month: string) {
        this.loadToken();
        return this.httpClient.get(this.apiUrl + 'timesheet/isValidatedByEmp/' + idEmp + '/' + month ,{ headers: new HttpHeaders({ 'authorization': this.jwtToken }) });
    }
    
    refuseTimesheet(timesheet: Timesheet) {
        this.loadToken();
        return this.httpClient.put(this.apiUrl + 'timesheets/refuse/' + timesheet.id, timesheet, { headers: new HttpHeaders({ 'authorization': this.jwtToken }), observe: 'response' })
    }

    updateTimesheet(timesheet: Timesheet) {
        this.loadToken();
        return this.httpClient.put(this.apiUrl + 'timesheets/update/' + timesheet.id, timesheet, { headers: new HttpHeaders({ 'authorization': this.jwtToken }), observe: 'response' })
    }
}
