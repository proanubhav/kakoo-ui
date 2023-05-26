import {Skill} from './skill';
export class Poste {
    id:number;
    description:string;
    name:string;
    salary:number;
    currency:string;
    type:string;
    show:boolean;
    company:string;
    skills:Skill[];
    startedJob:Date;

    constructor(description:string,name:string,salary:number,currency:string,skills:Skill[],type:string,company:string,startedJob:Date){
        this.description=description;
        this.name=name;
        this.salary=salary;
        this.currency=currency;
        this.skills=skills;
        this.type=type;
        this.company=company;
        this.startedJob=startedJob;
    }
}
