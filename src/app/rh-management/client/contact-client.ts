import {Client} from "./client";

export class ContactClient {

  id: number;
  firstName: string;
  lastName: string;
  gender: string;
  poste: string;
  service: string;
  state: string;
  email: string;
  phone: string;
  address: string;
  postalCode: string;
  city: string;
  country: string;
  hrName: string;
  client: Client;

  constructor(id: number, firstName: string, lastName: string, gender: string, poste: string, service: string, state: string,
              email: string, phone: string, address: string, postalCode: string, city: string, country: string, client: Client) {
    this.id = id;
    this.firstName = firstName;
    this.lastName = lastName;
    this.gender = gender;
    this.poste = poste;
    this.service = service;
    this.state = state;
    this.email = email;
    this.phone =phone;
    this.address = address;
    this.postalCode = postalCode;
    this.city = city;
    this.country = country;
    this.client = client;
  }
}
