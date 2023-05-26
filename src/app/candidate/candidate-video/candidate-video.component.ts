import { Component, OnInit, ViewChild } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { CandidateService } from "../candidate.service";
import 'notyf/dist/notyf.min.css';
import 'rxjs/add/operator/toPromise';
import * as _ from 'underscore';
import * as RecordRTC from 'recordrtc';
import { User } from '../../user/user.model';
import { AuthenticationService } from '../../user/services/authentication.service';
import { AutoVisuelPolitiqueComponent } from '../../confidentiality/auto-visuel-politique/auto-visuel-politique.component';
import { MatDialog } from '@angular/material';
declare var require: any;



@Component({
  selector: 'app-candidate-video',
  templateUrl: './candidate-video.component.html',
  styleUrls: ['./candidate-video.component.scss']
})
export class CandidateVideoComponent implements OnInit {
  token: string;
  interviewId: number;
  candidateId: number;
  questionId: number;
  started: boolean = false;
  questions;
  question: string = "";
  next: number = 0;
  timer;
  qnProgress: number;
  bgColor: string;
  fgColor: string;
  seconds: number = 0;
  recordedBlob;
  finished: boolean = false;
  isUserConnected: boolean;
  private questionProgress: number;
  private jwtToken = null;
  private stream: MediaStream;
  private mediaConstraints: MediaStreamConstraints;
  private recordRTC: any;
  private Notyf = require('notyf');
  private notyf2 = new this.Notyf({
    delay: 4000,
    alertIcon: 'fa fa-exclamation-circle',
    confirmIcon: 'fa fa-check-circle'
  });

  @ViewChild('video') video;
  videoo: HTMLVideoElement = null;

  constructor(
    public route: ActivatedRoute,
    private router: Router,
    private candidateService: CandidateService,
    private authenticationService: AuthenticationService,
    private matDialog: MatDialog) {
  }

  ngOnInit() {
    this.loadToken();
    this.isUserConnected= this.jwtToken == null ? false : true;
    if (!this.isUserConnected)  {
       this.started = false;
       this.route.params.subscribe(params => {
         this.candidateId = params['candidateId'];
         this.interviewId = params['interviewId'];
       });
      } 
  }

  async getonnectedUser() {
    let resp = await this.authenticationService.getConnectedUser().toPromise();
      
  }

  loadToken() {
    this.jwtToken = localStorage.getItem('token');
  }

  start() {

    this.started = true;
    this.candidateService.getInterviewQuestions(this.interviewId).subscribe(resp => {
      this.questions = resp;
      this.question = this.questions[this.next];
      this.questionId = this.questions[this.next].id;
      this.startRecording();
      this.timer = setInterval(() => {
        if (this.seconds < 60) {
          this.seconds++;
          this.questionProgress = 100 * (this.seconds / 60);
        }
        else {
          this.nextQuestion();
          return;
        }
      }, 1000);

    }, err => {
      //console.log("error : " + err);
    })
  }

  nextQuestion() {
    this.next = this.next + 1;
    if (this.questions != null && this.next < this.questions.length) {
      this.stopRecording();
      // save the ex one and upload video to server
      this.startRecording();

      this.question = this.questions[this.next];
      this.questionId = this.questions[this.next].id;
      clearInterval(this.timer);
      this.seconds = 0;
      this.timer = setInterval(() => {
        if (this.seconds < 60) {
          this.seconds++;
          //this.questionProgress=Math.floor(this.seconds / 20)*100;
          this.questionProgress = 100 * (this.seconds / 60);
        }
        else {
          this.stopRecording();
          return;
        }
      }, 1000);
    } else {
      clearInterval(this.timer);
      this.seconds = 0;
      this.finished = true;
      this.stopRecording();
      this.candidateService.notifyCreator(this.candidateId, this.interviewId).subscribe(resp => {
        console.log("notified ");
      }, err => {
        console.log("error is " + err);
      });
    }
  }

  displayTimeElapsed() {
    var a = Math.floor(this.seconds / 3600);
    var b = Math.floor(this.seconds / 60);
    var c = Math.floor(this.seconds % 60);
    return '' + a + ' : ' + b + ' : ' + c;
  }

  toggleControls() {
    if (this.videoo === null) { this.videoo = this.video.nativeElement; }
    this.videoo.muted = true;
    this.videoo.controls = true;
    this.videoo.autoplay = true;
  }

  successCallback(stream: MediaStream) {

    var options = {
      mimeType: 'video/webm', // or video/webm\;codecs=h264 or video/webm\;codecs=vp9
      audioBitsPerSecond: 128000,
      videoBitsPerSecond: 128000,
      bitsPerSecond: 128000 // if this line is provided, skip above two
    };
    this.stream = stream;
    this.recordRTC = RecordRTC(stream, options);
    this.recordRTC.startRecording();
    let video: HTMLVideoElement = this.video.nativeElement;
  
    try {
      video.srcObject = stream;
    } catch (error) {
      // --- createObjectURL(stream) is deprecated
      video.src = window.URL.createObjectURL(stream);
    }
    this.toggleControls();
  }

  errorCallback() {
    //console.log("video started error ");
  }

  processVideo(audioVideoWebMURL) {
    //let video: HTMLVideoElement = this.video.nativeElement;
    let recordRTC = this.recordRTC;
    //video.src = audioVideoWebMURL;
    this.toggleControls();
    this.recordedBlob = recordRTC.getBlob();
    recordRTC.getDataURL(function (dataURL) { });
    this.download();
    //console.log(this.finished);  
  }

  startRecording() {
    this.mediaConstraints = {
      video: true, audio: true
    };
    navigator.mediaDevices
      .getUserMedia(this.mediaConstraints)
      .then(this.successCallback.bind(this), this.errorCallback.bind(this));
  }

  stopRecording() {
    //console.log("executed");
    let recordRTC = this.recordRTC;
    recordRTC.stopRecording(this.processVideo.bind(this));
    let stream = this.stream;
    stream.getAudioTracks().forEach(track => track.stop());
    stream.getVideoTracks().forEach(track => track.stop());
    //this.download(); // save the current recording to server
  }

  download() {
    var file = new File([this.recordedBlob], 'video.webm', {
      type: 'video/webm'
    });

    var formData = new FormData();
    formData.append('file', file);
    this.candidateService.pushVideotoServer(formData, this.candidateId, this.questions[this.next - 1].id)
      .subscribe(resp => {
        console.log("sent");
      }, error => {
        console.log("error=> " + error);
      });

    this.notyf2.confirm('Bien enregistrè');
  }

  goPolitiqeAudioVisuel(): void {
    let dialogRef = this.matDialog.open(
      AutoVisuelPolitiqueComponent, {
        width: '800px',
        panelClass: 'my-mat-dialog-container'
      }
    );
  }

}
