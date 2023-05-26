import { Component, OnInit, Renderer2, Inject } from '@angular/core';
import { Candidate } from "../candidate";
import { MailCandidate } from "../mail-candidate";
import { CandidateService } from "../candidate.service"
import { Router } from '@angular/router';
import { COMMA, ENTER } from '@angular/cdk/keycodes';
import { AuthenticationService } from '../../user/services/authentication.service';
import { Title } from '@angular/platform-browser';
import 'rxjs/add/operator/map'
import { MatChipInputEvent } from '@angular/material';
import { PagerService } from '../services/pager.service';

import { ActivatedRoute, NavigationEnd } from '@angular/router';
import { FormControl, FormGroup, Validators, ReactiveFormsModule } from "@angular/forms";
import { environment } from '../../../assets/environments/environment';
import { DOCUMENT } from '@angular/common';
declare var require: any;
//let ckeditor = require("../../../../node_modules/ckeditor/ckeditor.js");

@Component({
  selector: 'app-candidate-email',
  templateUrl: './candidate-email.component.html',
  styleUrls: ['./candidate-email.component.scss']
})
export class CandidateEmailComponent implements OnInit {

  constructor(public route: ActivatedRoute, private router: Router, private pagerService: PagerService,
    private candidateService: CandidateService, private authenticationService: AuthenticationService,
    private titleService: Title, private renderer2: Renderer2,
    @Inject(DOCUMENT) private _document) { 
     
    }
  mailCandidate: MailCandidate = new MailCandidate();
  emailForm: FormGroup;
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
  ckeditorContent: any;
  object: any;
  loader: boolean = false;
  confirmEmail: boolean = false;
  attachement: File = null;
  public jwtToken = null;
  allCandidates;
  public allItems;
  public candidates: Candidate[];
  public noCandidates: boolean = false;
  public found: boolean = true;
  public apiUrl = environment.apiUrl;
  advanced: boolean = false;
  // pager object
  pager: any = {};

  // paged items
  pagedItems: any[];
  public Notyf = require('notyf');
  public notyf2 = new this.Notyf({
    delay: 4000,
    alertIcon: 'fa fa-exclamation-circle',
    confirmIcon: 'fa fa-check-circle'
  })
  ngOnInit() {
    //ckeditor.basePath="../../../../node_modules/ckeditor/";
    //console.log(ckeditor);
    //ckeditor.replace('sample');
    /* window['CKEDITOR_BASEPATH'] = '//cdn.ckeditor.com/4.6.0/full/'; 
    let script : HTMLScriptElement = this._document.createElement('script');
    script.setAttribute('type', 'text/javascript');
    script.setAttribute('src', 'https://cdn.ckeditor.com/4.7.1/full/ckeditor.js');
    this._document.head.appendChild(script);

    const s = this.renderer2.createElement('script');
    s.type = 'text/javascript';
    s.src = '//cdn.ckeditor.com/4.7.1/full/ckeditor.js';
    this.renderer2.appendChild(this._document.body, s); */

    this.searchForm = new FormGroup({
      searchItem: new FormControl(),
      searchCriterion: new FormControl('', Validators.required)
    });

    this.emailForm = new FormGroup({
      ckeditorContent: new FormControl('', Validators.required),
      object: new FormControl('', Validators.required),

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
      evaluation: new FormControl(),
    });
    this.loadToken();
    if (!this.jwtToken) {
      this.router.navigate([''])
    }
    this.getCandidates();

  }


  loadToken() {
    this.jwtToken = localStorage.getItem('token');
  }

  getCandidates() {
    this.candidateService.getCandidates()
      .subscribe(candidates => {
        //console.log("KKKKKKKKKKK"+this.route.snapshot.paramMap.get('selectedListCandidats'));
        let sc = [];

        this.allCandidates = candidates;
        this.allItems = candidates;
        for (let candidate of this.allCandidates) {
          if (this.route.snapshot.paramMap.get('selectedListCandidats').split(",").includes(candidate.id.toString())) {
            sc.push(candidate);
          }

        }
        this.allCandidates = sc;
        this.allItems = sc;
        if (this.allCandidates) {
          this.allCandidates.reverse();
          for (let candidate of this.allCandidates) {
            // console.log(candidate)
            //this.getCandidatePic(candidate)

          }
        }
        this.setPage(1);

      }

        , err => {


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
  onFilterChange(eve: any, candidate) {

    candidate.selected = !candidate.selected;
    if (!candidate.selected) {
      this.sendToAll = false;
    }

  }

  onSubmit() {


    if (this.ckeditorContent != "" && this.emailForm.controls['object'].value != "") {
      let slectedItems = this.allItems.filter(i => i.selected);
      if ( slectedItems.length == 0 ) {
        this.notyf2.alert("Aucun candidat sélectionné ..");
      } else {
        this.authenticationService.getConnectedUser().subscribe(
          res => {

            this.mailCandidate.content = this.ckeditorContent;
            this.mailCandidate.object = this.emailForm.controls['object'].value;
            this.mailCandidate.rhMail = res.body['email'];
            this.mailCandidate.rhName = res.body['lastName'];
            for (let item of this.allItems) {
              if (item.selected) {
                let mailCandidate = {
                  idCandidate: item.uuid,
                  content: this.mailCandidate.content,
                  object: this.mailCandidate.object,
                  rhMail: this.mailCandidate.rhMail,
                  rhName: this.mailCandidate.rhName
                }
                this.candidateService.sendMailRequest(mailCandidate).subscribe(
                  resp => {
                    //console.log(resp);
                  }
                );
              }
            }
            this.notyf2.confirm('Mail Envoyé aux candidats séléctionnés ');
          }
        );
      }
    } else {
      this.notyf2.alert("Les champs son obligatoires ");
    }
  }
  /*
      if(this.ckeditorContent != "" && this.object != ""){
        for (let item of this.allItems) {
          if (item.selected) {
            console.log(item.firstName);
            console.log(this.ckeditorContent);
           this.candidateService.listeningToMarket(item.uuid,this.ckeditorContent).subscribe(resp => {
              console.log(resp);
             });
          }
       
          }
          this.notyf2.confirm('Mail Envoyé aux candidats séléctionnés ');
        //  this.router.navigate(['candidate/list']);
          this.ngOnInit();
        }else{
          this.notyf2.alert("Veuillez écrire un message !");
        }
  */



  checkMessage(): boolean {
    if (this.ckeditorContent !== null || this.ckeditorContent !== "" || this.ckeditorContent !== undefined) {
      return false;
    }
    else {
      return true;
    }
  }

  displayCandidatePage(can: Candidate) {
    //this.router.navigate(['/candidate/details/'+can.id]);
    this.router.navigate(['/candidate/details/' + can.uuid]);
  }
  sendSearch() {
    if (this.searchForm.controls['searchItem'].value == "" || !this.searchForm.controls['searchItem'].value)
      this.getCandidates();
    else {
      var filtered = this.searchForm.controls['searchItem'].value.trim();
      this.getFilteredCandidates(filtered);
    }

  }
  getFilteredCandidates(query: string) {
    //console.log("Je suis ici");
    this.candidateService.findByNameAndSkill(query).subscribe(
      candidates => {
        if (candidates && candidates['length'] != 0) {
          this.found = true;

          this.allItems = candidates;
          this.allItems.reverse();
          for (let candidate of this.allItems) {
            this.getCandidatePic(candidate)

          }
          this.setPage(1);
        }
        else {//console.log('nothing found ');
          this.found = false;
          //  this.getCandidates();
        }

      },
      err => {
        //console.log(err);
      }
    )


  }
  getCandidatePic(candidate: Candidate) {

    if (candidate.photo) {
      candidate.photoUrl = this.apiUrl + 'candidates/' + candidate.id + "/downloadPhoto";
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
  handleFileInput(files: FileList) {
    this.attachement = files.item(0);
  }
  sendToAll = false;
  filter = false;
  selectAll(eve: any) {
    this.sendToAll = !this.sendToAll;
    this.filter = this.sendToAll;
    for (let item of this.allItems) {
      item.selected = this.sendToAll;
    }

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
          //console.log('after search ');
          this.allCandidates = candidates;
          this.allItems = candidates;
          if (this.allCandidates && this.allCandidates['length'] != 0) {
            let sc = [];


            for (let candidate of this.allCandidates) {
              if (this.route.snapshot.paramMap.get('selectedListCandidats').split(",").includes(candidate.id.toString())) {
                sc.push(candidate);
              }

            }
            this.found = true;
            this.allCandidates = sc;
            this.allItems = sc;

            this.allItems.reverse();
            this.allCandidates.reverse();
            for (let candidate of this.allItems) {
              this.getCandidatePic(candidate)

            }
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
  getCandidatesBySkills(query: string) {
    this.candidateService.findBySkills(query).subscribe(
      candidates => {
        if (candidates && candidates['length'] != 0) {
          this.found = true;

          this.allItems = candidates;
          for (let candidate of this.allItems) {
            this.getCandidatePic(candidate)

          }
          this.allItems.reverse();
          this.setPage(1);
        }
        else {
          this.found = false;
          this.getCandidates();
        }

      },
      err => {

      }
    )

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

  return() {
    this.router.navigate(['candidate/list']);
  }
}

export interface Skill {
  skillName: string;
}
