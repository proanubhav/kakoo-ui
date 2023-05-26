import { Injectable } from '@angular/core';
import { AuthenticationService } from './authentication.service';
import { Headers, Http } from '@angular/http';
import { User } from '../user.model';
import { HttpClient, HttpHeaders } from '@angular/common/http';

import { Observable } from 'rxjs';
import { catchError, map, tap } from 'rxjs/operators';
import { NotificationsService } from 'angular4-notify';
import { environment } from '../../../assets/environments/environment';
import { MyCharge } from '../payment/models/charge.model';
import { of } from 'rxjs/observable/of';

@Injectable()
export class PaymentService {
  private apiUrl = environment.apiUrl;
  idSubscribed: number;
  companyId: number;
  user: User = new User();
  jwtToken: string;
  email: string;
  loadToken() {
    this.jwtToken = localStorage.getItem('token');
  }
  constructor(
    private authenticationService: AuthenticationService,
    private httpClient: HttpClient,
    private http: Http,
    private notificationsService: NotificationsService,

  ) { }

  private log(message: string) {
    //this.messageService.addMessage('HeroService: ' + message);
  }


  /**
 * Handle Http operation that failed.
 * Let the app continue.
 * @param operation - name of the operation that failed
 * @param result - optional value to return as the observable result
 */
  private handleError<T>(operation = 'operation', result?: T) {
    return (error: any): Observable<T> => {

      // TODO: send the error to remote logging infrastructure
      console.error(error); // log to console instead

      // TODO: better job of transforming error for user consumption
      this.log(`${operation} failed: ${error.message}`);

      // Let the app keep running by returning an empty result.
      return of(result as T);
    };
  }
  chargeCard(charge: MyCharge): Observable<boolean> {

    this.loadToken();
    return this.httpClient.post<boolean>(this.apiUrl + 'payment/charge', charge, { headers: new HttpHeaders({ 'Content-Type': 'application/json', 'authorization': this.jwtToken }) }).pipe(
      tap(_ => this.log("Error chargeCard function")),
      catchError(this.handleError<any>('chargeCard'))
    );
  }


  // check subcription
  checkSubscription(email: string): Observable<boolean> {
    this.loadToken();
    const url = `${this.apiUrl + 'payment/isSubscribed/?email='}${email}`;
    return this.httpClient.get<boolean>(url, { headers: new HttpHeaders({ 'Content-Type': 'application/json', 'authorization': this.jwtToken }) });
  }

  // check subcription
  getNumberOfDays(email: string): Observable<number> {
    this.loadToken();
    const url = `${this.apiUrl + 'payment/getNumberOfdays/?email='}${email}`;
    return this.httpClient.get<number>(url, { headers: new HttpHeaders({ 'Content-Type': 'application/json', 'authorization': this.jwtToken }) });
  }

  // check subcription
  checkPeriodTest(email: string): Observable<boolean> {
    this.loadToken();
    const url = `${this.apiUrl + 'payment/isTestPeriod/?email='}${email}`;
    return this.httpClient.get<boolean>(url, { headers: new HttpHeaders({ 'Content-Type': 'application/json', 'authorization': this.jwtToken }) });
  }  // get subcription
  getSubscription(email: string): Observable<any> {
    this.loadToken();
    const url = `${this.apiUrl + 'payment/getSubscription/'}`;
    return this.httpClient.get<any>(url, { headers: new HttpHeaders({ 'Content-Type': 'application/json', 'authorization': this.jwtToken }) });
  }

  // saveUnsubscription
  saveUnsubscription(email: string, raison: string): Observable<boolean> {
    this.loadToken();
    const url = `${this.apiUrl + 'payment/demandeUnsubscription/?email='}${email}&raison='${raison}`;
    return this.httpClient.get<boolean>(url, { headers: new HttpHeaders({ 'Content-Type': 'application/json', 'authorization': this.jwtToken }) });
  }


  // saveUnsubscription
  unsubscribeUser(token: string): Observable<boolean> {
    const url = `${this.apiUrl + 'payment/unsubscribed/?token='}${token}`;
    return this.httpClient.get<boolean>(url);
  }


  // isUnsubscribed
  inUnsubscribed(email: string): Observable<boolean> {
    this.loadToken();
    const url = `${this.apiUrl + 'payment/isUnsubscribed/?email='}${email}`;
    return this.httpClient.get<boolean>(url, { headers: new HttpHeaders({ 'Content-Type': 'application/json', 'authorization': this.jwtToken }) });
  }

  sendMailRequest(email: string, content: string): Observable<boolean> {
    this.loadToken();
    const url = `${this.apiUrl + 'payment/sendMail/?email='}${email}`;
    return this.httpClient.post<boolean>(url, content, { headers: new HttpHeaders({ 'Content-Type': 'application/json', 'authorization': this.jwtToken }) });

  }
}
