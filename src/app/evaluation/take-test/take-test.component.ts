import { Component, OnInit } from '@angular/core';
import { FormControl, FormGroup, Validators, RadioControlValueAccessor, ReactiveFormsModule } from "@angular/forms";
import { ActivatedRoute, Router, NavigationEnd } from '@angular/router';
import { AbstractControl, ValidatorFn } from '@angular/forms';
import { Question } from '../question';
import { Test } from '../test';
import { Answer } from '../answer';
import { EvaluationService } from '../evaluation.service';
import { HttpClient, HttpResponse, HttpEventType } from '@angular/common/http';



import 'notyf/dist/notyf.min.css';
declare var require: any;

@Component({
  selector: 'app-take-test',
  templateUrl: './take-test.component.html',
  styleUrls: ['./take-test.component.scss']
})
export class TakeTestComponent implements OnInit {
  private minid: number;
  private token;
  private numQuest;
  private partName;
  private partNum;
  private code;
  private sub: any;
  private id: number;
  private questions;
  private answers: Answer[];
  private canAnswers;
  startTest: boolean;
  private quizzName;
  private quizzExperience;
  private quizzSkills;
  private quizzId: number;
  private index: number;
  private questionProgress: number;
  private checked;
  private filter;
  private partid;
  public quizzEnd: boolean;
  private bascule: boolean;
  seconds: number;
  timer;
  qnProgress: number;
  bgColor: string;
  fgColor: string;

  private Notyf = require('notyf');
  private notyf2 = new this.Notyf({
    delay: 8000,
    alertIcon: 'fa fa-exclamation-circle',
    confirmIcon: 'fa fa-check-circle'
  })


  constructor(public route: ActivatedRoute, private evaluationService: EvaluationService, private router: Router, private http: HttpClient) {
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
    this.questionProgress = 0;
    this.bascule = false;
    this.quizzEnd = false;
    this.index = 1;
    this.questions = [];
    this.answers = [];
    this.canAnswers = [];
    this.sub = this.route.params.subscribe(params => {
      this.code = params['code'];
      this.token = params['token'];
    });
    this.getQuizz();
    this.startTest = false;
    this.seconds = 0;
    this.qnProgress = 0;


  }

  displayTimeElapsed() {
    var a = Math.floor(this.seconds / 3600);
    var b = Math.floor(this.seconds / 60);
    var c = Math.floor(this.seconds % 60);
    return '' + a + ' : ' + b + ' : ' + c;
  }

  onFilterChange(eve: any, answer) {
    console.log('test')
    answer.selected = !answer.selected;
    console.log(answer.selected)
  }

  answerQuestion() {
    this.canAnswers = [];
    for (let i = 0; i <= this.answers.length; i++) {
      if (this.answers[i] && this.answers[i].selected) {
        this.canAnswers.push(this.answers[i])
      }

    }
    this.evaluationService.answerQuestion(this.minid, this.numQuest, this.token, this.canAnswers).subscribe(
      resp => {
        console.log(resp);
      });
    this.getNextQuestion();

  }
  getNextQuestion() {
    this.evaluationService.getNextQuestion(this.minid, this.token, this.numQuest).subscribe(resp => {
      console.log('question statuss  ' + resp.status);
      console.log(resp);
      if (resp.body) {
        console.log("baaaaaaaaaaaaaaaa");
        this.index++;
        this.numQuest = resp.body['numQuestion']
        this.questions[this.index - 1] = resp.body['questionBody'];
        console.log("Question is : " + this.questions[this.index - 1]);
        this.answers = resp.body['answers'];
        //console.log('answers')
        //console.log(this.answers)
        this.canAnswers = [];
        this.seconds = 0;
        this.qnProgress = 0;
      }
      else {
        console.log('THAT WAS THE LAST ONEEE ' + resp.body);
        console.log(resp);
        this.validatetest(this.minid);
        console.log("wait here");
        this.seconds = 0;
        clearInterval(this.timer);
        this.getNextTest();

      }
    }, err => {
      console.log(err);
    })
  }
  getNextTest() {
    this.evaluationService.getNextTest(this.token, this.quizzId, this.partNum).subscribe(resp => {
      console.log('next test');
      console.log(resp)
      if (resp.body != null) {
        //console.log('exist test ');
        this.index = 1;
        this.partNum = this.partName = resp.body['numTest'];
        this.partName = this.partName = resp.body['testName'];
        this.minid = resp.body['id'];
        this.evaluationService.takefTest(resp.body['id'], this.token).subscribe(resp => {
          //console.log('NEXTTTTTTTTTTTTTTTTTTTTTTTT'+resp.body['numQuestion'])
          this.numQuest = resp.body['numQuestion'];
          //console.log(this.numQuest)
          this.questions[this.index - 1] = resp.body['questionBody'];
          //console.log('answers ')
          //console.log(this.answers)
          this.answers = resp.body['answers'];

          this.timer = setInterval(() => {
            if (this.seconds < 60) {
              this.seconds++;
              //this.questionProgress=Math.floor(this.seconds / 20)*100;
              this.questionProgress = 100 * (this.seconds / 60)
              // console.log('prog')
              //  console.log(this.questionProgress)
            }
            else {
              this.answerQuestion();
              return;
            }
          }, 1000);
        });
      }
      else {
        this.quizzEnd = true;
        clearInterval(this.timer)
        //console.log('test termineé')
        this.validateAll(this.quizzId, this.token);
      }
    });
  }
  validateAll(id, token) {
    this.evaluationService.validateAll(id, token).subscribe(resp => {
      //console.log(resp);
      console.log('VALIDATEDDDDDDDD')
    })
  }
  validatetest(minid) {
    this.evaluationService.validateTest(this.token, minid).subscribe(resp => {
      console.log('minintest valid')
      console.log(resp);
      //this.notyf2.confirm("Merci d'avoir passé ce quizz , on vous communiquera votre résultat le plus proche possible");
      //this.router.navigate([''])
      // this.evaluationService.validateGlobalTest(this.token,this.code).subscribe();
      //console.log(resp);
    })

  }
  checkAnswer(answr) {
    //console.log('check answer is')
    //console.log(answr['name']);
  }

  getTest() {
    console.log('step 111111')
    this.evaluationService.getTest(this.token, this.code).subscribe(resp => {
      //console.log('tESSSSSST')
      console.log('step 2222')
      //console.log(resp)
      if (!resp.body) {
        console.log(resp)
      }
      if (resp.body) {
        console.log('step 333')

        this.startTest = true;
        this.partNum = resp.body['numTest'];
        this.partName = resp.body['testName'];
        this.minid = resp.body['id'];
        this.evaluationService.takefTest(resp.body['id'], this.token).subscribe(resp => {
          //console.log(resp)
          this.partid = resp.body['id'];
          this.numQuest = resp.body['numQuestion'];
          this.questions[this.index - 1] = resp.body['questionBody'];
          //console.log('answers ')
          //console.log(this.answers)
          this.answers = resp.body['answers'];
        });

        this.timer = setInterval(() => {
          if (this.seconds < 60) {
            this.seconds++;
            //this.questionProgress=Math.floor(this.seconds / 20)*100;
            this.questionProgress = 100 * (this.seconds / 60)
            // console.log('prog')
            //  console.log(this.questionProgress)
          }
          else {
            this.answerQuestion();
            return;
          }
        }, 1000);
      }
    }, err => {
      console.log(err);
      this.notyf2.alert("Vous n'avez pas le droit d'accéder à ce quizz");
    });
  }
  skipQuestion() {
    // this.evaluationService.getNextQuestion(this.minid, this.token,this.numQuest).subscribe(resp=>{
    //   // console.log(resp);


    //  });
    this.getNextQuestion();
  }
  getQuizz() {
    this.evaluationService.getQuizz(this.code).subscribe(resp => {
      //console.log('partie 111')
      //console.log(resp)
      this.quizzId = resp.body['id'];
      this.quizzExperience = resp.body['level'];
      this.quizzSkills = resp.body['description'];
      this.quizzName = resp.body['name'];

    })
  }

}
