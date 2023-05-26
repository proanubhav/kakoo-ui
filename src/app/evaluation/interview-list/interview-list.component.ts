import { Component, OnInit } from '@angular/core';
import { Router,ActivatedRoute } from '@angular/router';
import{Test} from '../test';
import{EvaluationService} from '../evaluation.service';
import { PagerService } from '../../candidate/services/pager.service';
import { CandidateService } from '../../candidate/candidate.service';
declare var require: any;

@Component({
  selector: 'app-interview-list',
  templateUrl: './interview-list.component.html',
  styleUrls: ['./interview-list.component.scss']
})
export class InterviewListComponent implements OnInit {
  private jwtToken=null;
  interviews;
  private allItems;
  private Notyf = require('notyf');
  private notyf2 = new this.Notyf({
      delay:4000,
      alertIcon: 'fa fa-exclamation-circle',
      confirmIcon: 'fa fa-check-circle'  
  });

  // pager object
  pager: any = {};
  // paged items
  pagedItems: any[];
  candidateId : number;

  constructor(public route: ActivatedRoute,
    private evalService : EvaluationService,private pagerService: PagerService,private router:Router,
    private candidateService: CandidateService) { }

  ngOnInit() {
    this.loadToken();
    if(!this.jwtToken){
      this.router.navigate(['']);
    }

    this.route.params.subscribe(params => {
      this.candidateId = params['candidateId'];
    });

    this.getInterview();
  }

  loadToken(){
    this.jwtToken=localStorage.getItem('token');
  }

  setPage(page: number) {
    if (page < 1 || page > this.pager.totalPages) {
        return;
    }
    // get pager object from service
    this.pager = this.pagerService.getPager(this.allItems.length, page);

    // get current page of items
    this.pagedItems = this.interviews.slice(this.pager.startIndex, this.pager.endIndex + 1);
  }

  getInterview(){
    this.evalService.getallInterviews().subscribe(resp => {
      this.interviews = resp.body;
      this.allItems = resp.body;
      console.log(resp.body)
      this.allItems.reverse();
      this.setPage(1);
    }, err => {
      console.log(err);
    })
  }

  sendTocandidates(interview){
    this.router.navigate(['candidate/list/interview/'+interview.id])
  }

  redirectNewInterview(){
    this.router.navigate(['quizz/create']);
  }

  sendTocandidatesV1(interview){
    this.candidateService.convocateInterview(this.candidateId, interview.id).subscribe(resp=>{
      console.log("convocated");
      this.notyf2.confirm('Entretien envoyé au candidat');
      this.router.navigate(['candidate/details/'+this.candidateId]);
    });
  }

}
