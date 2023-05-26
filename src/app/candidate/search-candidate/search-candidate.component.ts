import { Component, OnInit } from '@angular/core';
import { Candidate } from "../candidate";
import { CandidateService } from "../candidate.service"
import { ActivatedRoute, Router, NavigationEnd } from '@angular/router';
import { FormControl, FormGroup, Validators, ReactiveFormsModule } from "@angular/forms";
import { UpperCasePipe, LowerCasePipe, TitleCasePipe } from '@angular/common';



@Component({
  selector: 'app-search-candidate',
  templateUrl: './search-candidate.component.html',
  styleUrls: ['./search-candidate.component.scss'],
  providers: [CandidateService]
})
export class SearchCandidateComponent implements OnInit {
  public candidates;
  public candidate: Candidate;
  query: string;
  advancedQuery: string[];
  private sub: any;
  searchForm: FormGroup;
  advancedForm: FormGroup;
  advanced: boolean;
  private jwtToken = null;



  constructor(public route: ActivatedRoute, private router: Router, private candidateService: CandidateService) { }

  ngOnInit() {
    this.loadToken();
    if (!this.jwtToken) {
      this.router.navigate([''])
    }
    this.sub = this.route.params.subscribe(params => {
      this.query = params['query'];
      this.candidate;
      this.advanced = false;

    });
    if (this.query) {
      this.advancedQuery = this.query.split('+&+')
      //console.log(this.advancedQuery[0]+'  -- '+this.advancedQuery[1]);
      switch (this.advancedQuery[0]) {
        case "byName": {
          this.getFilteredCandidates(this.advancedQuery[1]);
          break;
        }
        case "byPosition": {
          this.getCandidatesByPosition(this.advancedQuery[1]);
        }
        case "bySkills": {
          this.getCandidatesBySkills(this.advancedQuery[1]);
        }
      }
    }
    //this.getFilteredCandidates(this.query);
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

  getFilteredCandidates(query: string) {
    this.candidateService.findByName(query).subscribe(
      candidates => {
        this.candidates = candidates;
        this.candidates.reverse();
      },
      err => {
        //console.log(err);
      }
    )


  }

  redirectNewCandidatePage() {
    this.router.navigate(['/candidate/create']);
  }

  redirectSearchPage() {
    this.router.navigate(['candidate/search']);
  }
  getAdvancedCandidates(name: string, salary: number, current: string, desired: string, skill: string) {
    //console.log('working');
    this.candidates = [];
    this.candidateService.findAdvanced(name, 'somewhere', skill, salary, current, desired).subscribe(
      candidates => {
        this.candidates = candidates;
        candidates.reverse();
      },
      err => {
        //console.log(err);
      }
    )

  }
  getCandidatesByPosition(query: string) {
    this.candidateService.findByPosition(query).subscribe(
      candidates => {
        this.candidates = candidates;
        candidates.reverse();
      },
      err => {
        //console.log(err);
      }
    )

  }
  getCandidatesBySkills(query: string) {
    this.candidateService.findBySkills(query).subscribe(
      candidates => {
        this.candidates = candidates;
        //this.candidates.reverse();
      },
      err => {
        //console.log(err);
      }
    )

  }
  searchAdvanced() {
    this.candidates = [];
    //console.log(this.advancedForm)
    if (!this.advancedForm.controls['name'].value
      && !this.advancedForm.controls['mobility'].value
      && !this.advancedForm.controls['skill'].value
      && !this.advancedForm.controls['yearsOfExperience'].value
      && !this.advancedForm.controls['currentPosition'].value
      && !this.advancedForm.controls['desiredPosition'].value


    ) {
      //console.log('check salary')
      //console.log(this.advancedForm.controls['salaryMin'].value)
      //console.log(this.advancedForm.controls['salaryMax'].value)
      this.candidateService.findBysalary(this.advancedForm.controls['salaryMin'].value, this.advancedForm.controls['salaryMax'].value).subscribe(
        candidates => {
          this.candidates = candidates;
          if (this.candidates)
            this.candidates.reverse();
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
        this.advancedForm.controls['yearsOfExperience'].value,
        this.advancedForm.controls['evaluation'].value,
        this.advancedForm.controls['salaryMax'].value,
        this.advancedForm.controls['salaryMin'].value,
        currentSearch,
        desiredSearch
      ).subscribe(
        candidates => {
          this.candidates = candidates;
          if (this.candidates)
            this.candidates.reverse();
        }
      );
    }
  }
  sendSearch() {

    switch (this.searchForm.controls['searchCriterion'].value) {
      case "": {
        this.router.navigate(['/candidate/search/' + 'byName' + '+&+' + this.searchForm.controls['searchItem'].value]);
        this.getFilteredCandidates(this.searchForm.controls['searchItem'].value);
        //console.log('byName --'+this.searchForm.controls['searchItem'].value);
        // //console.log(this.query);
        break;
      }

      case "byName": {
        this.router.navigate(['/candidate/search/' + 'byName' + '+&+' + this.searchForm.controls['searchItem'].value]);
        this.getFilteredCandidates(this.searchForm.controls['searchItem'].value);
        //console.log('byName --'+this.searchForm.controls['searchItem'].value);
        // //console.log(this.query);
        break;
      }
      case "byPosition": {
        this.router.navigate(['/candidate/search/' + 'byPosition' + '+&+' + this.searchForm.controls['searchItem'].value]);
        this.getCandidatesByPosition(this.searchForm.controls['searchItem'].value);
        //console.log('byPosition --'+this.searchForm.controls['searchItem'].value)
        //console.log(this.query);
        break;

      }
      case "bySkills": {
        this.router.navigate(['/candidate/search/' + 'bySkills' + '+&+' + this.searchForm.controls['searchItem'].value]);
        this.getCandidatesBySkills(this.searchForm.controls['searchItem'].value);
        //console.log('bySkill --'+this.searchForm.controls['searchItem'].value)
        //console.log(this.query);
        break;

      }

    }

  }
  goCandidatePage(candidate) {
    this.router.navigate(['candidate/details/' + candidate.uuid]);
  }

  getAllCandidates() {
    this.candidateService.findAll().subscribe(
      candidates => {
        this.candidates = candidates;
        candidates.reverse();
      },
      err => {
        //console.log(err);
      }
    )
  }
}
