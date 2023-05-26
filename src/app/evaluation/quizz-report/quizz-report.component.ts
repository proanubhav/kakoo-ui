import { Component, OnInit } from '@angular/core';
import { Router,ActivatedRoute } from '@angular/router';
import{Test} from '../test';
import{EvaluationService} from '../evaluation.service';
import { PagerService } from '../../candidate/services/pager.service';
declare var require: any;


@Component({
  selector: 'app-quizz-report',
  templateUrl: './quizz-report.component.html',
  styleUrls: ['./quizz-report.component.scss']
})
export class QuizzReportComponent implements OnInit {
  public uuid : false;
  constructor(public route: ActivatedRoute,
    private evalService : EvaluationService,private pagerService: PagerService,private router:Router) { }

  ngOnInit() {
    this.getAssessement();
  }
  getAssessement(){
    this.evalService.getAssessement(1).subscribe(resp=>{
      console.log('Assesemnt');
      console.log(resp);
    })
  }

}
