import { Skill } from './skill';
import { SocialNetwork } from './social-network';
import { Experience } from './experience';
import { Poste } from './poste';
import { Language } from './language';
import { Cv } from './cv';
export class Candidate {


  id: number;
  firstName: string;
  lastName: string;
  email: string;
  address: string;
  CVs: Cv[];
  skills: Skill[];
  languages: Language[];
  socialNetworks: SocialNetwork[];
  actualPoste: Poste;
  desiredPoste: Poste;
  gender: string;
  mobilePhone: string;
  mobilityArea: string;
  uuid: number;
  photo: string;
  photoUrl: string;
  profile: string;
  nExperience: number;
  hrName: string;
  selected: boolean;
  score: number;

  constructor(id: number, firstName: string, lastName: string, email: string, address: string,
    gender: string, mobilePhone: string, mobilityArea: string, profile: string, nExperience: number) {
    this.id = id;
    this.firstName = firstName;
    this.lastName = lastName;
    this.email = email;
    this.address = address;
    this.gender = gender;
    this.mobilePhone = mobilePhone;
    this.mobilityArea = mobilityArea;
    this.profile = profile;
    this.nExperience = nExperience;
    this.score = 9999;

  }
  setScore(score: number) {
    this.score = score;

  }
}