import { Injectable } from '@angular/core';
import { environment } from '../../assets/environments/environment';
import { Http, Response } from "@angular/http";
import { HttpHeaders } from '@angular/common/http';
import { HttpClient, HttpRequest, HttpEvent, HttpHandler, HttpParams } from '@angular/common/http';
import { Observable } from "rxjs/Observable";

@Injectable()
export class ChatbotService {
    private apiUrl = environment.apiUrl;
    private jwtToken = null;
    constructor(private http: Http,
        private httpClient: HttpClient) { }

    //uploading image
    pushFileToStorage(file: File) {
        //console.log("aaaaaaaa");
        //console.log(file);
        this.loadToken();

        let formdata: FormData = new FormData();

        formdata.append('file', file);
        const req = new HttpRequest('POST', this.apiUrl + 'uploadcv2/', formdata, {
            reportProgress: true,
            responseType: 'text',
            headers: new HttpHeaders()

        }
        );

        return this.httpClient.request(req);
    }

    //loading Json web token
    loadToken() {
        this.jwtToken = localStorage.getItem('token');
    }

}
