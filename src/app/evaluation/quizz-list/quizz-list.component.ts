import { Component, OnInit } from '@angular/core';
import { Router,ActivatedRoute } from '@angular/router';
import{Test} from '../test';
import{EvaluationService} from '../evaluation.service';
import { PagerService } from '../../candidate/services/pager.service';
declare var require: any;



@Component({
  selector: 'app-quizz-list',
  templateUrl: './quizz-list.component.html',
  styleUrls: ['./quizz-list.component.scss']
})
export class QuizzListComponent implements OnInit {
  private jwtToken=null;
  private allTests;
  private allItems;
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

  constructor(public route: ActivatedRoute,
    private evalService : EvaluationService,private pagerService: PagerService,private router:Router) { }

  ngOnInit() {
    this.loadToken();
    if(!this.jwtToken){
      this.router.navigate(['']);
    }
    this.sub = this.route.params.subscribe(params => {
      this.uuid = params['uuid'];
      if(this.uuid){
    //do nothing ;)
        }
      
    });
    this.getTests();
    this.quizzSent=false;
  }
  loadToken(){
    this.jwtToken=localStorage.getItem('token');
}
redirectNewQuizz(){
  this.router.navigate(['quizz/create']);
}
onFilterChange(eve: any,quizz) {
  console.log('test')
  quizz.selected=!quizz.selected;
  console.log(quizz.selected)
}
goQuizzpage(quizz){
  this.router.navigate(['quizz-result/'+quizz.id]);
  console.log(quizz.name);
}
sendQuizz(){
  for(let item of this.allItems){
    if(item.selected){
      console.log(item.name)
      this.evalService.convocate(item.id,this.uuid).subscribe(resp=>{
        console.log('assesssement')
        console.log(resp);
       
      });

    }
  }
  this.notyf2.confirm('Quizz Envoyé au candidat ');
  this.router.navigate(['candidate/details/'+this.uuid])
}
sendTocandidates(quizz){
  this.router.navigate(['candidate/list/'+quizz.id])
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
}
