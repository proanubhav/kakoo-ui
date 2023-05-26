import { Component, OnInit } from '@angular/core';
import { ActivatedRoute, Router, NavigationEnd } from '@angular/router';
import { CandidateService } from "../candidate.service";
import { Candidate } from "../candidate";
import { Skill } from "../skill";
import { Cv } from "../cv";
import { FormControl, FormGroup, Validators, ReactiveFormsModule } from "@angular/forms";
import { Directive, ElementRef, HostListener, Renderer, forwardRef } from '@angular/core';
import { ControlValueAccessor, NG_VALUE_ACCESSOR } from '@angular/forms';
import { HttpClient, HttpResponse, HttpEventType } from '@angular/common/http';
import { SocialNetwork } from '../social-network';
import { Experience } from '../experience';
import { Poste } from '../poste';
import { Language } from '../language';
import { Observable } from 'rxjs/Observable';
import { startWith } from 'rxjs/operators/startWith';
import { map } from 'rxjs/operators/map';
//import {MatAutocompleteModule} from '@angular/material/autocomplete';
import 'rxjs/add/operator/filter';
import { MatAutocompleteModule } from '@angular/material/autocomplete';
//import { } from '../langs.json';
//import * as $ from 'jquery';
import { environment } from '../../../assets/environments/environment';
import 'notyf/dist/notyf.min.css';

declare var require: any;
declare var $: any;



export class Lang {
  name: string;
  constructor(name: string) {
    this.name = name;
  }
}
export class AutoSkill {
  name: string;
  constructor(name: string) {
    this.name = name;
  }
}



@Component({
  selector: 'app-details-candidate',
  templateUrl: './details-candidate.component.html',
  styleUrls: ['./details-candidate.component.scss']
})
export class DetailsCandidateComponent implements OnInit {
  private apiUrl = environment.apiUrl;
  id: number;
  private sub: any;
  public candidate: Candidate;
  public firstName: string;
  public lastName: string;
  public profile: string;
  private email: string;
  public imageSrc: string;
  private address: string;
  private candidateId: number;
  private birthDay: Date;
  private desiredSalary: number;
  private cvs: Cv[];
  private skills: Skill[];
  private languages: Language[];
  private actualPoste: Poste;
  private desiredPoste: Poste;
  private socialNetworks: SocialNetwork[];
  private experiences: Experience[];
  public exist: boolean;
  private newSkillAdd: boolean;
  private skillsEdit: boolean;
  private positionsEdit: boolean;
  private contactEdit: boolean;
  private languagesEdit: boolean;
  private newSocialNetworkAdd: boolean;
  private imageId: string;
  skillForm: FormGroup;
  languageForm: FormGroup;
  socialNetworkForm: FormGroup;
  positionForm: FormGroup;
  desiredPositionForm: FormGroup;
  public deleteCandidateConfirm: boolean;
  private newPositionAdding: boolean;
  private newDesiredPositionAdding: boolean;
  private gender: string;
  private mobilePhone: string;
  private newLanguageAdd: boolean;
  private socialNets = [];
  private jwtToken = null;
  private Notyf = require('notyf');
  private notyf2 = new this.Notyf({
    delay: 4000,
    alertIcon: 'fa fa-exclamation-circle',
    confirmIcon: 'fa fa-check-circle'
  });


  langCtrl: FormControl;
  langType: FormControl;
  filteredLangs: Observable<any[]>;

  skillCtrl: FormControl;
  skillDescription: FormControl;
  skillEvaluate: FormControl;
  skillT: FormControl;
  filteredSkills: Observable<any[]>;
  autoSkills: AutoSkill[];

  langs: Lang[];
  langTest: Lang[];
  selectedFiles: FileList;
  currentFileUpload: File;
  deleteImg: String;

  constructor(public route: ActivatedRoute,
    private router: Router,
    private candidateService: CandidateService,
    private http: HttpClient
  ) {
    router.events.subscribe(s => {
      if (s instanceof NavigationEnd) {
        const tree = router.parseUrl(router.url);
        if (tree.fragment) {
          const element = document.querySelector("#" + tree.fragment);
          if (element) { element.scrollIntoView(true); }
        }
      }
    });
    /* this.getJSON().subscribe(data => {
       //console.log(data)
   });*/
    this.langCtrl = new FormControl();
    this.langType = new FormControl();
    this.skillCtrl = new FormControl();
    this.skillDescription = new FormControl();
    this.skillEvaluate = new FormControl();
    this.skillT = new FormControl();

    /*function loadLanguages() {
      $.getJSON("./assets/langs.json", function (data) {
          this.langTest = data.quiz;
          var currentLang = this.langTest[2].name;
          //console.log(currentLang);
      })
    }
    loadLanguages();*/

    this.filteredLangs = this.langCtrl.valueChanges
      .pipe(
        startWith(''),
        map(lang => lang ? this.filterLangs(lang) : this.langTest.slice())
      );
    this.filteredSkills = this.skillCtrl.valueChanges
      .pipe(
        startWith(''),
        map(autoskill => autoskill ? this.filterSkills(autoskill) : this.autoSkills.slice())
      );
  }

  /*  public getJSON(): Observable<any> {
      return this.http.get("./assets/langs.json");
  }*/
  filterLangs(name: string) {
    return this.langTest.filter(lang =>
      lang.name.toLowerCase().indexOf(name.toLowerCase()) === 0);

  }
  filterSkills(name: string) {
    return this.autoSkills.filter(autoskill =>
      autoskill.name.toLowerCase().indexOf(name.toLowerCase()) === 0);

  }

  ngOnInit() {

    this.deleteImg = "assets/home/images/delete.png";

    this.loadToken();
    if (!this.jwtToken) {
      this.router.navigate([''])
    }
    this.candidate;
    this.newSkillAdd = false;
    this.newSocialNetworkAdd = false;
    this.newLanguageAdd = false;
    this.deleteCandidateConfirm = false;
    this.newPositionAdding = false;
    this.newDesiredPositionAdding = false;
    this.skillsEdit = false;
    this.positionsEdit = false;
    this.contactEdit = false;
    this.languagesEdit = false;
    this.langTest = [];
    this.autoSkills = [];
    //  this.loadLanguages(this.langTest);
    // this.loadSkills(this.autoSkills);
    this.getSkill(this.autoSkills);
    this.getLanguage(this.langTest);

    this.imageSrc = "assets/home/images/loading.gif";

    this.sub = this.route.params.subscribe(params => {
      this.id = params['id'];
      if (this.id) {
        this.getOneCandidate(this.id);

      }


    });




    this.skillForm = new FormGroup({
      skillName: new FormControl('', Validators.required),
      skillDescription: new FormControl('', Validators.required),
      skillType: new FormControl('', Validators.required),
      skillScore: new FormControl('', Validators.required),
    });
    this.languageForm = new FormGroup({
      languageName: new FormControl('', Validators.required),
      languageType: new FormControl('', Validators.required),
    });
    this.socialNetworkForm = new FormGroup({
      socialNetworkType: new FormControl('', Validators.required),
      socialNetworkUrl: new FormControl('', Validators.required)
    });
    //this.positionForm (coming soon)
    this.positionForm = new FormGroup({
      positionName: new FormControl('', Validators.required),
      positionDescription: new FormControl('', Validators.required),
      positionSalary: new FormControl('', Validators.required),
      positionCurrency: new FormControl('', Validators.required),
      positionCompany: new FormControl('', Validators.required),
      positionType: new FormControl('', Validators.required),
      positionDate: new FormControl('', Validators.required)
    });
    //desired position form ;)
    this.desiredPositionForm = new FormGroup({
      positionName: new FormControl('', Validators.required),
      positionDescription: new FormControl('', Validators.required),
      positionSalary: new FormControl('', Validators.required),
      positionCurrency: new FormControl('', Validators.required),
      positionMobility: new FormControl('', Validators.required),
      ///desiredPositionCompany:new FormControl(),
      //positionSkills:new FormControl('',Validators.required),
      positionType: new FormControl('', Validators.required)
    });


  }
  loadToken() {
    this.jwtToken = localStorage.getItem('token');
  }

  /*loadLanguages(langg:Lang[]) {
    $.getJSON("./assets/langs.json", function (data) {
      for (var i = 0; i < data.langs.length; i++) {
        langg.push({name:data.langs[i].name})
      }
  })
}
      loadSkills(askill:AutoSkill[]) {
      $.getJSON("./assets/langs.json", function (data) {
        for (var i = 0; i < data.skills.length; i++) {
          askill.push({name:data.skills[i].name})
        }
    })
    }*/
  getSkill(askill) {
    this.candidateService.getSkills().subscribe(
      resp => {
        let i = 0;
        while (resp.body[i] != null) {
          //askill[i]=resp.body[i]
          askill.push({ name: resp.body[i] })
          i++;
        }
        //console.log('skills uploaded')
        //console.log(askill)

      }
    )
  }
  getLanguage(language) {
    this.candidateService.getlanguages().subscribe(
      resp => {
        let i = 0;
        while (resp.body[i] != null) {
          //askill[i]=resp.body[i]
          language.push({ name: resp.body[i] })
          i++;
        }
        //console.log('skills uploaded')
        //console.log(language)

      }
    )
  }

  getOneCandidate(id: number) {
    if (id) {
      this.exist = true;
      this.candidateService.findByUuid(id).subscribe(
        resp => {
          if (resp.body) {
            this.candidate = new Candidate(
              resp.body['id'],
              resp.body['firstName'],
              resp.body['lastName'],
              resp.body['email'],
              resp.body['address'],
              resp.body['gender'],
              resp.body['mobilePhone'],
              resp.body['mobilityArea'],
              resp.body['profile'],
              resp.body['nExperience']
            )
            this.candidate.uuid = resp.body['uuid'];
            // //console.log(resp.body);
            this.firstName = resp.body['firstName'];
            this.lastName = resp.body['lastName'];
            this.email = resp.body['email'];
            this.birthDay = resp.body['birthDay'];
            this.address = resp.body['address'];
            this.skills = resp.body['skills'];
            this.socialNetworks = resp.body['socialNetworks'];
            this.actualPoste = resp.body['actualPoste'];
            this.desiredPoste = resp.body['desiredPoste'];
            this.gender = resp.body['gender'];
            this.profile = resp.body['profile'];
            this.mobilePhone = resp.body['mobilePhone'];
            this.languages = resp.body['languages'];
            this.cvs = resp.body['CVs'];
            // this.getPhoto(resp.body['id']);
            this.candidateId = resp.body['id'];
            //console.log(this.gender)
            if (resp.body['photo']) {
              this.imageSrc = this.apiUrl + "candidates/" + this.candidateId + "/downloadPhoto";
              //console.log('foto founded')
              // //console.log(this.imageSrc)
            }
            else
            // this.imageSrc="assets/home/images/user.png";
            {
              if (this.gender == 'Homme')
                this.imageSrc = "assets/home/images/male-candidate.png"
            }
            if (this.gender == "Femme")
              this.imageSrc = "assets/home/images/female-candidate.png"

          }
          else {
            this.exist = false;
            this.router.navigate(['/candidate/notfound']);
          }

        },
        err => {
          //console.log('error is: ' + err);
          //this.router.navigate(['/candidate/notfound']);
        }
      )

    }
  }

  getCv(cv: Cv) {
    window.open(this.apiUrl + 'download/' + cv.uuid);

  }
  redirectCvUpload(candidate: Candidate) {
    this.router.navigate(['/candidate/upload/form/', this.id]);

  }
  redirectEditPage(candidate: Candidate) {
    this.router.navigate(['/candidate/edit/', candidate.uuid]);

  }


  deleteCandidate(can: Candidate) {
    if (can) {
      this.candidateService.deleteCandidateById(can.id).subscribe(
        resp => {
          console.log(resp);
          this.exist = false;
          //console.log('done');
          this.notyf2.confirm('Candidat supprimé');
          this.router.navigate(['candidate/list'])
        },
        err => {
          //console.log(err);
          //console.log('not done');
        }
      );
    }
  }
  getPhoto(id: number) {
    this.candidateService.getPhoto(id).subscribe(
      resp => {
        if (resp.body) {
          this.imageId = resp.body['uuid'];
          this.imageSrc = this.apiUrl + 'Photodownload/' + this.imageId;
          this.candidate.photoUrl = this.imageSrc;
          //  //console.log(this.candidate.photoUrl)
          // //console.log(this.imageSrc)
          //console.log(this.imageId);
        }
        else {
          this.imageSrc = "../assets/home/images/user.png"
        }
      }
    );
  }


  addNewSkill(id: number) {
    let skill: Skill = new Skill(this.skillForm.controls['skillType'].value, this.skillForm.controls['skillName'].value,
      this.skillForm.controls['skillDescription'].value, this.skillForm.controls['skillScore'].value, null);
    this.candidateService.addSkillById(this.id, skill).subscribe();
    this.getOneCandidate(this.id);
    //location.reload();

  }
  selectFile(event) {

    this.selectedFiles = event.target.files;
    if (this.selectedFiles.item(0))
      this.upload();
  }
  upload() {


    this.currentFileUpload = this.selectedFiles.item(0)
    this.candidateService.pushFileToStorage(this.currentFileUpload, this.candidate.id).subscribe(event => {
      //console.log(event);
      if (event.type === HttpEventType.UploadProgress) {
        //this.progress.percentage = Math.round(100 * event.loaded / event.total);
        //this.imageUrl=this.apiUrl+"users/"+this.userId+"/downloadPhoto   ";
        this.imageSrc = this.apiUrl + "candidates/" + this.candidateId + "/downloadPhoto ";

      } else if (event instanceof HttpResponse) {
        //console.log('FILE UPLOADEEEEED');
        //console.log(event);
        this.imageSrc = this.apiUrl + "candidates/" + this.candidateId + "/downloadPhoto";
        //console.log(this.imageSrc)
        //console.log(event.body['uuid']);
      }
      progress => {
        if (progress) {
          //console.log("upload progress:", progress);
        }
      }
    })


  }

  addSkill(can: Candidate) {
    let skill: Skill = new Skill(this.skillT.value, this.skillCtrl.value,
      this.skillDescription.value, this.skillEvaluate.value, 0);
    this.candidateService.addSkillById(can.id, skill).subscribe(
      resp => {

        this.notyf2.confirm('Compétence ajoutée');
        this.getOneCandidate(this.id);

      },
      err => {

        this.notyf2.alert('Compétence non ajoutée');
      }
    );
    //location.reload();

  }
  addNewLanguage(id: number) {
    let language: Language = new Language(this.languageForm.controls['languageName'].value,
      this.languageForm.controls['languageType'].value, null, null);
    this.candidateService.addLanguageById(this.id, language).subscribe(
      resp => {

        this.notyf2.confirm('Langue ajoutée');
        this.getOneCandidate(this.id);

      },
      err => {

        this.notyf2.alert('Langue non ajoutée , Réessayez');
      }
    );
    //location.reload();
  }
  addLanguage(can: Candidate) {
    let language: Language = new Language(this.langCtrl.value, this.langType.value, 0, 'description');
    this.candidateService.addLanguageById(can.id, language).subscribe(
      resp => {

        this.notyf2.confirm('Langue ajoutée');
        this.getOneCandidate(this.id);

      },
      err => {

        this.notyf2.alert('Langue non ajoutée , Réessayez');
      }
    );
    //location.reload();
  }
  goTest() {
    this.router.navigate(['quizz/list/' + this.id])
  }

  addNewSocialNetwork(candidate: Candidate) {
    //console.log(candidate.id)
    let socialNetwork: SocialNetwork = new SocialNetwork(this.socialNetworkForm.controls['socialNetworkType'].value, this.socialNetworkForm.controls['socialNetworkUrl'].value);
    this.candidateService.addSocialNetworkById(candidate.id, socialNetwork).subscribe(
      resp => {

        this.notyf2.confirm('Réseau social ajouté');
        this.getOneCandidate(this.id);

      },
      err => {

        this.notyf2.alert('Réseau social non ajouté , Réessayez');
      }
    );

  }
  addNewPosition(can: Candidate) {
    let skills: Skill[] = [];

    let poste: Poste = new Poste(this.positionForm.controls['positionDescription'].value, this.positionForm.controls['positionName'].value,
      this.positionForm.controls['positionSalary'].value, this.positionForm.controls['positionCurrency'].value, skills, this.positionForm.controls['positionType'].value
      , this.positionForm.controls['positionCompany'].value, this.positionForm.controls['positionDate'].value);
    this.candidateService.addCurrentPositionById(can.id, poste).subscribe(
      resp => {
        //console.log(resp)
        this.getOneCandidate(this.id);
        this.notyf2.confirm('Poste ajouté');

      },
      err => {
        //console.log(err)
        this.notyf2.alert('Poste non ajouté , Réessayez');
      }
    );

  }
  addNewDesiredPosition(candidate: Candidate) {
    let skills: Skill[] = [];
    let poste: Poste = new Poste(this.desiredPositionForm.controls['positionDescription'].value, this.desiredPositionForm.controls['positionName'].value,
      this.desiredPositionForm.controls['positionSalary'].value, this.desiredPositionForm.controls['positionCurrency'].value, skills, this.desiredPositionForm.controls['positionType'].value
      , this.desiredPositionForm.controls['positionMobility'].value, null);
    this.candidateService.addDesiredPositionById(candidate.id, poste).subscribe(
      resp => {

        this.notyf2.confirm('Poste ajouté');
        this.getOneCandidate(this.id);
      },
      err => {

        this.notyf2.alert('Poste non ajouté , Réessayez');
      }
    );
    this.getOneCandidate(this.id);

  }
  removeSocialNetwork(socialNetwork: SocialNetwork, candidate: Candidate) {
    if (socialNetwork) {
      this.candidateService.deleteSocialNetworkById(socialNetwork.id).subscribe(
        resp => {
          this.getOneCandidate(this.id);
          this.notyf2.confirm('Réseau social supprimé');
        },
        err => {

          this.notyf2.alert('Echec de suppression , Réessayez');
        }
      );

    }

  }
  removeLanguage(language: Language, candidate: Candidate) {
    if (language) {
      this.candidateService.deleteLanguageById(language.id, candidate.id).subscribe(
        resp => {
          this.getOneCandidate(this.id);
          this.notyf2.confirm('Langue supprimée');
        },
        err => {

          this.notyf2.alert('Echec de suppression , Réessayez');
        }
      );

    }

  }
  deleteCv(cv: Cv) {
    if (cv) {
      this.candidateService.deleteCvById(cv.id).subscribe(
        resp => {
          this.getOneCandidate(this.id);
          this.notyf2.confirm('CV supprimé');
        },
        err => {

          this.notyf2.alert('Echec de suppression , Réessayez');
        }
      );
    }
  }
  removeSkill(skill: Skill, candidate: Candidate) {
    if (skill) {
      this.candidateService.deleteSkillById(skill.id, candidate.id).subscribe(
        resp => {
          this.getOneCandidate(this.id);
          this.notyf2.confirm('Compétence supprimée');
        },
        err => {

          this.notyf2.alert('Echec de suppression , Réessayez');
        }
      );

    }

  }
  iconSocial(socialNetwork: SocialNetwork) {
    switch (socialNetwork.type) {
      case "Facebook": {
        return "fa fa-facebook";
      }

      case "Twitter": {
        return "fa fa-twitter";
      }
      case "Viadeo": {
        return "fa fa-viadeo";
      }
      case "Linkedin": {
        return "fa fa-linkedin";
      }
      case "Google": {
        return "fa fa-google";
      }
      case "Github": {
        return "fa fa-github";
      }
      case "Autre": {
        return "fa fa-comment";
      }
    }

  }



  evaluationSkill(skill: Skill) {
    switch (skill.evaluation) {
      case 0: {
        return "Non évalué";
      }
      case 1: {
        return "Débutant";
      }
      case 2: {
        return "Intermédiaire";
      }
      case 3: {
        return "Confirmé";
      }
      case 4: {
        return "Expert";
      }
    }
  }


  goEntretien(candidate: Candidate) {
    this.router.navigate(['interviews/list/' + candidate.uuid]);
  }
}
