import { Component, OnInit } from '@angular/core';
import { Router,ActivatedRoute } from '@angular/router';
import{Test} from '../test';
import{EvaluationService} from '../evaluation.service';
import { PagerService } from '../../candidate/services/pager.service';
declare var require: any;
import {NgbModal, ModalDismissReasons} from '@ng-bootstrap/ng-bootstrap';
import {Overalltest} from '../overalltest';
import {Question} from '../question';
import { Interview } from "../Interview";


@Component({
  selector: 'app-interview-create',
  templateUrl: './interview-create.component.html',
  styleUrls: ['./interview-create.component.scss']
})

export class InterviewCreateComponent implements OnInit {

  private closeResult: string;
  private jwtToken=null;
  private allTests;
  private allItems;
  private interviewName : string;
  private sub : any;  
  public uuid:number;
  private quizzSent:boolean;
  private filter;
  private Notyf = require('notyf');
  private notyf2 = new this.Notyf({
      delay:4000,
      alertIcon: 'fa fa-exclamation-circle',
      confirmIcon: 'fa fa-check-circle'  
    })


  // pager object
  pager: any = {};
  // paged items
  pagedItems: any[];
  quizzSelected : Overalltest;
  questions : Array<Question> = [];
  question : string = "";

  constructor(public route: ActivatedRoute,
    private evalService : EvaluationService,private pagerService: PagerService,private router:Router,
    private modalService: NgbModal) { }

  ngOnInit() {
    this.loadToken();
    if(!this.jwtToken){
      this.router.navigate(['']);
    }
    this.sub = this.route.params.subscribe(params => {
      this.interviewName = params['name'];
    });
    this.getTests();
    this.quizzSent=false;
  }
  loadToken(){
    this.jwtToken=localStorage.getItem('token');
}

onFilterChange(event: any, question) {
  if(event){
    this.questions.push(question);
  }else{
    const index: number = this.questions.indexOf(question);
    if (index !== -1) {
        this.questions.splice(index, 1);
    }
  }
  console.log(this.questions);
}
goQuizzpage(quizz){
  this.router.navigate(['quizz-result/'+quizz.id]);
  console.log(quizz.name);
}

  getTests(){
    this.evalService.getAlltests().subscribe(
      tests=>{
        this.allTests=tests;
        this.allItems=tests;
        console.log(tests)
        this.allItems.reverse();
        for(let u of this.allItems ){

        }
        this.setPage(1);

      }
    );
  }
  setPage(page: number) {
    if (page < 1 || page > this.pager.totalPages) {
        return;
    }
    // get pager object from service
    this.pager = this.pagerService.getPager(this.allItems.length, page);

    // get current page of items
    this.pagedItems = this.allTests.slice(this.pager.startIndex, this.pager.endIndex + 1);
  }

  addQuestion(content){
    this.modalService.open(content, { size: 'lg' }).result.then((result) => {
      this.closeResult = `Closed with: ${result}`;
      if(this.question.length > 0){
        this.insertQuestion(this.question);
      }
      this.question = ""; // question to empty 
    }, (reason) => {
      this.closeResult = `Dismissed ${this.getDismissReason(reason)}`;
    });
  }

  getQuestions(quizz){
    console.log(quizz.tests[0].questions[0]);
  }


  open(content, quizz) {
    this.modalService.open(content, { size: 'lg' }).result.then((result) => {
      this.closeResult = `Closed with: ${result}`;
    }, (reason) => {
      this.closeResult = `Dismissed ${this.getDismissReason(reason)}`;
    });
    this.quizzSelected = new Overalltest(null, null, null ,null);
    this.quizzSelected = quizz; // get the current quizz object to display
    console.log(this.quizzSelected);
  }

  private getDismissReason(reason: any): string {
    if (reason === ModalDismissReasons.ESC) {
      return 'by pressing ESC';
    } else if (reason === ModalDismissReasons.BACKDROP_CLICK) {
      return 'by clicking on a backdrop';
    } else {
      return  `with: ${reason}`;
    }
  }

  insertQuestion(question){
    var q = {
      "id" : 0,
      "description" : null,
      "numQuestion" : 0,
      "questionBody" : question,
      "answers" : []
    };
    this.questions.push(q);
    console.log(this.questions);
  }

  setChecked(question){
    const index: number = this.questions.indexOf(question); 
    return index !== -1 ? true : false;
  }

  remove(question){
    const index: number = this.questions.indexOf(question);
    if (index !== -1) {
        this.questions.splice(index, 1);
    }
  }

  sendInterview(){
    if(this.questions.length > 0){
      var interview = new Interview();
      interview.name = this.interviewName;
      interview.questions = this.questions;

      this.evalService.validateInterview(interview).subscribe(resp=>{
        console.log(resp)
      // this.evaluationService.convocate(resp.body['id'],1193953028).subscribe();
        this.notyf2.confirm('Entretien ajouté avec succès ');
        //this.router.navigate(['quizz/list']); -> navigate to the list of interviews <-
      },err=>{
        console.log(err);
        this.notyf2.alert("Echec d'ajout d'entretien'");
      });
    }else{
      this.notyf2.alert('Un entretien doit avoir au moin une question!!')
    }
  }

}
