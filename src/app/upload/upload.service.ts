import { Injectable } from '@angular/core';
import { HttpClient, HttpRequest, HttpEvent, HttpHandler } from '@angular/common/http';
import { Observable } from 'rxjs/Observable';
import { HttpClientModule } from '@angular/common/http';
import { HttpModule } from '@angular/http';
import { Candidate } from '../candidate/candidate';
import { Cv } from '../candidate/cv';
import { CandidateService } from '../candidate/candidate.service';
import { HttpHeaders } from '@angular/common/http';
import { environment } from '../../assets/environments/environment';



@Injectable()
export class UploadService {
  private apiUrl = environment.apiUrl;
  private jwtToken = null;

  constructor(private http: HttpClient) { }
  pushFileToStorage(file: File, id: number): Observable<HttpEvent<{}>> {
    this.loadToken();
    let formdata: FormData = new FormData();

    formdata.append('file', file);
    const req = new HttpRequest('POST', this.apiUrl + 'candidates/' + id + '/uploadcv/', formdata, {
      reportProgress: true,
      responseType: 'text',
      headers: new HttpHeaders({ 'authorization': this.jwtToken })
    }
    );

    return this.http.request(req);
  }
  loadToken() {
    this.jwtToken = localStorage.getItem('token');
  }

  getFiles(): Observable<any> {
    return this.http.get('/getallfiles')
  }

  getCountriesAllInfo() {
    return this.http.get(`${this.apiUrl}api/Sovren/countries`, { observe: 'response' });
  }
}
