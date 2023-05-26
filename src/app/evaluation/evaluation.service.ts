import { Injectable } from '@angular/core';
import { Http, Response } from "@angular/http";
import 'rxjs/add/operator/map'
import 'rxjs/add/operator/catch';
import { Observable } from "rxjs/Observable";
import { HttpHeaders } from '@angular/common/http';
import {HttpClient, HttpRequest, HttpEvent,HttpHandler} from '@angular/common/http';
import { environment } from '../../assets/environments/environment';
@Injectable()
export class EvaluationService {
  private apiUrl = environment.apiUrl;

  private jwtToken=null;


  constructor(private http: Http,
    private httpClient:HttpClient) { }
  
    loadToken(){
      this.jwtToken=localStorage.getItem('token');
    }
    sendTest(test){
      this.loadToken();
      return this.httpClient.post(this.apiUrl+'overallTests/add',test,{headers:new HttpHeaders({'authorization':this.jwtToken}),observe :'response'})

    }
    getAssessement(id){
      return this.httpClient.get(this.apiUrl+'gAssessements/'+id,{observe :'response'});
    }

    getAlltests() {
      this.loadToken();
      return this.httpClient.get(this.apiUrl+'overallTests/all/byCompany',{ headers:new HttpHeaders({'authorization':this.jwtToken})});
    }

    skipQuestion(id,token,num){
      return this.httpClient.get(this.apiUrl+'tests/'+id+'/'+token+'/'+'skipQuestion?currentQuNum='+num,{observe :'response'})

    }
    getResultQuizz(id){
      return this.httpClient.get(this.apiUrl+'gAssessements/'+id+'/infos',{observe :'response'})
    }
    getNextQuestion(id,token,num){
      return this.httpClient.get(this.apiUrl+'tests/'+id+'/'+token+'/'+'nextQuestion?currentQuNum='+num,{observe :'response'})
    }
    answerQuestion(id,num,token,answers){
      return this.httpClient.post(this.apiUrl+'tests/'+id+'/'+num+'/'+token+'/answer',answers,{observe :'response'})

    }
    getNextTest(token,id,num){
      return this.httpClient.get(this.apiUrl+'overallTests/'+id+'/'+token+'/nextTest?currentQuNum='+num,{observe:'response'});
      //http://localhost:8089/overallTests/ID/TOKEN/nextTest?currentQuNum=55

    }
    validateAll(id,token){
      return this.httpClient.get(this.apiUrl+'gAssessements/'+id+'/'+token+'/validate',{observe:'response'})
    }
    takefTest(id,token){
      return this.httpClient.get(this.apiUrl+'tests/'+id+'/'+token+'/take',{observe :'response'});
    }
    validateTest(token,id){
      return this.httpClient.get(this.apiUrl+'assessements/'+id+'/'+token+'/validate',{observe :'response'})

    }
    //GET /gAssessements/{overallTestId}/{token}/validate
    validateGlobalTest(token,id){
      return this.httpClient.get(this.apiUrl+'gAssessements/'+id+'/'+token+'/validate',{observe :'response'})

    }
    getQuizzResult(id){
      return this.httpClient.get(this.apiUrl+'overallTests/'+id+'/gAssessements',{observe :'response'})
    }
    convocate(test,id){
    this.loadToken();
    return this.httpClient.get(this.apiUrl+'candidates/'+id+'/convocate/'+test)
    }
    getTest(token,id){
     this.loadToken();
     return this.httpClient.get(this.apiUrl+'overallTests/'+id+'/'+token+'/take',{observe :'response'})
    }
    getQuizz(id){
      this.loadToken();
      return this.httpClient.get(this.apiUrl+'overallTests/'+id,{observe :'response'})
    }

    validateInterview(interview){
      this.loadToken();
      return this.httpClient.post(this.apiUrl+'interview/add', interview, {headers:new HttpHeaders({'authorization':this.jwtToken}),observe :'response'})
    }

    getallInterviews(){
      this.loadToken();
      return this.httpClient.get(this.apiUrl+'interviews/all',{observe :'response'})
    }
}

