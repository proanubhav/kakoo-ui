import {Question} from './question';
import {Answer} from './answer';

export class Test {
    id:number;
    /*level:string;
    description:string;
    name:string;*/
    questions:Question[];
    numTest:string;
    testName:string;
    selected:boolean;


    constructor(n:string,q:Question[]){
        //this.description=d;
        this.testName=n;
        this.questions=q;
        //this.level=level;

    }
}
