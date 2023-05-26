import { Component, OnInit } from '@angular/core';
import { Candidate } from "../candidate";
import { CandidateService } from "../candidate.service"
import { Router } from '@angular/router';

import { AuthenticationService } from '../../user/services/authentication.service';
import { Title } from '@angular/platform-browser';
import 'rxjs/add/operator/map'
import { COMMA, ENTER } from '@angular/cdk/keycodes';
import * as _ from 'underscore';
import { PagerService } from '../services/pager.service';
import { MatChipInputEvent, Sort } from '@angular/material';
import { ActivatedRoute, NavigationEnd } from '@angular/router';
import { FormControl, FormGroup, Validators, ReactiveFormsModule } from "@angular/forms";
import { environment } from '../../../assets/environments/environment';
declare var $: any;
declare var jQuery: any;
declare var require: any;
//declare var $: any;
export class Gassessement {
  id: number;
  score: number;
  questions: number;
  token: string;
  title: string;
  constructor(id: number, score: number, questions: number, token: string, title: string) {
    this.id = id;
    this.score = score;
    this.questions = questions;
    this.token = token; this.title = title
  }
}


@Component({
  selector: 'app-candidate-list',
  templateUrl: './candidate-list.component.html',
  styleUrls: ['./candidate-list.component.scss'],
  providers: [CandidateService]

})
export class CandidateListComponent implements OnInit {
  public messageValue: string;
  public candidates: Candidate[];
  public candidate: Candidate;
  public userConnect: string;
  public noCandidates: boolean = false;
  public jwtToken = null;
  public allItems: Candidate[];
  advanced: boolean = false;
  public found: boolean = true;
  public apiUrl = environment.apiUrl;
  public sub: any;
  public quizzid: number;
  public filter;
  public Notyf = require('notyf');
  public notyf2 = new this.Notyf({
    delay: 4000,
    alertIcon: 'fa fa-exclamation-circle',
    confirmIcon: 'fa fa-check-circle'
  })

  // pager object
  pager: any = {};

  // paged items
  pagedItems: Candidate[];

  allCandidates;
  searchForm: FormGroup;
  advancedForm: FormGroup;
  minSearch;
  maxSearch;
  nExperience;
  eval;
  name;
  mobility;
  skill;
  currentPosition;
  desiredPosition;
  inputNom: string;
  uuid: any;
  search: string;
  constructor(public route: ActivatedRoute, private router: Router, private pagerService: PagerService,
    private candidateService: CandidateService, private authenticationService: AuthenticationService,
    private titleService: Title) { }
  public setTitle(newTitle: string) {
    this.titleService.setTitle(newTitle);

  }
  ngOnInit() {

    this.setTitle('Kakoo Software - Liste des candidats')
    this.loadToken();
    if (!this.jwtToken) {
      this.router.navigate([''])
    }
    console.log(this.jwtToken);
    this.getConnectedUser();
    //this.getCandidates();
    //console.log('quizzid ' + this.quizzid)

    this.sub = this.route.params.subscribe(params => {
      this.quizzid = params['quizzid'];
      if (this.quizzid) {
        //do nothing ;)
        //console.log('quizzid exist' + this.quizzid)
      }

    });
    this.messageValue = "";
    // console.clear();
    this.searchForm = new FormGroup({
      searchItem: new FormControl(),
      searchCriterion: new FormControl('', Validators.required)
    });
    this.advancedForm = new FormGroup({
      name: new FormControl(),
      mobility: new FormControl(),
      skill: new FormControl(),
      currentPosition: new FormControl(),
      desiredPosition: new FormControl(),
      salaryMin: new FormControl(),
      salaryMax: new FormControl(),
      yearsOfExperience: new FormControl(),
      evaluation: new FormControl()
    });

  }
  selectAllCandidates = false;

  loadToken() {
    this.jwtToken = localStorage.getItem('token');
  }
  onFilterChange(eve: any, candidate) {
    //console.log('test')
    candidate.selected = !candidate.selected;
    if (!candidate.selected) {
      this.selectAllCandidates = false;
    }
  }
  selectAll(eve: any) {
    this.selectAllCandidates = !this.selectAllCandidates;
    this.filter = this.selectAllCandidates;
    for (let item of this.allItems) {
      item.selected = this.selectAllCandidates;
    }

  }
  sendQuizz() {
    for (let item of this.allItems) {
      if (item.selected) {
        //console.log(item.firstName)
        this.candidateService.convocate(this.quizzid, item.uuid).subscribe(resp => {
          //console.log(resp);

        });

      }
    }
    this.notyf2.confirm('Quizz Envoyé aux candidats séléctionnés ');
    this.router.navigate(['quizz/list']);
  }
  sendListeningToMarket() {
    if (this.messageValue != "") {
      for (let item of this.allItems) {
        if (item.selected) {
          //console.log(item.firstName);
          this.candidateService.listeningToMarket(item.uuid, this.messageValue).subscribe(resp => {
            //console.log(resp);
          });
        }

      }
      this.notyf2.confirm('Mail Envoyé aux candidats séléctionnés ');
      this.router.navigate(['candidate/list']);
      this.ngOnInit();
    } else {
      this.notyf2.alert("Veuillez écrire un message !");
    }
  }

  redirectSendMail() {
    let selectedListCandidats = [];
    for (let item of this.allItems) {
      if (item.selected) {
        selectedListCandidats.push(item.id);
      }

    }
    if (selectedListCandidats.length == 0) {
      this.notyf2.alert('Aucun candidat sélectionné ..');
    } else {
     this.router.navigate(['/candidate/email/' + selectedListCandidats]);
    }
  }

  getCandidates() {
    this.candidateService.getCandidates()
      .subscribe(candidates => {
        this.allCandidates = candidates;
        this.allItems = [];
        if (this.allCandidates) {
          this.allCandidates.reverse();
          for (let candidate of this.allCandidates) {
            this.getCandidatePic(candidate);
            this.allItems.push(candidate);
            //score
            this.candidateService.getGAssessementsByCandidate(candidate.id).subscribe(
              resp => {
                let i = 0;
                let array: Array<Gassessement> = [];

                while (resp.body != null && resp.body[i] != null) {

                  let j = 0;
                  // nombre total des question de toutes les parties
                  var nbrQuestions = 0;
                  while (resp.body[i].assessements[j] != null) {
                    nbrQuestions += resp.body[i].assessements[j]['test'].questions.length
                    j++;
                  }

                  let k = 0;
                  // nombre total des question de toutes les parties
                  var testNames: Array<string> = [];
                  while (resp.body[i].assessements[k] != null) {
                    testNames.push(resp.body[i].assessements[k]['test'].testName);
                    k++;
                  }
                  let gassessement = new Gassessement(
                    resp.body[i].id,
                    resp.body[i].score,
                    nbrQuestions,
                    resp.body[i].token,
                    testNames.toString()
                  );
                  //console.log("id " + gassessement.id + "nbr Question " + gassessement.questions + "Nbr de Question Correct " + gassessement.score + "titles of parties" + gassessement.title);
                  array.push(gassessement);
                  i++;
                }
                if (array.length != 0) {
                  let sum = 0;
                  for (let gassessement of array) {
                    sum = sum + gassessement.score * (100 / gassessement.questions);
                  }
                  candidate.score = (sum / array.length);
                } else candidate.score = 9999;
              }

            );



            //
          }
        }
        this.setPage(1);

      }

        , err => {
        }
      )

  }
  getCandidatePic(candidate: Candidate) {

    if (candidate.photo) {
      candidate.photoUrl = this.apiUrl + 'candidates/' + candidate.id + "/downloadPhoto";
      //console.log(candidate.email)
      //console.log(candidate.photo)
    }
    else {
      if (candidate.gender == 'Homme') {
        candidate.photoUrl = "./assets/home/images/male-candidate.png"
      }
      if (candidate.gender == 'Femme') {
        candidate.photoUrl = "./assets/home/images/female-candidate.png"
      }
    }


  }
  sendSearch() {
    this.search = $("#searchItem").val();
    if (this.search == "" || this.search == undefined) {
      this.getCandidates();

      $("#searchItem").on("change keyup paste click", function () {
        //console.log(this.search);
      })
      //console.log("value of this . searchItem" + this.search);

    }
    else {
      //console.log("item searched  " + this.search);
      var filtered = this.search.trim();
      this.getFilteredCandidates(filtered);

    }

  }
  getFilteredCandidates(query: string) {
    this.candidateService.findByNameAndSkill(query).subscribe(
      candidates => {
        if (candidates && candidates['length'] != 0) {
          console.log(candidates['length']);
          this.found = true;
          this.allCandidates = candidates;
          this.allItems = [];
          this.allCandidates.reverse();
          for (let candidate of this.allCandidates) {
            this.getCandidatePic(candidate);
            this.allItems.push(candidate);
            //score
            this.candidateService.getGAssessementsByCandidate(candidate.id).subscribe(
              resp => {
                let i = 0;
                let array: Array<Gassessement> = [];

                while (resp.body != null && resp.body[i] != null) {

                  let j = 0;
                  // nombre total des question de toutes les parties
                  var nbrQuestions = 0;
                  while (resp.body[i].assessements[j] != null) {
                    nbrQuestions += resp.body[i].assessements[j]['test'].questions.length
                    j++;
                  }

                  let k = 0;
                  // nombre total des question de toutes les parties
                  var testNames: Array<string> = [];
                  while (resp.body[i].assessements[k] != null) {
                    testNames.push(resp.body[i].assessements[k]['test'].testName);
                    k++;
                  }
                  let gassessement = new Gassessement(
                    resp.body[i].id,
                    resp.body[i].score,
                    nbrQuestions,
                    resp.body[i].token,
                    testNames.toString()
                  );
                  //console.log("id " + gassessement.id + "nbr Question " + gassessement.questions + "Nbr de Question Correct " + gassessement.score + "titles of parties" + gassessement.title);
                  array.push(gassessement);
                  i++;
                }
                if (array.length != 0) {
                  let sum = 0;
                  for (let gassessement of array) {
                    sum = sum + gassessement.score * (100 / gassessement.questions);
                  }
                  candidate.score = (sum / array.length);
                } else candidate.score = 9999;
              }

            );



            //

          }
          //  this.allItems.reverse();
          this.setPage(1);
        }
        else {//console.log('nothing found ');
          this.found = false;
          this.getCandidates();
        }

      },
      err => {
        //console.log(err);
      }
    )


  }

  setPage(page: number) {
    if (page < 1 || page > this.pager.totalPages) {
      return;
    }

    // get pager object from service
    if (this.allItems && this.allItems.length != 0) {
      this.pager = this.pagerService.getPager(this.allItems.length, page);

      // get current page of items
      this.pagedItems = this.allItems.slice(this.pager.startIndex, this.pager.endIndex + 1);
    }
    else {
      this.noCandidates = true;
    }
  }

  getConnectedUser() {
    this.authenticationService.getConnectedUser().subscribe(
      resp => {
        //
        if (resp) {//console.log('resp exist')
          // //console.log(resp)
          //console.log('le canddiate connecté est ')
          //this.userConnect= resp.body['lastName']+' '+resp.body['firstName'];
          //console.log(this.userConnect);
          this.getCandidates();
        }
        else {
          //console.log('non resp')
          // //console.log(resp)
        }
      }
    )
  }

  getAllCandidates() {
    this.candidateService.findAll().subscribe(
      candidates => {
        this.candidates = candidates;
        if (candidates) {
          candidates.reverse();
        }
      },
      err => {
        // //console.log(err);
      }
    )
  }
  deleteCandidate(can: Candidate) {
    if (can) {
      this.candidateService.deleteCandidateById(can.id).subscribe(
        res => {
          this.getCandidates();
          this.notyf2.confirm('Candidat supprimé avec succès');
        }, err => {
            this.notyf2.alert('Erreur du suppression du candidat');
        }
      );
    }

    //console.log("candidate deleted");
  }

  redirectNewCandidatePage() {
    this.router.navigate(['/candidate/create']);
  }

  displayCandidatePage(can: Candidate) {
    //this.router.navigate(['/candidate/details/'+can.id]);
    this.router.navigate(['/candidate/details/' + can.uuid]);
  }


  editCandidatePage(can: Candidate) {
    // //console.log("candidate editing  ",can.id);
    if (can) {
      this.router.navigate(['/candidate/edit', can.uuid]);
    }
  }
  uploadCV(can: Candidate) {
    if (can) {
      //console.log("candidate cv uploading", can.id);
      this.router.navigate(['/candidate/upload/form/', can.uuid]);
      //window.open('/candidate/upload/form/'+can.uuid);

    }
  }
  dispReports(can: Candidate) {

    if (can) {
      //console.log("uuid form get candidate is " + can.uuid);
      this.candidateService.findByUuid(can.uuid).subscribe(
        res => {
          let token = res.body['convocationToken'];
          //console.log("token is " + token);
          let url = "candidate/reports/" + can.uuid;
          this.router.navigate([url]);
        }
      );
    }

  }
  getCandidatesBySkills(query: string) {
    this.candidateService.findBySkills(query).subscribe(
      candidates => {
        if (candidates && candidates['length'] != 0) {
          this.found = true;
          this.allCandidates = candidates;
          this.allItems = [];
          for (let candidate of this.allCandidates) {
            this.getCandidatePic(candidate);
            this.allItems.push(candidate);

          }
          this.allItems.reverse();
          this.setPage(1);
        }
        else {
          this.found = false;
          this.getCandidates();
        }

        //this.candidates.reverse();
      },
      err => {
        //  //console.log(err);
      }
    )

  }

  knowMoreCandidate(can: Candidate) {
    // //console.log("candidate more  ",can.id);
    if (can) {
      this.router.navigate(['/candidate/details', can.uuid]);
    }
  }
  showDetails(candidate) {
    return true;
  }
  searchAdvanced() {
    this.candidates = [];
    if (!this.advancedForm.controls['salaryMin'].value || this.advancedForm.controls['salaryMin'].value.trim() == '')
      this.minSearch = 0;
    else
      this.minSearch = this.advancedForm.controls['salaryMin'].value;

    if (!this.advancedForm.controls['salaryMax'].value || this.advancedForm.controls['salaryMax'].value.trim() == '')
      this.maxSearch = 0;
    else
      this.maxSearch = this.advancedForm.controls['salaryMax'].value;

    if (!this.advancedForm.controls['yearsOfExperience'].value || this.advancedForm.controls['yearsOfExperience'].value.trim() == '')
      this.nExperience = 0;
    else
      this.nExperience = this.advancedForm.controls['yearsOfExperience'].value;

    if (!this.advancedForm.controls['evaluation'].value || this.advancedForm.controls['evaluation'].value.trim() == '')
      this.eval = 0;
    else
      this.eval = this.advancedForm.controls['evaluation'].value;

    if (!this.advancedForm.controls['name'].value
      && !this.advancedForm.controls['mobility'].value
      && !this.advancedForm.controls['skill'].value
      && !this.advancedForm.controls['yearsOfExperience'].value
      && !this.advancedForm.controls['currentPosition'].value
      && !this.advancedForm.controls['desiredPosition'].value


    ) {
      this.candidateService.findBysalary(this.minSearch, this.maxSearch).subscribe(
        candidates => {
          if (candidates && candidates['length'] != 0) {
            this.found = true;
            this.allCandidates = candidates;
            this.allItems = [];
            //this.allItems.reverse();
            for (let candidate of this.allCandidates) {
              this.getCandidatePic(candidate);
              this.allItems.push(candidate);

            }
            this.allItems.reverse();
            this.setPage(1);
          }
          else {
            this.found = false;
            this.getCandidates();
          }

        }, err => {
          this.found = false;
          this.getCandidates();
        }
      );
    }
    else if (!this.advancedForm.controls['name'].value
      && !this.advancedForm.controls['mobility'].value
      && this.advancedForm.controls['skill'].value
      && !this.advancedForm.controls['yearsOfExperience'].value
      && !this.advancedForm.controls['currentPosition'].value
      && !this.advancedForm.controls['desiredPosition'].value) {
      this.getCandidatesBySkills(this.advancedForm.controls['skill'].value);
    }
    else {

      if (!this.advancedForm.controls['skill'].value || this.advancedForm.controls['skill'].value.trim() == '')
        var skillSearch = '{skill}';
      else
        skillSearch = this.advancedForm.controls['skill'].value;

      if (!this.advancedForm.controls['name'].value || this.advancedForm.controls['name'].value.trim() == '')
        var nameSearch = '{name}';
      else
        nameSearch = this.advancedForm.controls['name'].value;
      //console.log('name issss  ' + nameSearch)
      if (!this.advancedForm.controls['mobility'].value || this.advancedForm.controls['mobility'].value.trim() == '')
        var mobilitySearch = '{mobilityArea}';
      else
        mobilitySearch = this.advancedForm.controls['mobility'].value;
      if (!this.advancedForm.controls['currentPosition'].value || this.advancedForm.controls['currentPosition'].value.trim() == '')
        var currentSearch = '{actualPosition}';
      else
        currentSearch = this.advancedForm.controls['currentPosition'].value;
      if (!this.advancedForm.controls['desiredPosition'].value || this.advancedForm.controls['desiredPosition'].value.trim() == '')
        var desiredSearch = '{desiredPosition}';
      else
        desiredSearch = this.advancedForm.controls['desiredPosition'].value;

      this.candidateService.advancedsearching(
        nameSearch,
        mobilitySearch,
        skillSearch,
        this.nExperience,
        this.eval,
        this.minSearch,
        this.maxSearch,
        currentSearch,
        desiredSearch
      ).subscribe(
        candidates => {
          //console.log('after search ' + nameSearch)
          if (candidates && candidates['length'] != 0) {
            this.found = true;
            this.allCandidates = candidates;
            this.allItems = [];
            // this.allItems.reverse();
            for (let candidate of this.allCandidates) {
              this.getCandidatePic(candidate);
              this.allItems.push(candidate);

            }
            this.allItems.reverse();
            this.setPage(1);
          }
          else {
            this.found = false;
            this.getCandidates();
          }

        }
      );
    }
  }

  dispVideos(candidate: Candidate) {
    this.router.navigate(['/candidate/videos/' + candidate.uuid]);
  }

  redirectToUploadCV(): void {
    let candidate: Candidate = new Candidate(0,
      'Kakoo',
      'Default',
      'Kakoo@profil.com',
      'Default',
      'Homme',
      '33184202515',
      'Kakoo',
      'Kakoo',
      0

    );
    this.authenticationService.saveCandidate(candidate).subscribe(
      resp => {
        this.uuid = resp.body;
        this.router.navigate(['/candidate/upload/form/' + this.uuid.object.uuid]);
      }
    );

  }

  searchAdvanced2() {
    this.candidates = [];

    if (this.skills.length > 0) {
      let aux = "";
      for (let item of this.skills) {
        aux = aux + "," + item.skillName.toString();
      }
      this.advancedForm.controls['skill'].setValue(aux);
    } else {
      this.advancedForm.controls['skill'].setValue(null);
      this.skill = null;
    }


    if (!this.advancedForm.controls['salaryMin'].value || this.advancedForm.controls['salaryMin'].value.trim() == '')
      this.minSearch = 0;
    else
      this.minSearch = this.advancedForm.controls['salaryMin'].value;

    if (!this.advancedForm.controls['salaryMax'].value || this.advancedForm.controls['salaryMax'].value.trim() == '')
      this.maxSearch = 0;
    else
      this.maxSearch = this.advancedForm.controls['salaryMax'].value;

    if (!this.advancedForm.controls['yearsOfExperience'].value || this.advancedForm.controls['yearsOfExperience'].value.trim() == '')
      this.nExperience = 0;
    else
      this.nExperience = this.advancedForm.controls['yearsOfExperience'].value;

    if (!this.advancedForm.controls['evaluation'].value || this.advancedForm.controls['evaluation'].value.trim() == '')
      this.eval = 0;
    else
      this.eval = this.advancedForm.controls['evaluation'].value;

    if (!this.advancedForm.controls['name'].value || this.advancedForm.controls['name'].value.trim() == '')
      this.name = null;
    else
      this.name = this.advancedForm.controls['name'].value;

    if (!this.advancedForm.controls['mobility'].value || this.advancedForm.controls['mobility'].value.trim() == '')
      this.mobility = null;
    else
      this.mobility = this.advancedForm.controls['mobility'].value;

    if (!this.advancedForm.controls['skill'].value || this.advancedForm.controls['skill'].value.trim() == '')
      this.skill = null;
    else
      this.skill = this.advancedForm.controls['skill'].value;

    if (!this.advancedForm.controls['currentPosition'].value || this.advancedForm.controls['currentPosition'].value.trim() == '')
      this.currentPosition = null;
    else
      this.currentPosition = this.advancedForm.controls['currentPosition'].value;
    if (!this.advancedForm.controls['desiredPosition'].value || this.advancedForm.controls['desiredPosition'].value.trim() == '')
      this.desiredPosition = null;
    else
      this.desiredPosition = this.advancedForm.controls['desiredPosition'].value;

    if (this.desiredPosition == null && this.currentPosition == null && this.skill == null
      && this.mobility == null && this.name == null && this.eval == 0 && this.nExperience == 0
      && this.maxSearch == 0 && this.minSearch == 0)
      this.getCandidates();
    else {



      this.candidateService.advancedsearching2(
        this.name,
        this.mobility,
        this.skill,
        this.nExperience,
        this.eval,
        this.minSearch,
        this.maxSearch,
        this.currentPosition,
        this.desiredPosition
      ).subscribe(
        candidates => {
          console.log(this.nExperience);
          this.allCandidates = candidates;
          this.allItems = [];
          if (this.allCandidates && this.allCandidates['length'] != 0) {
            this.found = true;
            // this.allItems.reverse();
            this.allCandidates.reverse();
            for (let candidate of this.allCandidates) {
              this.getCandidatePic(candidate);
              this.allItems.push(candidate);
              //score
              this.candidateService.getGAssessementsByCandidate(candidate.id).subscribe(
                resp => {
                  let i = 0;
                  let array: Array<Gassessement> = [];

                  while (resp.body != null && resp.body[i] != null) {

                    let j = 0;
                    // nombre total des question de toutes les parties
                    var nbrQuestions = 0;
                    while (resp.body[i].assessements[j] != null) {
                      nbrQuestions += resp.body[i].assessements[j]['test'].questions.length
                      j++;
                    }

                    let k = 0;
                    // nombre total des question de toutes les parties
                    var testNames: Array<string> = [];
                    while (resp.body[i].assessements[k] != null) {
                      testNames.push(resp.body[i].assessements[k]['test'].testName);
                      k++;
                    }
                    let gassessement = new Gassessement(
                      resp.body[i].id,
                      resp.body[i].score,
                      nbrQuestions,
                      resp.body[i].token,
                      testNames.toString()
                    );
                    //console.log("id " + gassessement.id + "nbr Question " + gassessement.questions + "Nbr de Question Correct " + gassessement.score + "titles of parties" + gassessement.title);
                    array.push(gassessement);
                    i++;
                  }
                  if (array.length != 0) {
                    let sum = 0;
                    for (let gassessement of array) {
                      sum = sum + gassessement.score * (100 / gassessement.questions);
                    }
                    candidate.score = (sum / array.length);
                  } else candidate.score = 9999;
                }

              );



              //

            }
            //this.allItems.reverse();
            this.setPage(1);
          }
          else {
            this.found = false;
            this.allCandidates = [];
            this.allItems = [];
            this.candidates = [];
            this.pagedItems = [];
            //this.getCandidates();
          }

        }
      );

    }


  }

  visible = true;
  selectable = true;
  removable = true;
  addOnBlur = true;
  readonly separatorKeysCodes: number[] = [ENTER, COMMA];
  skills: Skill[] = [];

  add(event: MatChipInputEvent): void {
    const input = event.input;
    const value = event.value;

    // Add our fruit
    if ((value || '').trim()) {
      this.skills.push({ skillName: value.trim() });
    }

    // Reset the input value
    if (input) {
      input.value = null;
    }
    this.searchAdvanced2();
  }

  remove(skill: Skill): void {
    const index = this.skills.indexOf(skill);

    if (index >= 0) {
      this.skills.splice(index, 1);
    }
    this.searchAdvanced2();
  }

  // reconnaisance vocal 
  startDictation(): void {
    //console.log("speack ...");
    if (window.hasOwnProperty('webkitSpeechRecognition')) {
      //const speechRecognition = Window['webkitSpeechRecognition'];
      const { webkitSpeechRecognition }: IWindow = <IWindow>window;
      const recognition = new webkitSpeechRecognition();
      //var recognition = Window['webkitSpeechRecognition'];

      recognition.continuous = true;
      recognition.interimResults = true;

      recognition.lang = "fr-FR";
      recognition.start();

      recognition.onresult = function (e) {

        this.search = e.results[0][0].transcript;
        $("#searchItem").val(this.search);

        //console.log("seaaarch value deletected" + this.search);
        //document.getElementById("result").innerHTML = "Paragraph changed!";


        recognition.stop();
        //document.getElementById('labnol').submit();
      };

      recognition.onerror = function (e) {
        recognition.stop();
      }
    }
    this.sendSearch();
  }

  sortData(sort: Sort) {
    if (!sort.active || sort.direction === '') {
      // this.getCandidates();
      return;
    }

    this.allItems = this.allItems.sort((a, b) => {
      const isAsc = sort.direction === 'asc';
      switch (sort.active) {
        //   case 'name': return compare(a.name, b.name, isAsc);
        // case 'calories': return compare(a.calories, b.calories, isAsc);
        //  case 'fat': return compare(a.fat, b.fat, isAsc);
        case 'nExperience': return compare(a.nExperience, b.nExperience, isAsc);
        case 'score': return compare(a.score, b.score, isAsc);
        default: return 0;
      }
    });
    this.setPage(1);
    this.pagedItems = this.pagedItems.sort((a, b) => {
      const isAsc = sort.direction === 'asc';
      switch (sort.active) {
        //   case 'name': return compare(a.name, b.name, isAsc);
        // case 'calories': return compare(a.calories, b.calories, isAsc);
        //  case 'fat': return compare(a.fat, b.fat, isAsc);
        case 'nExperience': return compare(a.nExperience, b.nExperience, isAsc);
        case 'score': return compare(a.score, b.score, isAsc);
        default: return 0;
      }
    });

    function compare(a: number | string, b: number | string, isAsc: boolean) {
      return (a < b ? -1 : 1) * (isAsc ? 1 : -1);
    }
  }


}

export interface Skill {
  skillName: string;
}

export interface IWindow extends Window {
  webkitSpeechRecognition: any;
}
