export class Client {

  id: number;
  name: string;
  activityArea: string;
  description: string;
  state: string;
  webSite: string;
  phone: string;
  email: string;
  locality: string;
  photo: string;
  photoUrl: string;
  selected: boolean;
  hrName: string;

  constructor(id: number);
  constructor(id: number, name: string, activityArea: string, description: string, state: string, webSite: string, phone: string,
              email: string, locality: string);
    constructor(id?: number, name?: string, activityArea?: string, description?: string, state?: string, webSite?: string, phone?: string,
              email?: string, locality?: string) {
    this.id = id;
    this.name = name;
    this.activityArea = activityArea;
    this.description = description;
    this.state = state;
    this.webSite = webSite;
    this.phone = phone;
    this.email = email;
    this.locality = locality;
  }

}
