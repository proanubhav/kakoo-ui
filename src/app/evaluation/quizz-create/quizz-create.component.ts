import { Component, OnInit } from '@angular/core';
import { FormControl, FormGroup, Validators, RadioControlValueAccessor } from "@angular/forms";
import { ActivatedRoute, Router } from '@angular/router';
import { AbstractControl, ValidatorFn } from '@angular/forms';
import { Question } from '../question';
import { Test } from '../test';
import { Overalltest } from '../overalltest';
import { EvaluationService } from '../evaluation.service';
import { Answer } from '../answer';

import 'notyf/dist/notyf.min.css';
declare var require: any;

@Component({
  selector: 'app-quizz-create',
  templateUrl: './quizz-create.component.html',
  styleUrls: ['./quizz-create.component.scss']
})
export class QuizzCreateComponent implements OnInit {

  dataSource: string[] = ["Expérimenté", "Confirmé", "Débutant", "Intermédiaire"];
  experienceSelected = new FormControl();

  quizzForm: FormGroup;
  testForm: FormGroup;
  partForm: FormGroup;
  index: number;
  interview: string;
  private overalltest;
  part: number;
  myAnswers: Answer[];
  quizzName: string;
  created: boolean;
  quizzDescription: string;
  // changes 
  quizzExperience: string;
  // end changes
  show: boolean[];
  private tests;
  private questions: Question[] = [];
  private Notyf = require('notyf');
  private notyf2 = new this.Notyf({
    delay: 4000,
    alertIcon: 'fa fa-exclamation-circle',
    confirmIcon: 'fa fa-check-circle'
  })


  constructor(private evaluationService: EvaluationService, private router: Router) { }

  ngOnInit() {
    this.show = [];
    this.show[0] = false;;
    this.myAnswers = [];
    this.created = false;
    this.index = 1;
    this.part = 1;
    this.tests = [];
    this.quizzForm = new FormGroup({
      enonce: new FormControl(),
      bchoice1: new FormControl(),
      choice1: new FormControl(),
      bchoice2: new FormControl(),
      choice2: new FormControl(),
      bchoice3: new FormControl(),
      choice3: new FormControl(),
      bchoice4: new FormControl(),
      choice4: new FormControl(),
      bchoice5: new FormControl(),
      choice5: new FormControl(),
      bchoice6: new FormControl(),
      choice6: new FormControl(),
      bchoice7: new FormControl(),
      choice7: new FormControl(),
      bchoice8: new FormControl(),
      choice8: new FormControl(),
      bchoice9: new FormControl(),
      choice9: new FormControl(),
      bchoice10: new FormControl(),
      choice10: new FormControl(),
      bchoice11: new FormControl(),
      choice11: new FormControl(),
      bchoice12: new FormControl(),
      choice12: new FormControl(),
      bchoice13: new FormControl(),
      choice13: new FormControl(),


      //cv: new String();
    });
    this.testForm = new FormGroup({
      name: new FormControl(),
      description: new FormControl(),
      exp: new FormControl()
    });
    this.partForm = new FormGroup({
      name: new FormControl()
    })
  }

  sendQuestion() {
    var answers: Answer[];
    var A1 = new Answer(this.quizzForm.controls['bchoice1'].value, this.quizzForm.controls['choice1'].value)
    this.myAnswers.push(A1)
    var A2 = new Answer(this.quizzForm.controls['bchoice2'].value, this.quizzForm.controls['choice2'].value)
    this.myAnswers.push(A2)
    for (let i = 0; i < this.show.length; i++) {
      if (this.show[i] == true) {
        var j = i + 3;
        var ch = "choice" + j;
        var bch = "bchoice" + j;

        var A = new Answer(this.quizzForm.controls[bch].value, this.quizzForm.controls[ch].value)
        this.myAnswers.push(A);
      }
    }
    console.log('answers are')
    console.log(this.myAnswers);
    var Q = new Question(
      this.index,
      this.quizzForm.controls['enonce'].value,
      this.myAnswers
    )
    this.questions.push(Q);
    this.index++;
    this.quizzForm.reset();
    this.myAnswers = [];
    this.show = [];
    this.notyf2.confirm(' Question ajoutée ');
    console.log('question is')
    console.log(Q)
  }
  sendTest() {
    console.log(this.questions)
    var test = new Test(this.partForm.controls['name'].value, this.questions);
    this.tests.push(test);
    this.overalltest = new Overalltest(this.quizzDescription, this.quizzExperience, this.quizzName, this.tests);
    console.log('overalllllll')
    this.notyf2.confirm(' Partie ajoutée ');
    console.log(this.overalltest)
    this.partForm.reset();
    this.questions = [];
    this.quizzForm.reset();
    this.index = 1;
    this.part++;

  }
  sendOverAllTest() {
    this.evaluationService.sendTest(this.overalltest).subscribe(resp => {
      console.log(resp)
      // this.evaluationService.convocate(resp.body['id'],1193953028).subscribe();
      this.notyf2.confirm(' test ajouté avec succès ');
      this.router.navigate(['quizz/list'])
    }, err => {
      //console.log(err);
      this.notyf2.alert("Echec d'ajout de test");

    });

  }

  numPartie() {
    var partname = " Nom de la Partie " + this.part;
    return partname;
  }
  proposition(i: number) {
    var j = i + 3;
    var p = 'Proposition ' + j;
    return p;
  }
  last(i) {
    for (let j = i + 1; j < this.show.length; j++) {
      if (this.show[j] == true)
        return false;
    }
    return true;
  }
  choice(i: number) {
    i = i + 3;
    return "choice" + i;
  }
  bchoice(i: number) {
    i = i + 3;
    return "bchoice" + i;
  }
  redirectAlltests() {
    this.router.navigate(['quizz/list']);
  }

  redirectAllinterviews() {
    this.router.navigate(['interviews/list']);
  }
  createQuizz() {
    console.log("type of " + typeof (this.experienceSelected.value.toString()) + " value + " + this.experienceSelected.value.toString());

    this.quizzName = this.testForm.controls['name'].value;
    this.quizzDescription = this.testForm.controls['description'].value;
    this.quizzExperience = this.experienceSelected.value.toString();
    if (this.quizzName && this.quizzDescription && this.quizzExperience)
      this.created = true;
    else
      this.notyf2.alert('Valider tous les champs SVP')
  }

  createInterview() {
    if (this.interview.length > 0) {
      this.router.navigate(['interview/quizz/list/' + this.interview]);
    } else this.notyf2.alert('Valider tous les champs SVP')
  }

}
