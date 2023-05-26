export class Arret {

  id: number;
  date_d: Date;
  duree: number;
  type_arret: string;

  constructor(id: number, date_d: Date, duree: number, type_arret: string) {
    this.id = id;
    this.date_d = date_d;
    this.duree = duree;
    this.type_arret = type_arret;
  }
  
}
