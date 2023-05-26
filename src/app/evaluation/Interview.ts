import { Question } from "./question";

export class Interview{
    id : number;
    name : string;
    questions : Array<Question> = [];
}