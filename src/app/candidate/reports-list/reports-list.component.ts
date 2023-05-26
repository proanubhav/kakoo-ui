import { Component, OnInit } from '@angular/core';
import { CandidateService } from '../candidate.service';
import { Router, ActivatedRoute } from '@angular/router';
import { AuthenticationService } from '../../services/authentication.service';
import { environment } from '../../../assets/environments/environment';


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
  selector: 'app-reports-list',
  templateUrl: './reports-list.component.html',
  styleUrls: ['./reports-list.component.scss']
})
export class ReportsListComponent implements OnInit {
  private apiUrl = environment.apiUrl;
  sub: any;
  uuid: any;
  candidatId: number;
  array: Array<Gassessement> = [];
  firstName: string;
  lastName: string;

  constructor(
    public route: ActivatedRoute,
    public router: Router,
    private candidatService: CandidateService,
  ) { }

  ngOnInit() {
    this.route.params.subscribe(params => {
      this.uuid = params['candidateId'];
      //console.log(this.uuid)
    });
    this.getGAssessementsByCandidate();
  }

  getGAssessementsByCandidate() {

    this.candidatService.findByUuid(this.uuid).subscribe(

      res => {
        this.candidatId = res.body['id'];
        this.firstName = res.body['firstName'];
        this.lastName = res.body['lastName'];
        this.candidatService.getGAssessementsByCandidate(this.candidatId).subscribe(
          resp => {

            //console.log("ffffffffffffff" + resp);
            let i = 0;
            while (resp.body[i] != null) {

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
              this.array.push(gassessement);
              i++;
            }
          }

        );
      }
    );
  }

  open(idgassessement: number, token: string): void {

    let url = this.apiUrl + "reports/download?assessmentId=" + idgassessement + "&token=" + token;
    window.open(url);
  }
}
