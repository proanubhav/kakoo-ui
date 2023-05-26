import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { environment } from '../../assets/environments/environment';


@Injectable()
export class AuthenticationService {
  private apiUrl = environment.apiUrl;


  constructor(private http:HttpClient) { }
  

  login(user){
 return this.http.post(this.apiUrl+'users/login',user,{observe :'response'})
  }









}
