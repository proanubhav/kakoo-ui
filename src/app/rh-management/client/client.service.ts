import { Injectable } from '@angular/core';
import {environment} from "../../../assets/environments/environment";
import {HttpClient, HttpEvent, HttpHeaders, HttpRequest} from "@angular/common/http";
import {Client} from "./client";
import {Observable} from "rxjs";
import {ContactClient} from "./contact-client";
import {Task} from "./task";

@Injectable()
export class ClientService {

  private apiUrl = environment.apiUrl;
  private jwtToken = null;

  constructor(private httpClient: HttpClient) { }

  loadToken() {
    this.jwtToken = localStorage.getItem('token');
  }

  getAllClients() {
    this.loadToken();
    return this.httpClient.get(this.apiUrl + "clients/all",
      { headers: new HttpHeaders({ 'authorization': this.jwtToken }) });
  }

  saveClient(client: Client) {
    this.loadToken();
    return this.httpClient.post(this.apiUrl + 'clients', client,
      { headers: new HttpHeaders({ 'authorization': this.jwtToken }) });
  }

  pushFileToStorage(file: File, id: number): Observable<HttpEvent<{}>> {
    this.loadToken();

    let formData: FormData = new FormData();
    formData.append('file', file);

    const req = new HttpRequest('POST', this.apiUrl + 'clients/' + id + '/uploadImage', formData,
      { reportProgress: true, responseType: 'text', headers: new HttpHeaders({ 'authorization': this.jwtToken }) });

    return this.httpClient.request(req);
  }

  updateClient(client: Client) {
    this.loadToken();
    return this.httpClient.put(this.apiUrl + 'clients/' + client.id, client,
      { headers: new HttpHeaders({ 'authorization': this.jwtToken }) });
  }

  findClientById(idClient: number) {
    this.loadToken();
    return this.httpClient.get(this.apiUrl + 'clients/' + idClient,
      { headers: new HttpHeaders({ 'authorization': this.jwtToken }), observe: 'response' });
  }

  getAllClientContacts(clientId: number) {
    this.loadToken();
    return this.httpClient.get(this.apiUrl + 'contacts/' + clientId + '/all',
      { headers: new HttpHeaders({ 'authorization': this.jwtToken }) });
  }

  getAllContacts() {
    this.loadToken();
    return this.httpClient.get(this.apiUrl + 'contacts/all',
      { headers: new HttpHeaders({ 'authorization': this.jwtToken }), observe: 'response' });
  }

  saveClientContact(contact: ContactClient) {
    this.loadToken();
    return this.httpClient.post(this.apiUrl + 'contacts', contact,
      { headers: new HttpHeaders({ 'authorization': this.jwtToken }) });
  }

  deleteClientById(clientId: number) {
    this.loadToken();
    return this.httpClient.delete(this.apiUrl + 'clients/' + clientId,
      { headers: new HttpHeaders({ 'authorization': this.jwtToken }) });
  }

  deleteClientContactById(contactId: number) {
    this.loadToken();
    return this.httpClient.delete(this.apiUrl + 'contacts/' + contactId,
      { headers: new HttpHeaders({ 'authorization': this.jwtToken }) });
  }

  findClientContactById(contactId: number) {
    this.loadToken();
    return this.httpClient.get(this.apiUrl + 'contacts/' + contactId,
      { headers: new HttpHeaders({ 'authorization': this.jwtToken }), observe: 'response' });
  }

  updateClientContact(contact: ContactClient) {
    this.loadToken();
    return this.httpClient.put(this.apiUrl + 'contacts/' + contact.id, contact,
      { headers: new HttpHeaders({ 'authorization': this.jwtToken }) });
  }

  saveTask(task: Task) {
    this.loadToken();
    return this.httpClient.post(this.apiUrl + 'tasks', task,
      { headers: new HttpHeaders({ 'authorization': this.jwtToken }) });
  }

  getAllTasks() {
    this.loadToken();
    return this.httpClient.get(this.apiUrl + 'tasks/all',
      { headers: new HttpHeaders({ 'authorization': this.jwtToken }) });
  }

  deleteTaskById(id: number) {
    this.loadToken();
    return this.httpClient.delete(this.apiUrl + 'tasks/' + id, { headers: new HttpHeaders({ 'authorization': this.jwtToken }), observe: 'response' })
  }

  findTaskById(id: number) {
    this.loadToken();
    return this.httpClient.get(this.apiUrl + 'tasks/' + id, { headers: new HttpHeaders({ 'authorization': this.jwtToken }), observe: 'response' })
  }

  updateTask(task: Task) {
    this.loadToken();
    return this.httpClient.put(this.apiUrl + 'tasks/edit/' + task.id, task, { headers: new HttpHeaders({ 'authorization': this.jwtToken }) });
  
  }
}
