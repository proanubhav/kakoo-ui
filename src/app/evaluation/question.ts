import {Answer} from './answer'
export class Question {
    id:number;
    numQuestion:number;
    questionBody :string;
    answers:Answer[];

    constructor(numQuestion:number,enonce:string,answers:Answer[]){
        this.numQuestion=this.numQuestion;
        this.questionBody=enonce;
        this.answers=answers;
    }
}
