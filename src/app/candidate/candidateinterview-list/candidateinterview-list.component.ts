import { Component, OnInit } from '@angular/core';
import { Candidate } from "../candidate";
import { CandidateService } from "../candidate.service"
import { Router } from '@angular/router';

import { AuthenticationService } from '../../user/services/authentication.service';
import { Title } from '@angular/platform-browser';
import 'rxjs/add/operator/map'

import * as _ from 'underscore';
import { PagerService } from '../services/pager.service';

import { ActivatedRoute, NavigationEnd } from '@angular/router';
import { FormControl, FormGroup, Validators, ReactiveFormsModule } from "@angular/forms";
import { environment } from '../../../assets/environments/environment';
declare var require: any;

@Component({
  selector: 'app-candidateinterview-list',
  templateUrl: './candidateinterview-list.component.html',
  styleUrls: ['./candidateinterview-list.component.scss']
})
export class CandidateinterviewListComponent implements OnInit {

  public candidates: Candidate[];
  public candidate: Candidate;
  public userConnect: string;
  public noCandidates: boolean = false;
  public jwtToken = null;
  public allItems;
  advanced: boolean = false;
  public found: boolean = true;
  public apiUrl = environment.apiUrl;
  public sub: any;
  public interviewId: number;
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
  pagedItems: any[];

  allCandidates;
  searchForm: FormGroup;
  advancedForm: FormGroup;
  minSearch;
  maxSearch;
  nExperience;
  eval;
  loader: boolean = false;

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
    this.getConnectedUser();
    this.getCandidates();


    this.sub = this.route.params.subscribe(params => {
      this.interviewId = params['interviewId'];
    });
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
  loadToken() {
    this.jwtToken = localStorage.getItem('token');
  }
  onFilterChange(eve: any, candidate) {
    //console.log('test')
    candidate.selected = !candidate.selected;
    //console.log(candidate.selected)
  }
  sendInterview() {
    this.loader = true;
    console.log("loading .. " + this.loader);
    for (let item of this.allItems) {
      if (item.selected) {
        console.log(item.firstName)
        this.candidateService.convocateInterview(item.uuid, this.interviewId).subscribe(resp => {
          this.loader = false;
          //console.log(resp);
          console.log("end loading " + this.loader);

        });

      }
    }
    this.notyf2.confirm('Entretien envoyé aux candidats séléctionnés ');
    this.router.navigate(['interviews/list']);
  }

  getCandidates() {
    //this.getAllCandidates();
    this.candidateService.getCandidates()
      .subscribe(candidates => {
        //console.log(candidates)
        //console.log('user autorized to see candidates');
        this.allCandidates = candidates;
        this.allItems = candidates;
        if (this.allCandidates) {
          this.allCandidates.reverse();
          for (let candidate of this.allCandidates) {
            //console.log(candidate)
            this.getCandidatePic(candidate)
            //candidate.photo=
          }
        }
        this.setPage(1);

      }

        , err => {
          //console.log(err);
          //console.log('user NOT ALLOWED  to see candidates');
          //  this.authenticationService.logout();
          this.router.navigate(['']);

        }
      )

  }
  getCandidatePic(candidate: Candidate) {
    /*this.candidateService.getPhoto(candidate.id).subscribe(
      resp=>{
        //console.log('image uuid ')
        if(resp.body){
        var imageId=resp.body['uuid'];
        candidate.photoUrl=this.apiUrl+'candidates/'+candidate.id+"/downloadPhoto";
        // //console.log(this.imageId);
      }
        else{
       candidate.photoUrl= "../assets/home/images/user.png"
        }
      }
    );*/
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
    if (this.searchForm.controls['searchItem'].value == "" || !this.searchForm.controls['searchItem'].value)
      this.getCandidates();
    else {
      var filtered = this.searchForm.controls['searchItem'].value.trim();
      this.getFilteredCandidates(filtered);
    }

  }
  getFilteredCandidates(query: string) {
    this.candidateService.findByName(query).subscribe(
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
          // this.router.navigate(['/candidate/']);
          // //console.log('done');
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
      // //console.log("candidate cv uploading",can.id);
      this.router.navigate(['/candidate/upload/form/', can.id]);
      //window.open('/candidate/upload/form/'+can.uuid);

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

            this.allItems = candidates;
            this.allItems.reverse();
            for (let candidate of this.allItems) {
              this.getCandidatePic(candidate)

            }
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

            this.allItems = candidates;
            this.allItems.reverse();
            for (let candidate of this.allItems) {
              this.getCandidatePic(candidate)

            }
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

}
