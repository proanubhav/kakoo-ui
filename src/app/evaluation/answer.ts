export class Answer {
    flagCorrect:boolean;
    id:number;
    name:string;
    selected:boolean;

    constructor(flagCorrect:boolean,name:string){
    this.flagCorrect=flagCorrect;
    this.name=name;
    }
}

