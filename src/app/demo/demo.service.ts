import { Injectable } from '@angular/core';
import { environment } from '../../assets/environments/environment';
import { Http, Response } from "@angular/http";
import { HttpClient, HttpRequest, HttpEvent, HttpHandler, HttpParams } from '@angular/common/http';
import { HttpHeaders } from '@angular/common/http';
import { UserDemo } from "./userDemo";
import { Observable } from "rxjs/Observable";
@Injectable()
export class DemoService {
    private apiUrl = environment.apiUrl;
    private jwtToken = null;

    constructor(private http: Http,
        private httpClient: HttpClient) { }

    askForDemo(userDemo: UserDemo): Observable<boolean> {
        this.loadToken();
        const url = `${this.apiUrl + 'demo/askForDemo/'}`;
        return this.httpClient.post<boolean>(url, userDemo, { headers: new HttpHeaders({ 'Content-Type': 'application/json' }) });
    }
    //loading Json web token
    loadToken() {
        this.jwtToken = localStorage.getItem('token');
    }

    sendCodeValidation(userDemo: UserDemo): Observable<boolean> {
        this.loadToken();
        const url = `${this.apiUrl + 'demo/codeValidation/'}`;
        return this.httpClient.post<boolean>(url, userDemo, { headers: new HttpHeaders({ 'Content-Type': 'application/json' }) });
    }
}