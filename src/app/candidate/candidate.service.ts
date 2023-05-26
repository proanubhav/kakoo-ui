import { Injectable } from '@angular/core';
import { Candidate } from "./candidate";
import { MailCandidate } from "./mail-candidate";
import { Question } from '../evaluation/question';
import { Http, Response } from "@angular/http";
import 'rxjs/add/operator/map'
import 'rxjs/add/operator/catch';
import { Observable } from "rxjs/Observable";
import { Skill } from "./skill";
import { Cv } from "./cv";
import { SocialNetwork } from "./social-network";
import { Poste } from './poste';
import { Language } from './language';
import { HttpHeaders } from '@angular/common/http';
import { HttpClient, HttpRequest, HttpEvent, HttpHandler, HttpParams } from '@angular/common/http';
import { environment } from '../../assets/environments/environment';





@Injectable()
export class CandidateService {

  private apiUrl = environment.apiUrl;

  private jwtToken = null;
  private selectedCandidatsSendMail: Array<Number> = [];
  constructor(private http: Http,
    private httpClient: HttpClient) { }


  //find all candidates
  findAll(): Observable<Candidate[]> {
    return this.http.get(this.apiUrl + 'candidates/all')
      .map((res: Response) => res.json())
      .catch((error: any) => Observable.throw(error.json().error || 'Server error'));
  }
  getCandidates() {
    this.loadToken();
    return this.httpClient.get(this.apiUrl + "candidates/all", { headers: new HttpHeaders({ 'authorization': this.jwtToken }) });
  }
  //loading Json web token
  loadToken() {
    this.jwtToken = localStorage.getItem('token');
  }


  //find candidate by ID
  findById(id: number) {
    this.loadToken();
    return this.httpClient.get(this.apiUrl + 'candidates/' + id, { headers: new HttpHeaders({ 'authorization': this.jwtToken }), observe: 'response' })
    // .map((res:Response) => res.json())
    // .catch((error:any) => Observable.throw(error.json().error || 'Error'));
  }
  getPhoto(id: number) {
    return this.httpClient.get(this.apiUrl + 'candidates/' + id + '/getPhoto', { headers: new HttpHeaders({ 'authorization': this.jwtToken }), observe: 'response' })
  }
  getSkills() {
    return this.httpClient.get(this.apiUrl + 'skills', { observe: 'response' })
  }
  getlanguages() {
    return this.httpClient.get(this.apiUrl + 'languages', { observe: 'response' })
  }
  getCurrencies() {
    return this.httpClient.get(this.apiUrl + 'currencies', { observe: 'response' })
  }

  /* findByUuid2(uuid:number):Observable<Candidate>{
     console.log("id-->>>",uuid);
     return this.http.get(this.apiUrl + '/candidates/findcandidateByUuid/' + uuid)
       .map((res:Response) => res.json())
       .catch((error:any) => Observable.throw(error.json().error || 'Error'));

   }*/

  findByUuid(uuid: number) {
    // console.log("id-->>>",uuid);
    this.loadToken();
    return this.httpClient.get(this.apiUrl + 'candidates/findcandidateByUuid/' + uuid, { headers: new HttpHeaders({ 'authorization': this.jwtToken }), observe: 'response' })
    //.map((res:Response) => res.json())
    //.catch((error:any) => Observable.throw(error.json().error || 'Error'));

  }
  //uploading image
  pushFileToStorage(file: File, id: number): Observable<HttpEvent<{}>> {
    this.loadToken();
    let formdata: FormData = new FormData();

    formdata.append('file', file);

    const req = new HttpRequest('POST', this.apiUrl + 'candidates/' + id + '/uploadImage/', formdata, {
      reportProgress: true,
      responseType: 'text',
      headers: new HttpHeaders({ 'authorization': this.jwtToken })

    }
    );

    return this.httpClient.request(req);
  }
  /*sendMail2(file: File, mailCandidate: MailCandidate): Observable<HttpEvent<{}>> {
    this.loadToken();
    console.log(mailCandidate.idCandidate);
    let formdata: FormData = new FormData();

    formdata.append('file', file);
    formdata.append('test',mailCandidate.rhMail.toString());
    const req = new HttpRequest('POST', this.apiUrl + 'candidates/' + mailCandidate.idCandidate + '/uploadfile/', formdata, {
      reportProgress: true,
      responseType: 'text',
      headers: new HttpHeaders({ 'authorization': this.jwtToken })

    }
    );

    return this.httpClient.request(req);
  }
  */
  findByName(name: string) {
    this.loadToken();
    return this.httpClient.get(this.apiUrl + 'candidates/search/byName/' + name, { headers: new HttpHeaders({ 'authorization': this.jwtToken }) });

  }
  findByNameAndSkill(name: string) {
    this.loadToken();
    return this.httpClient.get(this.apiUrl + 'candidates/search/byNameSkill/' + name, { headers: new HttpHeaders({ 'authorization': this.jwtToken }) });

  }
  findByPosition(job: string): Observable<Candidate[]> {
    //console.log("id-->>>",job);
    return this.http.get(this.apiUrl + 'candidates/search/byDesiredPoste/' + job)
      .map((res: Response) => res.json())
      .catch((error: any) => Observable.throw(error.json().error || 'Error'));

  }
  findBysalary(min: number, max: number) {
    this.loadToken();
    if (!min) min = 0;
    if (!max) max = 0;

    return this.httpClient.get(this.apiUrl + 'candidates/search/ByDesiredSalary/' + min + '/' + max, { headers: new HttpHeaders({ 'authorization': this.jwtToken }) })
    // .map((res:Response) => res.json())
    //.catch((error:any) => Observable.throw(error.json().error || 'Error'));

  }
  findBySkills(tech: string) {
    this.loadToken();
    //console.log("id-->>>",tech);
    return this.httpClient.get(this.apiUrl + 'candidates/search/BySkill/' + tech, { headers: new HttpHeaders({ 'authorization': this.jwtToken }) })


  }
  advancedsearching(name, mobility, skill, nExperience, evaluation, min, max, current, desired) {
    this.loadToken();
    return this.httpClient.get(this.apiUrl + 'candidates/search/AdvancedSearch/' + name + '/' + mobility + '/' + skill
      + '/' + nExperience + '/' + evaluation + '/' + max + '/' + min + '/' + current + '/' + desired, { headers: new HttpHeaders({ 'authorization': this.jwtToken }) })
  }
  advancedsearching2(name, mobility, skill, nExperience, evaluation, min, max, current, desired) {
    this.loadToken();
    return this.httpClient.get(this.apiUrl + 'candidates/search2/AdvancedSearch/' + name + '/' + mobility + '/' + skill
      + '/' + nExperience + '/' + evaluation + '/' + max + '/' + min + '/' + current + '/' + desired, { headers: new HttpHeaders({ 'authorization': this.jwtToken }) })
  }
  //find candidates by advanced research
  findAdvanced(name: string, mobility: string, skill: string, salary: number, current: string, desired: string) {
    return this.http.get(this.apiUrl + 'candidates/search/AdvancedSearch/' + name + '/' + mobility + '/' + skill + '/' + salary + '/' + current + '/' + desired)
      .map((res: Response) => res.json())
      .catch((error: any) => Observable.throw(error.json().error || 'Error'));


  }


  //update candidate by ID
  updateCandidate(candidate: Candidate): Observable<Candidate> {

    return this.http.put(this.apiUrl + 'candidates/' + candidate.id, candidate)
      // .map((res:Response) => res.json())
      .catch((error: any) => Observable.throw(error.json().error || 'Server error'));
  }
  //find all skills of a candidate
  findAllSkills(id: number): Observable<Candidate> {
    return this.http.get(this.apiUrl + 'candidates/' + id + '/allSkills')
      .map((res: Response) => res.json())
      .catch((error: any) => Observable.throw(error.json().error || 'Error'));
  }

  deleteCandidateById(id: number) {
    this.loadToken();
    return this.httpClient.delete(this.apiUrl + 'candidates/' + id, { headers: new HttpHeaders({ 'authorization': this.jwtToken }), observe: 'response' })
    //.map((res:Response) => res.json())
    //.catch((error:any) => Observable.throw(error.json().error || 'Server error'));
  }
  addSkillById(id: number, skill: Skill) {
    this.loadToken();
    return this.httpClient.put(this.apiUrl + 'candidates/' + id + '/addSkill', skill, { headers: new HttpHeaders({ 'authorization': this.jwtToken }), observe: 'response' })
    // .catch((error:any)=> Observable.throw(error.json().error || 'Server error'));


  }

  saveCandidate(candidate: Candidate): Observable<Candidate> {
    return this.http.post(this.apiUrl + 'candidates', candidate)
      // .map((res:Response) => res.json())
      .catch((error: any) => Observable.throw(error.json().error || 'Server error'));

  }

  getCvById(id: number) {
    this.loadToken();
    return this.httpClient.get(this.apiUrl + 'download/' + id, { headers: new HttpHeaders({ 'authorization': this.jwtToken }) })
    // .map((res:Response) => res.json())
    //.catch((error:any) => Observable.throw(error.json().error || 'Error'));

  }

  addLanguageById(id: number, language: Language) {
    this.loadToken();
    return this.httpClient.put(this.apiUrl + 'candidates/' + id + '/addLanguage', language, { headers: new HttpHeaders({ 'authorization': this.jwtToken }), observe: 'response' })
    //.catch((error:any)=> Observable.throw(error.json().error || 'Server error'));

  }
  addSocialNetworkById(id: number, socialNetwork: SocialNetwork) {
    this.loadToken();
    return this.httpClient.put(this.apiUrl + 'candidates/' + id + '/addSocialNetwork', socialNetwork, { headers: new HttpHeaders({ 'authorization': this.jwtToken }), observe: 'response' })
    //.catch((error:any)=> Observable.throw(error.json().error || 'Server error'));

  }
  addCurrentPositionById(id: number, poste: Poste) {
    this.loadToken();
    return this.httpClient.put(this.apiUrl + 'candidates/' + id + '/addActualPoste', poste, { headers: new HttpHeaders({ 'authorization': this.jwtToken }), observe: 'response' })

  }
  addDesiredPositionById(id: number, poste: Poste) {
    this.loadToken();
    return this.httpClient.put(this.apiUrl + 'candidates/' + id + '/addDesiredPoste', poste, { headers: new HttpHeaders({ 'authorization': this.jwtToken }), observe: 'response' })

  }
  deleteSocialNetworkById(id: number) {
    this.loadToken();
    return this.httpClient.delete(this.apiUrl + 'socialNetworks/removeSocialNetwork/' + id, { headers: new HttpHeaders({ 'authorization': this.jwtToken }), observe: 'response' })

  }
  convocate(test, id) {
    this.loadToken();
    return this.httpClient.get(this.apiUrl + 'candidates/' + id + '/convocate/' + test)
  }
  listeningToMarket(id: number, content: string) {
    this.loadToken();
    /*    console.log(content);
      const url = `${this.apiUrl + 'candidates/sendMail/?id='}${id}`;
      return this.httpClient.post<boolean>(url, content, { headers: new HttpHeaders({ 'Content-Type': 'application/json', 'authorization': this.jwtToken }) });
  */
    return this.httpClient.get(this.apiUrl + 'candidates/' + id + '/listeningToMarket/' + content, { headers: new HttpHeaders({ 'authorization': this.jwtToken }), observe: 'response' })
  }
  sendMailRequest(mailCandidate: MailCandidate): Observable<boolean> {
    console.log(mailCandidate);
    this.loadToken();
    const url = `${this.apiUrl + 'candidates/sendMail/'}`;
    return this.httpClient.post<boolean>(url, mailCandidate, { headers: new HttpHeaders({ 'Content-Type': 'application/json', 'authorization': this.jwtToken }) });

  }
  deleteSkillById(id: number, candidateId: number) {
    this.loadToken();
    return this.httpClient.delete(this.apiUrl + 'skills/removeSkill/' + id, { headers: new HttpHeaders({ 'authorization': this.jwtToken }), observe: 'response' })

  }
  deleteLanguageById(id: number, candidateId) {
    this.loadToken();
    return this.httpClient.delete(this.apiUrl + 'languages/removeLanguageById/' + id, { headers: new HttpHeaders({ 'authorization': this.jwtToken }), observe: 'response' })

  }
  deleteCvById(id: number) {
    this.loadToken();
    return this.httpClient.delete(this.apiUrl + 'cVs/removeCv/' + id, { headers: new HttpHeaders({ 'authorization': this.jwtToken }), observe: 'response' })

  }

  pushVideotoServer(formdata: FormData, candidateId: number, questionId: number) {
    this.loadToken();
    const req = new HttpRequest('POST', this.apiUrl + 'candidate/' + candidateId + '/uploadInterview/' + questionId, formdata, {
      reportProgress: true,
      responseType: 'text'
     // headers: new HttpHeaders({ 'authorization': this.jwtToken })
    });

    return this.httpClient.request(req);
  }

  convocateInterview(candidateId, interviewid) {
    this.loadToken();
    return this.httpClient.get(this.apiUrl + 'candidate/' + candidateId + '/convocate/interview/' + interviewid);
  }

  getInterviewQuestions(interviewId): Observable<Question[]> {
    //this.loadToken();
    return this.http.get(this.apiUrl + 'candidate/interview/' + interviewId)
      .map((res: Response) => res.json())
      .catch((error: any) => Observable.throw(error.json().error || 'Server error'));
  }

  getVideos(candidateId) {
    this.loadToken();
    return this.http.get(this.apiUrl + 'candidate/videos/' + candidateId)
      .map((res: Response) => res.json())
      .catch((error: any) => Observable.throw(error.json().error || 'Server error'));
  }

  notifyCreator(candidateId, interviewId) {
    this.loadToken();
    return this.httpClient.get(this.apiUrl + 'candidate/' + candidateId + '/interview/' + interviewId + '/notify');
    //return this.httpClient.get(this.apiUrl + 'interview/notify/' + candidateId, { headers: new HttpHeaders({ 'authorization': this.jwtToken }), observe: 'response' })
  }


  getGAssessementsByCandidate(id: number) {
    this.loadToken();
    return this.httpClient.get(this.apiUrl + 'candidates/' + id + '/gAssessements', { headers: new HttpHeaders({ 'authorization': this.jwtToken }), observe: 'response' })
    // .map((res:Response) => res.json())
    //.catch((error:any) => Observable.throw(error.json().error || 'Error'));
  }

  // beggin Api Sovren
  parsecv(id: number) {
    this.loadToken();
    const url = `${this.apiUrl + 'api/Sovren/'}${id}`;
    return this.httpClient.get(url, { headers: new HttpHeaders({ 'Content-Type': 'application/json', 'authorization': this.jwtToken }), observe: 'response' });
  }  // end Api Sovren

  saveSelectedCandidatsSendMail(selectedCandidatsSendMail: any) {

    this.selectedCandidatsSendMail = selectedCandidatsSendMail;
    console.log("I'm here0:" + this.selectedCandidatsSendMail);
  }
  retrieveSelectedCandidatsSendMail() {
    console.log("I'm here :" + this.selectedCandidatsSendMail);
    return this.selectedCandidatsSendMail;
  }

  getAcceptedCandidates() {
    this.loadToken();
    return this.httpClient.get(this.apiUrl + "candidate/allAccepted", { headers: new HttpHeaders({ 'authorization': this.jwtToken }) });
  }

}

