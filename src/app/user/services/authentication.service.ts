import { Injectable } from '@angular/core';
import { HttpClient, HttpRequest, HttpEvent, HttpHandler, HttpResponse, HttpErrorResponse } from '@angular/common/http';
import { HttpHeaders } from '@angular/common/http';
import { JwtHelper } from 'angular2-jwt';
import { Observable } from "rxjs/Observable";
import { User } from '../../user/user.model';
import { Http, Response, Headers } from "@angular/http";
import { Candidate } from '../../candidate/candidate';
import { environment } from '../../../assets/environments/environment';
import 'rxjs/add/operator/catch';
import 'rxjs/add/observable/throw';
import { TrackedUser } from '../../app.component';




@Injectable()
export class AuthenticationService {

  private apiUrl = environment.apiUrl;
  private jwtToken = null;
  private roles: Array<any>;
  username: string;
  private role: string;



  constructor(private httpClient: HttpClient,
    private http: Http) { }

  loadToken() {
    this.jwtToken = localStorage.getItem('token');
  }

  login(user) {
    return this.httpClient.post(this.apiUrl + 'login', user, { observe: 'response' })
    //.catch(this.errorHandler)
  }
  errorHandler(error: HttpErrorResponse) {
    return Observable.throw("Server Error")
  }
  signup(user, typeoffre): Observable<boolean> {
    return this.httpClient.post<boolean>(this.apiUrl + 'firstUser/?typeoffre=' + typeoffre, user);

    //.map((res:Response) => res.json())
  }
  addRh(user) {
    this.loadToken();
    return this.httpClient.post(this.apiUrl + 'users', user, { headers: new HttpHeaders({ 'authorization': this.jwtToken }), observe: 'response' });
  }
  saveToken(jwt: string) {
    localStorage.setItem('token', jwt);
  }
  confirm(code: string, password: string) {
    return this.httpClient.post(this.apiUrl + 'users/confirm/' + code, password, { observe: 'response' })
  }
  reset(code: string, password: string) {
    return this.httpClient.post(this.apiUrl + 'users/reset/' + code, password, { observe: 'response' })

  }
  changePassword(oldP, newP) {
    return this.httpClient.post(this.apiUrl + 'users/resetConnected?oldPassword=' + oldP, newP, { headers: new HttpHeaders({ 'authorization': this.jwtToken }) })
  }
  addRole(id, role) {
    this.loadToken();
    return this.httpClient.put(this.apiUrl + 'users/' + id + '/addRole', role, { headers: new HttpHeaders({ 'authorization': this.jwtToken }), observe: 'response' })
  }
  saveCandidate(candidate: Candidate) {
    this.loadToken();
    return this.httpClient.post(this.apiUrl + 'candidates', candidate, { headers: new HttpHeaders({ 'authorization': this.jwtToken }), observe: 'response' })


  }
  disableNotif(id) {
    // GET /users/{userId}/seenNotifs
    return this.httpClient.get(this.apiUrl + 'notifications/' + id, { observe: 'response' });
  }
  getUnseenNotif(id) {
    return this.httpClient.get(this.apiUrl + 'users/' + id + '/unseenNotifs', { observe: 'response' })

  }
  updateCandidate(candidate: Candidate) {
    this.loadToken();
    return this.httpClient.put(this.apiUrl + 'candidates/' + candidate.id, candidate, { headers: new HttpHeaders({ 'authorization': this.jwtToken }), observe: 'response' })
  }
  getConnectedUser() {
    this.loadToken();
    return this.httpClient.get(this.apiUrl + 'users/connectedUser', { headers: new HttpHeaders({ 'authorization': this.jwtToken }), observe: 'response' })
  }
  logout() {
    localStorage.removeItem('token');
  }
  setup(email: string) {
    return this.httpClient.get(this.apiUrl + 'users/forgot?email=' + email, { observe: 'response' })
  }
  getCompanyUsers() {
    return this.httpClient.get(this.apiUrl + 'company/users/all', { headers: new HttpHeaders({ 'authorization': this.jwtToken }) })
  }

  getUserPhoto() {
    this.loadToken();
    return this.httpClient.get(this.apiUrl + 'download/', { headers: new HttpHeaders({ 'authorization': this.jwtToken }) })
    // .map((res:Response) => res.json())
    //.catch((error:any) => Observable.throw(error.json().error || 'Error'));

  }

  getUserByToken(token: string) {
    return this.httpClient.get(this.apiUrl + 'users/byToken/' + token, { observe: 'response' })

  }

  pushFileToStorage(file: File): Observable<HttpEvent<{}>> {
    this.loadToken();
    let formdata: FormData = new FormData();

    formdata.append('file', file);
    const req = new HttpRequest('POST', this.apiUrl + 'users/uploadImage/', formdata, {
      reportProgress: true,
      responseType: 'text',
      headers: new HttpHeaders({ 'authorization': this.jwtToken }
      )

    }
    );

    return this.httpClient.request(req);
  }

  // get info about user
  getTrackedUser() {
    return this.httpClient.get("https://api.db-ip.com/v2/free/self", { observe: 'response' });
  }

  saveTrackedUser(trackedUser: TrackedUser): Observable<boolean> {
    ////console.log(" saveTrackedUser I m here ");
    return this.httpClient.post<boolean>(this.apiUrl + "trackedUser/saveUserIp", trackedUser, { headers: new HttpHeaders({ 'Content-Type': 'application/json' }) });
  }


  deleteRh(user: User): Observable<boolean> {
    const url = `${this.apiUrl + 'users/delete/?email=' + user.email}`;
    return this.httpClient.get<boolean>(url, { headers: new HttpHeaders({ 'Content-Type': 'application/json', 'authorization': this.jwtToken }) });
  }

  activateUser(user: any): Observable<boolean> {
    this.loadToken()
    // const url = `${this.apiUrl + 'users/ActivatedUser/' + user.id}`;
    return this.httpClient.get<boolean>(this.apiUrl + 'users/ActivatedUser/' + user.id, { headers: new HttpHeaders({ 'Content-Type': 'application/json', 'authorization': this.jwtToken }) });
  }

  getActivationLink(email: string): Observable<string> {
    const url = `${this.apiUrl + 'users/getActivationLink/?email=' + email}`;
    return this.httpClient.get<string>(url);
  }

  isEmailExist(email: String): Observable<boolean> {
    const url = `${this.apiUrl + 'users/isEmailExist/?email=' + email}`;
    return this.httpClient.get<boolean>(url);
  }

  isUsernameExist(username: String): Observable<boolean> {
    const url = `${this.apiUrl + 'users/isUsernameExist/?username=' + username}`;
    return this.httpClient.get<boolean>(url);
  }

}
