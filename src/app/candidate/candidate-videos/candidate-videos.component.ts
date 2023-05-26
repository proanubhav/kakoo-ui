import { Component, OnInit } from '@angular/core';
import { CandidateService } from "../candidate.service"
import { Router } from '@angular/router';

import 'rxjs/add/operator/map'

import * as _ from 'underscore';

import { ActivatedRoute, NavigationEnd } from '@angular/router';
import { NgbModal, ModalDismissReasons } from '@ng-bootstrap/ng-bootstrap';
import { environment } from '../../../assets/environments/environment';
declare var require: any;

@Component({
  selector: 'app-candidate-videos',
  templateUrl: './candidate-videos.component.html',
  styleUrls: ['./candidate-videos.component.scss']
})
export class CandidateVideosComponent implements OnInit {

  private closeResult: string;
  private jwtToken = null;
  private candidateId: number;
  private apiUrl = environment.apiUrl;
  videos;
  video;
  interview: string;
  file;
  isUserConnected: boolean;


  constructor(public route: ActivatedRoute, private router: Router,
    private candidateService: CandidateService, private modalService: NgbModal) { }

  ngOnInit() {
    //console.log("test");
    this.loadToken();
    this.isUserConnected= this.jwtToken == null ? false : true;
    if (this.isUserConnected) {
      this.route.params.subscribe(params => {
        this.candidateId = params['candidateId'];
      });

      this.candidateService.getVideos(this.candidateId).subscribe(resp => {
        this.videos = resp;
        this.interview = this.videos[0].question.interview.name;
        //console.log(resp);
      }, err => {
        //console.log(err);
      })
    }
  }

  loadToken() {
    this.jwtToken = localStorage.getItem('token');
  }

  open(content, video) {
    this.modalService.open(content, { size: 'lg' }).result.then((result) => {
      this.closeResult = `Closed with: ${result}`;
    }, (reason) => {
      this.closeResult = `Dismissed ${this.getDismissReason(reason)}`;
    });
    var filename = video.link.replace(/^.*(\\|\/|\:)/, "");
    this.file = this.apiUrl + 'candidate/download/video?path=' + filename;
  }

  private getDismissReason(reason: any): string {
    if (reason === ModalDismissReasons.ESC) {
      return 'by pressing ESC';
    } else if (reason === ModalDismissReasons.BACKDROP_CLICK) {
      return 'by clicking on a backdrop';
    } else {
      return `with: ${reason}`;
    }
  }

  redirectLogin() {
    this.router.navigate(['/user/login']);
  }
}
