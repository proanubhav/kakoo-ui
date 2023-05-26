import { Skill } from './skill';
// import { SocialNetwork } from './social-network';
import { Experience } from './experience';
// import { Poste } from './poste';
// import { Language } from './language';
import { Cv } from './cv';
import { Service } from './service';

export class Employee {

  id: number;
  matricule: string;
  firstName: string;
  lastName: string;
  email: string;
  address: string;
  CVs: Cv[];
  skills: Skill[];
  experience: Experience;
  service: Service;
  gender: string;
  phone: string;
  familySituation: string;
  childrenNbr: number;
  salary: string;
  uuid: number;
  photo: string;
  photoUrl: string;
  profile: string;
  experienceNbr: number;
  hrName: string;
  selected: boolean;
  username: string;

  constructor(id: number);
  constructor(id: number, matricule: string, firstName: string, lastName: string, familySituation: string, childrenNbr: number,   phone: string, email: string, address: string,
    gender: string, experienceNbr: number, username: string, salary: string, profile: string, service: Service);
  constructor(id?: number, matricule?: string, firstName?: string, lastName?: string, 
    familySituation?: string, childrenNbr?: number,   phone?: string, email?: string, 
    address?: string,
    gender?: string, experienceNbr?: number, username?: string, salary?: string, 
    profile?: string, service?: Service) {
    this.id = id;
    this.firstName = firstName;
    this.lastName = lastName;
    this.email = email;
    this.address = address;
    this.gender = gender;
    this.experienceNbr = experienceNbr;
    this.phone = phone;
    this.username = username;
    this.familySituation = familySituation;
    this.childrenNbr = childrenNbr;
    this.matricule = matricule;
    this.salary = salary;
    this.profile = profile;
    this.service = service;
  }
}
