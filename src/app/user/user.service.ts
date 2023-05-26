import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import 'rxjs/add/operator/map';
import 'rxjs/add/operator/catch';
import 'rxjs/add/observable/of';
import 'rxjs/add/observable/empty';
import 'rxjs/add/operator/retry';
import { environment } from '../../assets/environments/environment';


@Injectable()
export class UserService {
  private apiUrl = environment.apiUrl;

  constructor(private httpClient: HttpClient) { }

  getCompaniesTypes() {
    return this.httpClient.get(this.apiUrl + 'companies/allTypes', { observe: 'response' })
  }
  getCountries() {
    return this.httpClient.get(this.apiUrl + 'countries', { observe: 'response' })
  }

}
