import { Component, OnInit } from '@angular/core';
import { HttpClient, HttpResponse, HttpEventType } from '@angular/common/http';
import { UploadService } from '..//upload.service';
import { CandidateService } from '../../candidate/candidate.service';
import { ActivatedRoute, Router } from '@angular/router';
import { Candidate } from '../../candidate/candidate';
import { Cv } from '../../candidate/cv';
import { Observable } from "rxjs/Observable";
import 'rxjs/add/operator/map'
import 'rxjs/add/operator/catch';
import 'rxjs/add/observable/throw';
import { DetailsUploadComponent } from '../details-upload/details-upload.component';
import { MatDialog } from '@angular/material';

@Component({
  selector: 'app-form-upload',
  templateUrl: './form-upload.component.html',
  styleUrls: ['./form-upload.component.scss']
})
export class FormUploadComponent implements OnInit {

  selectedFiles: FileList;
  currentFileUpload: File;
  progress: { percentage: number } = { percentage: 0 }

  id: number;
  uuid: number;
  myid: number;
  firstName: string;
  lastName: string;
  candidate: Candidate;
  cvs: Cv[];
  cv: Cv;
  private sub: any;
  public alpha = false;
  private jwtToken = null;
  errorMessageMxSize: string = undefined;
  errorMessageMaxCv: string = undefined;
  errorMessageTypeFormatt: string = undefined;

  constructor(
    private matDialog: MatDialog,
    private uploadService: UploadService,
    private candidateService: CandidateService,
    public route: ActivatedRoute,
    private router: Router) { }

  ngOnInit() {
    // scoll to top
    window.scroll(0, 0);
    this.loadToken();
    if (!this.jwtToken) {
      this.router.navigate([''])
    }
    this.sub = this.route.params.subscribe(params => {
      this.id = params['id'];
      this.getOneCandidate(this.id);
    });

  }
  selectFile(event) {
    this.errorMessageMaxCv = undefined;
    this.errorMessageMxSize = undefined;
    this.errorMessageTypeFormatt = undefined;
    this.selectedFiles = event.target.files;
  }
  loadToken() {
    this.jwtToken = localStorage.getItem('token');
  }
  getOneCandidate(id: number) {
    if (id) {
      this.candidateService.findByUuid(id).subscribe(
        resp => {
          this.candidate = new Candidate(resp.body['id'],
            resp.body['firstName'],
            resp.body['lastName'],
            resp.body['email'],
            resp.body['address'],
            resp.body['gender'],
            resp.body['mobilePhone'],
            resp.body['mobilityArea'],
            resp.body['profile'],
            resp.body['nExperience']
          );

          this.myid = this.candidate.id;
          // //console.log('MY ID IS '+this.myid)
          this.firstName = this.candidate.firstName;
          this.lastName = this.candidate.lastName;
          this.candidate.uuid = resp.body['uuid'];
          this.uuid = this.candidate.uuid;
          // //console.log('TEST    '+resp.body);
          this.firstName = resp.body['firstName'];
          this.lastName = resp.body['lastName'];
          this.cvs = resp.body['CVs'];

        },
        err => {

          // //console.log('NOT ALLOWED TO SEE USER')
          // //console.log(err)
        }
      )

    }
  }

  upload() {

    this.progress.percentage = 0;

    this.currentFileUpload = this.selectedFiles.item(0)
    this.uploadService.pushFileToStorage(this.currentFileUpload, this.myid).subscribe(event => {
      if (event.type === HttpEventType.UploadProgress) {
        this.progress.percentage = Math.round(100 * event.loaded / event.total);

      } else if (event instanceof HttpResponse) {
        // //console.log('File is completely uploaded!');
        this.alpha = true;
        this.selectedFiles = undefined;
      }
      progress => {
        if (progress) {
          // //console.log("upload progress:", progress);
        }
      }

    }, err => {
      switch (err.status) {
        case 403:
          this.errorMessageMaxCv = "Max cv atteint deux cv pour candidat";
          break;
        case 401:
        case 400:
          this.errorMessageTypeFormatt = "Format non valid Merci de telecharger un Cv Format pdf,doc,docx";
          break;
        case 507:
          this.errorMessageMxSize = "La taille maximale a atteint 1 Mo pour chaque CV";
          break;
      }

    })
    this.cvs = [];
    this.cvs.push(this.cv);
    //console.log(this.cvs);

  }
  go(): void {
    this.parseCV(this.candidate.id);

  }
  goBackCandidate(uuid) {
    this.router.navigate(['/candidate/details/' + uuid]);
  }

  parseCV(id: number): void {

    let dialogRef = this.matDialog.open(
      DetailsUploadComponent,
      {
        width: '800px',
        height: 'auto',
        panelClass: 'my-mat-dialog-container',
        data: { id: id }
      }
    );
  }
}
