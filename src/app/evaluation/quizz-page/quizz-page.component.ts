import { Component, OnInit } from '@angular/core';
import {FormControl, FormGroup, Validators,RadioControlValueAccessor,ReactiveFormsModule} from "@angular/forms";
import {ActivatedRoute, Router, NavigationEnd} from '@angular/router';
import { AbstractControl, ValidatorFn } from '@angular/forms';
import {Question} from '../question';
import {Test} from '../test';
import{Answer} from '../answer';
import {EvaluationService} from '../evaluation.service';
import { HttpClient, HttpResponse, HttpEventType } from '@angular/common/http';

@Component({
  selector: 'app-quizz-page',
  templateUrl: './quizz-page.component.html',
  styleUrls: ['./quizz-page.component.scss']
})
export class QuizzPageComponent implements OnInit {
  private sub:any;
  private quizzid:number;
  private items;
  private assessements=[];
  private parts=[[]];
  private questions=[];
  private nquestion=[];
  private answers :Answer[]=[];
  public tests:Test[]=[];
  private parties;
 

  constructor(public route: ActivatedRoute,private evaluationService:EvaluationService,private router:Router, private http: HttpClient) { 
    router.events.subscribe(s => {
      if (s instanceof NavigationEnd) {
        const tree = router.parseUrl(router.url);
        if (tree.fragment) {
          const element = document.querySelector("#" + tree.fragment);
          if (element) { element.scrollIntoView(true); }
        }
      }
    });
  }

  ngOnInit() {
    //this.parties=[];
   
    this.sub = this.route.params.subscribe(params => {
      this.quizzid = params['quizzid'];
      this.getQuizzResult(this.quizzid);
      
    });
  }
  redirectNewQuizz(){
    this.router.navigate(['quizz/create']);
  }
  getQuizzResult(id){
    this.evaluationService.getResultQuizz(id).subscribe(resp=>{
      console.log(resp)
      this.parties=resp.body;
      console.log(this.parties)
      for (let partie in this.parties){
        console.log('partiee')
        console.log(partie['nQuestions'])
        console.log(partie['score'])
      }
    })
  }
 
}
