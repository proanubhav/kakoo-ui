import { Component, OnDestroy, OnInit } from '@angular/core';
import { FormControl, FormGroup, Validators, RadioControlValueAccessor } from "@angular/forms";
import { CandidateService } from "../candidate.service";
import { AuthenticationService } from "../../user/services/authentication.service"
import { Candidate } from "../candidate";
import { ActivatedRoute, Router } from '@angular/router';
import { Skill } from "../skill";
import { AbstractControl, ValidatorFn } from '@angular/forms';
import 'notyf/dist/notyf.min.css';
declare var require: any;


export class customValidationService {
  static checkLimit(min: number, max: number): ValidatorFn {
    return (c: AbstractControl): { [key: string]: boolean } | null => {
      if (c.value && (isNaN(c.value) || c.value < min || c.value > max)) {
        return { 'range': true };
      }
      return null;
    };
  }
}


@Component({
  selector: 'app-candidate-create',
  templateUrl: './candidate-create.component.html',
  styleUrls: ['./candidate-create.component.scss'],
  providers: [CandidateService]
})
export class CandidateCreateComponent implements OnInit, OnDestroy {
  id: number;
  candidate: Candidate;
  candidateForm: FormGroup;
  candidateId: number;
  private sub: any;
  editing = false;
  private jwtToken = null;
  private Notyf = require('notyf');
  private notyf2 = new this.Notyf({
    delay: 4000,
    alertIcon: 'fa fa-exclamation-circle',
    confirmIcon: 'fa fa-check-circle'
  })


  constructor(public route: ActivatedRoute,
    private router: Router,
    private candidateService: CandidateService,
    private authenticationService: AuthenticationService) { }

  ngOnInit() {
    this.loadToken();
    if (!this.jwtToken) {
      this.router.navigate([''])
    }
    this.sub = this.route.params.subscribe(params => {
      this.id = params['id'];
    });
    this.candidateForm = new FormGroup({
      firstName: new FormControl('', [Validators.required, Validators.minLength(5)]),
      lastName: new FormControl('', [Validators.required, Validators.minLength(5)]),
      email: new FormControl('', [
        Validators.required,
        Validators.pattern("[^ @]*@[^ @]*")
      ]),
      address: new FormControl('', [Validators.required, Validators.minLength(5)]),
      civility: new FormControl('', Validators.required),
      mobilePhone: new FormControl('', [Validators.required, Validators.minLength(10)]),
      mobility: new FormControl('', [Validators.required]),
      profile: new FormControl('', [Validators.required, Validators.minLength(5)]),
      experience: new FormControl('', [Validators.required])
    });

    if (this.id) { //edit form
      this.editing = true;

      this.candidateService.findByUuid(this.id).subscribe(

        res => {
          //console.log(res.body['nExperience'])

          //this.id = candidate.id;
          this.candidateId = res.body['id'];
          this.candidateForm.patchValue({
            firstName: res.body['firstName'],
            lastName: res.body['lastName'],
            email: res.body['email'],
            address: res.body['address'],
            civility: res.body['gender'],
            mobilePhone: res.body['mobilePhone'],
            mobility: res.body['mobilityArea'],
            profile: res.body['profile'],
            experience: res.body['nExperience']

          });
          // console.log(res.body)
        }, error => {
          //console.log(error);
        }
      );

    }
  }
  ngOnDestroy(): void {
    this.sub.unsubscribe();
  }
  loadToken() {
    this.jwtToken = localStorage.getItem('token');
  }
  

  get f() {
    return this.candidateForm.controls;
  }

  onSubmit() {
    console.log(this.candidateId );
    if (this.candidateForm.valid) {
      if (this.candidateId) {

        let candidate: Candidate = new Candidate(this.candidateId,
          this.candidateForm.controls['firstName'].value,
          this.candidateForm.controls['lastName'].value,
          this.candidateForm.controls['email'].value,
          this.candidateForm.controls['address'].value,
          this.candidateForm.controls['civility'].value,
          this.candidateForm.controls['mobilePhone'].value,
          this.candidateForm.controls['mobility'].value,
          this.candidateForm.controls['profile'].value,
          this.candidateForm.controls['experience'].value
        );
        this.authenticationService.updateCandidate(candidate).subscribe(
          resp => {
            this.notyf2.confirm(' Candidat modifié avec succès');
            console.log('Resp', resp)
            this.redirectCandidatePage(this.id);

          }, err => {
            //console.log(err);
            this.notyf2.alert('Echec de modification de candidat , vous avez des champs invalide')
          }
        );
      } else {
        let candidate: Candidate = new Candidate(0,
          this.candidateForm.controls['firstName'].value,
          this.candidateForm.controls['lastName'].value,
          this.candidateForm.controls['email'].value,
          this.candidateForm.controls['address'].value,
          this.candidateForm.controls['civility'].value,
          this.candidateForm.controls['mobilePhone'].value,
          this.candidateForm.controls['mobility'].value,
          this.candidateForm.controls['profile'].value,
          this.candidateForm.controls['experience'].value
        );
        this.authenticationService.saveCandidate(candidate).subscribe(
          resp => {
              this.notyf2.confirm('Nouveau candidat ajouté');
              // this.redirectCandidatePage(resp.body.object.uuid);
              this.candidateForm.reset();
              this.router.navigate(['/candidate/list/']);

          }, err => {
            //console.log(err)
            this.notyf2.alert('Echec de création de candidat , vous avez des champs invalide')
            // console.log(err.error.errorMessage);
             this.candidateForm.reset();
            // console.log(err.error)
            // console.log(err.error.errors)
            // for(let e of err.error.errors ){
            // console.log(e)
            //this.handleErros(e) ff
            //}

          }
        );
      }

    }

  }
  redirectCandidatePage(uuid: number) {
    this.router.navigate(['/candidate/details/', uuid]);

  }
  redirectAllCandidatePage() {
    this.router.navigate(['/candidate/list']);

  }
  cancelOperation() {
    if (this.editing)
      this.router.navigate(['/candidate/details/', this.id]);
    else
      this.router.navigate(['/candidate/list']);

  }

  typeOfInput() {
    if (!this.typeOfInput() || this.typeOfInput() == 'text') {
      return 'password';
    }
    else
      return 'text';
  }

}
