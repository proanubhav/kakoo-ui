import { Component, OnInit, Inject } from '@angular/core';
import { CandidateService } from '../../candidate/candidate.service';
import { MatDialogRef, MAT_DIALOG_DATA, MatDialog } from '@angular/material';
import { Experience } from '../../candidate/experience';
import { Language } from '../../candidate/language';
import 'notyf/dist/notyf.min.css';
import { AuthenticationService } from '../../user/services/authentication.service';
import { Candidate } from '../../candidate/candidate';
import { FormGroup, FormControl, Validators } from '@angular/forms';
import { Skill } from '../../candidate/skill';
import { SocialNetwork } from '../../candidate/social-network';
import { COUNTRIES } from './countries';
import { GIRLNAMES, Girl } from './girlsname';
import { UploadService } from '../upload.service';
import { Poste } from '../../candidate/poste';

export interface LangueCompetence {
  competenceName: string;
}

export class COUNTRY {
  name: string;
  flag: string;
  currency_code: string;
  currency_name: string;
  alpha2Code: string;
  constructor(name: string, flag: string, currency_code: string, currency_name: string, alpha2Code: string) {
    this.name = name;
    this.flag = flag;
    this.currency_code = currency_code;
    this.currency_name = currency_name;
    this.alpha2Code = alpha2Code;
  }
}
declare var require: any;
declare var $: any;

export interface NExperience {
  value: number;
  viewValue: string;
}

@Component({
  selector: 'app-details-upload',
  templateUrl: './details-upload.component.html',
  styleUrls: ['./details-upload.component.scss']
})
export class DetailsUploadComponent implements OnInit {

  countries: Array<COUNTRY> = [];
  positionCurrency: string = "EUR";
  //skill
  evaluation: number = 0;
  competenceNames: LangueCompetence[] = [
    { competenceName: "Notions élémentaires" },
    { competenceName: "Compétence professionnelle" },
    { competenceName: "Compétence complète" }
  ];
  positionName: string = "Consultant";
  regex = new Set(['\'', '\"', '.', ':', ';', ',', '+', '-', '→', '*', '/', '?', '!', '&', '$', '(', ')', '{', '}', '[', ']', '@', '#', '•']);
  skillsUnique: Array<string> = [];

  girlsnames: Girl[] = GIRLNAMES;
  id: any;

  // info personnal of candidat
  firstName: string = "kakoo";
  middleName: string = "kakoo";
  lastName: string = "kakoo";
  civility: string = "Homme";

  email: string = "Kakoo@profil.com";
  mobilePhone: string = "001000000000";
  dateOfBirth: any;
  localBirth: any;
  nationality: any;
  poste: any;
  mobility: string = "tous";
  nexperience: number = 0;

  nexperiences: NExperience[] = [
    { value: 0, viewValue: 'Sans Expérience' },
    { value: 1, viewValue: '1 année' },
    { value: 2, viewValue: '2 année' },
    { value: 3, viewValue: '3 année' },
    { value: 4, viewValue: '4 année' },
    { value: 5, viewValue: '5 année' },
    { value: 6, viewValue: '6 année' },
    { value: 7, viewValue: '7 année' },
    { value: 8, viewValue: '8 année' },
    { value: 9, viewValue: '9 année' },
    { value: 10, viewValue: '10 année' },
    { value: 11, viewValue: '11 année' },
    { value: 12, viewValue: '12 année' },
    { value: 13, viewValue: '13 année' },
    { value: 14, viewValue: '14 année' },
    { value: 15, viewValue: '15 année' },
    { value: 16, viewValue: '16 année' },
    { value: 17, viewValue: '17 année' },
    { value: 18, viewValue: '18 année' },
    { value: 19, viewValue: '19 année' },
    { value: 20, viewValue: '20 année' },
    { value: 21, viewValue: '+20 année' }
  ];

  address: string = "adresse par défaut";
  candidateForm: FormGroup;

  // experience is not nexperience
  public experiences: Array<Experience> = [];
  public languages: Array<Language> = [];
  public skills: Array<Skill> = [];
  public socialNetworks: Array<SocialNetwork> = [];
  uuidCandidate: number;
  loader: boolean = false;
  private fs = require('file-system');

  private Notyf = require('notyf');
  private notyf2 = new this.Notyf({
    delay: 4000,
    alertIcon: 'fa fa-exclamation-circle',
    confirmIcon: 'fa fa-check-circle'
  })
  lang: Language;
  errorMessage: boolean = false;
  fullName: any;
  candidateuuId: any;
  profile: string = "Default: java/JavaEE ";

  languagesadded: boolean = false;
  skillsadded: boolean = false;
  socialNetworksadded: boolean = false;
  postActuelAdded: boolean = false;
  updCandidate: boolean = false;

  positionForm: FormGroup;
  positionDescription: string = "kakoo Description";
  positionCompany: string = "kakoo company";
  positionSalary: number = 0;
  positionType: string = "Autre";
  positionDate: Date;
  countriesCodes: string = "MA";
  constructor(
    private matDialog: MatDialog,
    public dialogRef: MatDialogRef<DetailsUploadComponent>,
    @Inject(MAT_DIALOG_DATA) public data: any,
    private candidateService: CandidateService,
    private autheticationService: AuthenticationService,
    public uploadService: UploadService) { }

  ngOnInit() {
    // scoll to top
    window.scroll(0, 0);
    this.getCountries();

    this.candidateForm = new FormGroup({
      firstName: new FormControl('', Validators.required),
      lastName: new FormControl('', Validators.required),
      email: new FormControl('', [
        Validators.required,
        Validators.pattern("[^ @]*@[^ @]*")
      ]),
      address: new FormControl('', Validators.required),
      civility: new FormControl('', Validators.required),
      mobilePhone: new FormControl('', Validators.required),
      mobility: new FormControl('', Validators.required),
      profile: new FormControl('', Validators.required),
      nexperience: new FormControl('', Validators.required)
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

    this.loader = true;
    this.candidateService.findById(this.data.id).subscribe(
      resp => {
        this.uuidCandidate = resp.body['uuid'];
      }
    );

    this.candidateService.parsecv(this.data.id).subscribe(

      resp => {
        var Resume: boolean = false;
        if ('body' in resp) {
          Resume = 'Resume' in resp.body ? true : false;
          var UserArea = 'UserArea' in resp.body["Resume"] ? true : false;
        }

        var i = 0;// initialize id socialnetwork
        if (Resume) {
          var StructuredXMLResume = 'StructuredXMLResume' in resp.body["Resume"] ? true : false;
          // == get contacts ==
          if (StructuredXMLResume) {
            var ContactInfo = 'ContactInfo' in resp.body["Resume"].StructuredXMLResume ? true : false;
            // = get name = 
            if (ContactInfo) {
              var PersonName = 'PersonName' in resp.body["Resume"].StructuredXMLResume.ContactInfo ? true : false;
              if (PersonName) {
                var FormattedName = 'FormattedName' in resp.body["Resume"].StructuredXMLResume.ContactInfo.PersonName ? true : false;
                var GivenName = 'GivenName' in resp.body["Resume"].StructuredXMLResume.ContactInfo.PersonName ? true : false;
                var FamilyName = 'FamilyName' in resp.body["Resume"].StructuredXMLResume.ContactInfo.PersonName ? true : false;

              }


              // = get number phone and mail =  

              if ('ContactMethod' in resp.body["Resume"].StructuredXMLResume.ContactInfo) {

                resp.body["Resume"].StructuredXMLResume.ContactInfo.ContactMethod.forEach(element => {

                  // all espected phone result

                  if (element.Telephone !== undefined) {
                    this.mobilePhone = element.Telephone.FormattedNumber;
                  }
                  else if (element.Mobile !== undefined) {
                    this.mobilePhone = element.Mobile.FormattedNumber;
                  }

                  else if (UserArea) {
                    if ('sov:ResumeUserArea' in resp.body["Resume"].UserArea) {
                      if ('sov:ReservedData' in resp.body["Resume"].UserArea['sov:ResumeUserArea']) {
                        if ('sov:Phones' in resp.body["Resume"].UserArea['sov:ResumeUserArea']['sov:ReservedData']) {
                          if ('sov:Phone' in resp.body["Resume"].UserArea['sov:ResumeUserArea']['sov:ReservedData']['sov:Phones']) {
                            resp.body["Resume"].UserArea['sov:ResumeUserArea']['sov:ReservedData']['sov:Phones']['sov:Phone'].forEach(e => {
                              this.mobilePhone = e
                            });
                          }
                        }
                      }
                    }
                  }
                  // end phone 

                  // getting  mail propostion 1
                  if (element.InteetEmailAddress !== undefined) {
                    this.email = element.InteetEmailAddress;
                  }

                  // getting mail prop 2
                  if (element.InternetEmailAddress !== undefined) {
                    this.email = element.InternetEmailAddress;
                  }
                  // end mail

                  // getting address
                  if (element.PostalAddress != undefined) {
                    this.address = ""; // initialise la valeur adresse
                    if (element.PostalAddress.DeliveryAddress != undefined) {
                      if (element.PostalAddress.DeliveryAddress.AddressLine != undefined) {

                        element.PostalAddress.DeliveryAddress.AddressLine.forEach(element => {
                          this.address += element
                        });
                        if (element.PostalAddress.Municipality != undefined) {
                          this.address += " " + element.PostalAddress.Municipality;
                          this.mobility = element.PostalAddress.Municipality;
                          if (element.PostalAddress.CountryCode != undefined) {
                            let code = element.PostalAddress.CountryCode;
                            this.address += " " + COUNTRIES[code].name;
                            this.mobility = COUNTRIES[code].name;

                          }
                        }
                      }
                    } else if (element.PostalAddress.Municipality != undefined) {
                      this.address = element.PostalAddress.Municipality;
                      this.mobility = element.PostalAddress.Municipality;
                      if (element.PostalAddress.CountryCode) {
                        let code = element.PostalAddress.CountryCode;
                        this.address += " " + COUNTRIES[code].name;
                        this.mobility = COUNTRIES[code].name;

                      }
                    }
                  }
                  // end social network

                  if (element.InteetWebAddress != undefined) {
                    let adress
                    let socialNetwork: SocialNetwork = new SocialNetwork(element.Use, element.InteetWebAddress);
                    socialNetwork.id = i;
                    this.socialNetworks.push(socialNetwork);
                    i++;
                  }
                  // end socialnetwork

                });

              }
            }
          }
          if (UserArea) { // getting social Networks from sov:
            if ('sov:ResumeUserArea' in resp.body['Resume'].UserArea) {
              if ('sov:ReservedData' in resp.body['Resume'].UserArea['sov:ResumeUserArea']) {
                if ('sov:Urls' in resp.body['Resume'].UserArea['sov:ResumeUserArea']['sov:ReservedData']) {
                  if ('sov:Url' in resp.body['Resume'].UserArea['sov:ResumeUserArea']['sov:ReservedData']['sov:Urls']) {
                    resp.body['Resume'].UserArea['sov:ResumeUserArea']['sov:ReservedData']['sov:Urls']['sov:Url'].forEach(el => {

                      let socialNetwork: SocialNetwork = new SocialNetwork("autres", el);
                      socialNetwork.id = i;
                      this.socialNetworks.push(socialNetwork);
                      i++;
                    });
                  }
                }
              }
            }
          }
          if (Resume && StructuredXMLResume && ContactInfo && PersonName) {
            if (FormattedName) {
              this.fullName = resp.body["Resume"].StructuredXMLResume.ContactInfo.PersonName.FormattedName;
            }
            if (GivenName) {
              this.firstName = resp.body["Resume"].StructuredXMLResume.ContactInfo.PersonName.GivenName;
            }
            if (FamilyName) {
              this.lastName = resp.body["Resume"].StructuredXMLResume.ContactInfo.PersonName.FamilyName;
            }
          }

          if (StructuredXMLResume) {

            // educations to calcul the number of experience 

            if ('EducationHistory' in resp.body["Resume"].StructuredXMLResume) {
              if ('SchoolOrInstitution' in resp.body["Resume"].StructuredXMLResume.EducationHistory) {
                var BreakExceptions = {}
                var beakFound: boolean = false;
                try {
                  resp.body["Resume"].StructuredXMLResume.EducationHistory.SchoolOrInstitution.forEach(element => {


                    if ('Degree' in element) {

                      if ('DegreeDate' in element.Degree[0]) {

                        if ('Year' in element.Degree[0].DegreeDate) {
                          let date = new Date();
                          let dt = date.getFullYear();
                          this.nexperience = dt - element.Degree[0].DegreeDate.Year;

                          beakFound = true;
                        } else if ('YearMonth' in element.Degree[0].DegreeDate) {

                          let date = new Date();
                          let dt = date.getFullYear();

                          if (element.Degree[0].DegreeDate.YearMonth != undefined) {
                            this.nexperience = dt - element.Degree[0].DegreeDate.YearMonth.substring(0, 4);
                            beakFound = true;
                          }

                        }
                      }
                    }
                    if (beakFound) throw BreakExceptions;
                  });
                } catch (e) {
                  if (e !== BreakExceptions) throw e;
                }

              }
            }

            // experiences
            if ('EmploymentHistory' in resp.body["Resume"].StructuredXMLResume) {
              const EmployerOrg = 'EmployerOrg' in resp.body["Resume"].StructuredXMLResume.EmploymentHistory ? true : false;
              if (EmployerOrg) {
                var founed: boolean = false;
                var BreakException = {};
                try {
                  resp.body["Resume"].StructuredXMLResume.EmploymentHistory.EmployerOrg.forEach(element => {
                    // company 
                    if ('EmployerOrgName' in element) {
                      if (element.EmployerOrgName != undefined && element.EmployerOrgName != "" && element.EmployerOrgName != null) {
                        var EmployerOrgName = element.EmployerOrgName.substring(0, 39);
                        var EmployerOrgNamef = "";
                        Array.from(EmployerOrgName).forEach(el => {
                          //  delete carriage return
                          if (el != "\u000D" && el != "\u000A" && !this.regex.has(el.toString())) {
                            EmployerOrgNamef += el;
                            //console.log(el);
                          }
                        });

                        this.positionCompany = EmployerOrgNamef;
                      }

                    }
                    if ('PositionHistory' in element) {
                      element.PositionHistory.forEach(element => {

                        // stage or salary 
                        if ('@positionType' in element) {
                          if (element['@positionType'] == "internship") {
                            this.positionType = "Stage";
                          }
                        }

                        // title and profile
                        //console.log("b Title in element");
                        if ('Title' in element) {
                          //console.log("a Title in element");

                          if (element.Title != undefined && element.title != "" && element.title != null) {
                            var posName = element.Title.substring(0, 39);
                            var positionName = "";
                            //console.log("posName " + posName);

                            Array.from(posName).forEach(el => {
                              //  delete carriage return
                              if (el != "\u000D" && el != "\u000A" && !this.regex.has(el.toString()) && el != '\r\n' && el != '\r' && el != '\n' && el != '\t') {
                                positionName += el;
                                //console.log("positionName => " + positionName);
                              }
                            });
                            this.positionName = positionName;
                            this.profile = element.Title;
                            founed = true;
                          }

                        } else {
                          if ('JobCategory' in element) {
                            if (element.JobCategory != undefined && element.JobCategory.length > 0) {
                              if ('CategoryCode' in element.JobCategory[0]) {
                                this.profile = element['JobCategory'][0]['CategoryCode'];
                                //console.log("JobCategory' in element" + this.profile);
                              }
                              var posNameJ = "";
                              const CCode = element['JobCategory'][0]['CategoryCode'];
                              if (CCode != undefined && CCode != null && CCode != "") {
                                posNameJ = CCode.substring(0, 39);
                                //console.log("CCode " + CCode);

                              }
                            }
                            var positionNameJ = "";
                            Array.from(posNameJ).forEach(el => {
                              //  delete carriage return
                              if (el != "\u000D" && el != "\u000A" && !this.regex.has(el.toString()) && el != '\r\n' && el != '\r' && el != '\n' && el != '\t') {
                                positionNameJ += el;
                                //console.log("positionNameJ => " + positionNameJ);
                              }
                            });
                            this.positionName = positionNameJ;
                            founed = true;
                          }
                        }
                        // Description
                        var desc = "kakoo description";
                        if ('Description' in element) {
                          // if description is too long
                          if (element.Description != undefined) {
                            if (element.Description.length > 100) {
                              desc = element.Description.substring(0, 100);
                              var descrption = "";
                              Array.from(desc).forEach(el => {
                                //  delete carriage return
                                if (el != "\u000D" && el != "\u000A" && !this.regex.has(el) && el != '\r\n' && el != '\r' && el != '\n' && el != '\t') {
                                  descrption += el;
                                  //console.log("Element => " + el);
                                  //console.log("descrption => " + descrption);
                                }
                              });
                              this.positionDescription = descrption;

                            }
                          }
                          //  lowecase descrption
                          //console.log("descp => " + this.positionDescription);
                        }

                        // date 
                        if ('StartDate' in element) {
                          if ('YearMonth' in element.StartDate) {
                            if (element.StartDate.YearMonth != "notKnown") {
                              let date = element.StartDate.YearMonth + "-01T00:00:00";
                              this.positionDate = new Date(date);
                              //console.log("if date >>>" + this.positionDate);
                            } else {
                              this.positionDate = new Date();
                              //console.log("else date >>>" + this.positionDate);
                            }


                          } else if ('AnyDate' in element.StartDate) {
                            if (element.StartDate.AnyDate != "notKnown") {
                              let date = element.StartDate.AnyDate + "T00:00:00";
                              this.positionDate = new Date(date);
                              //console.log("else if date >>>" + this.positionDate);
                            }
                            else {
                              this.positionDate = new Date();
                              //console.log("else date >>>" + this.positionDate);
                            }

                          }
                          else if ('Year' in element.StartDate) {
                            if (element.StartDate.Year != "notKnown") {
                              let date = element.StartDate.Year + "-01-01T00:00:00";
                              this.positionDate = new Date(date);
                              //console.log("else if date >>>" + this.positionDate);
                            } else {
                              this.positionDate = new Date();
                              //console.log("else date >>>" + this.positionDate);
                            }

                          } else {
                            this.positionDate = new Date();
                            //console.log("else date >>>" + this.positionDate);

                          }
                        }
                      });
                    }
                    if (founed) throw BreakException;
                  });
                } catch (e) {
                  if (e !== BreakException) throw e;
                }

                // experiences next steps 
                //let exp = new Experience(element.EmployerOrgName);
                //this.experiences.push(exp);

              }
              if (this.profile == undefined || this.profile == "" || this.profile == null) {
                this.profile = "kakoo profil";
              }
              // get profil from last experience title 

            }
            /*
                        // skills  from propertie Qualifications ////////////
                        if ('Qualifications' in resp.body["Resume"].StructuredXMLResume) {
                          if ('QualificationSummary' in resp.body["Resume"].StructuredXMLResume.Qualifications) {
                            let arraySkills = resp.body["Resume"].StructuredXMLResume.Qualifications.QualificationSummary.split(',');
                            var i_s = 0;  //id of skill object
                            arraySkills.forEach(elmSkillName => {
             
                              if (elmSkillName.length <= 20) { // delete skiing length greated then 20 chars
                                // delete characteres 
                                var simpleArr = Array.from(elmSkillName);
                                if (simpleArr[0] == " ") {
                                  simpleArr[0] = "";
                                }
                                var skillName = "";
                                simpleArr.forEach(element => {
                                  if (!this.regex.has(e
                                    lement.toString())) {
                                    skillName += element;
                                  }
                                });
             
             
                                let skill: Skill = new Skill(null, skillName, "Any Description", null, null);
                                // adding an id to delete element 
                                skill.id = i_s;
                                this.skills.push(skill);
                                i_s++;
                              }
             
             
                            });
             
                          }
                        }
                        // skills  from propertie "UserArea" ////////////
             
                        else*/
            if ('UserArea' in resp.body["Resume"]) {
              if ('sov:ResumeUserArea' in resp.body["Resume"].UserArea) {
                if ('sov:ExperienceSummary' in resp.body["Resume"].UserArea['sov:ResumeUserArea']) {
                  if ('sov:SkillsTaxonomyOutput' in resp.body["Resume"].UserArea['sov:ResumeUserArea']['sov:ExperienceSummary']) {
                    if ('sov:TaxonomyRoot' in resp.body["Resume"].UserArea['sov:ResumeUserArea']['sov:ExperienceSummary']['sov:SkillsTaxonomyOutput']) {
                      resp.body["Resume"].UserArea['sov:ResumeUserArea']['sov:ExperienceSummary']['sov:SkillsTaxonomyOutput']['sov:TaxonomyRoot'].forEach(element => {
                        if ('sov:Taxonomy' in element) {
                          element['sov:Taxonomy'].forEach(element => {
                            if ('sov:Subtaxonomy' in element) {
                              element['sov:Subtaxonomy'].forEach(element => {
                                if ('sov:Skill' in element) {
                                  var i = 0;
                                  element['sov:Skill'].forEach(elmSkillName => {

                                    // delete characteres 
                                    let simpleArr = Array.from(elmSkillName['@name']);
                                    var skillName = "";
                                    simpleArr.forEach(element => {
                                      if (!this.regex.has(element.toString())) {
                                        skillName += element;
                                      }
                                    });

                                    if (skillName == "C") {
                                      skillName = "Language C"
                                    }
                                    if (skillName == "C#") {
                                      skillName = "Csharp"
                                    }
                                    let skill: Skill = new Skill(null, skillName, "Any Description", null, null);
                                    // adding an id to delete element 
                                    skill.id = i;
                                    this.skills.push(skill);
                                    i++;

                                  });
                                }

                              });
                            }
                          });
                        }
                      });
                    }
                  }

                }
              }
            }
            // filter duplicated skills

            this.skills.forEach(el => {
              this.skillsUnique.push(el.name);
            });
            let skillNames = Array.from(new Set(this.skillsUnique));
            this.skills = [];
            var skilli = 0;
            skillNames.forEach(elm => {
              let skill: Skill = new Skill(null, elm, "kakoo Description", null, null);
              skill.id = skilli;
              this.skills.push(skill);
              skilli++;
            });
            // end skills 
            // languages
            const langs = 'Languages' in resp.body["Resume"].StructuredXMLResume ? true : false;
            if (langs) {
              const lang = 'Language' in resp.body["Resume"].StructuredXMLResume.Languages ? true : false;
              if (lang) {
                var i_l = 0; // id of languages object
                resp.body["Resume"].StructuredXMLResume.Languages.Language.forEach(element => {


                  var positionCompetemce = 0;
                  if ('Read' in element) {
                    if (element.Read == "true") {
                      positionCompetemce += 1;
                    }
                  }
                  if ('Write' in element) {
                    if (element.Write == "true") {
                      positionCompetemce += 1;
                    }
                  }
                  if ('Speak' in element) {
                    if (element.Speak == "true") {
                      positionCompetemce += 1;
                    }
                  }
                  switch (positionCompetemce) {
                    case 0:
                      positionCompetemce = 0;
                      break;
                    case 1:
                      positionCompetemce = 0;
                      break;
                    case 2:
                      positionCompetemce = 1;
                      break;
                    case 3:
                      positionCompetemce = 2;
                      break;
                  }

                  if ('LanguageCode' in element) {
                    this.uploadService.getCountriesAllInfo().subscribe(resp => {

                      if ('body' in resp) {
                        // number of coutries in web service 250
                        for (let i in resp.body) {

                          if ('languages' in resp.body[i]) {// avoir typeError
                            //console.log("languessss");

                            if ('iso639_1' in resp.body[i].languages[0]) {

                              if (element.LanguageCode == resp.body[i].languages[0].iso639_1) {
                                var languageName = "";
                                if ('name' in resp.body[i].languages[0]) {
                                  languageName = resp.body[i].languages[0].name;
                                  //console.log("name " + languageName);
                                }
                                let language: Language = new Language(languageName, this.competenceNames[positionCompetemce].competenceName, 0, 'description');
                                // adding an id to delete element 
                                language.id = i_l;
                                this.languages.push(language);
                                i_l++;
                                break;
                              }
                            }
                          }
                        }
                      } else {
                        let language: Language = new Language(element.LanguageCode, this.competenceNames[positionCompetemce].competenceName, 0, 'description');
                        // adding an id to delete element 
                        language.id = i_l;
                        this.languages.push(language);
                        i_l++;
                      }

                    });


                  }

                });
              }

            }
          }
          if (UserArea) {
            if ('sov:ResumeUserArea' in resp.body["Resume"].UserArea) {
              if ('sov:PersonalInformation' in resp.body["Resume"].UserArea['sov:ResumeUserArea']) {
                if ('sov:Gender' in resp.body["Resume"].UserArea['sov:ResumeUserArea']['sov:PersonalInformation']) {
                  if ('#text' in resp.body["Resume"].UserArea['sov:ResumeUserArea']['sov:PersonalInformation']['sov:Gender']) {
                    if (resp.body["Resume"].UserArea['sov:ResumeUserArea']['sov:PersonalInformation']['sov:Gender']['#text'] == "Male") {
                      this.civility = "Homme";
                    } else if (resp.body["Resume"].UserArea['sov:ResumeUserArea']['sov:PersonalInformation']['sov:Gender']['#text'] == "Female") {
                      this.civility = "Femme";
                    }
                  }
                }
              } else {
                this.girlsnames.forEach(e => {
                  if (e.name == this.firstName) {
                    this.civility = "Femme";
                    return;
                  } else {
                    if (e.name != undefined && this.firstName != undefined) {
                      if (this.distance(e.name, this.firstName) <= 2) {
                        this.civility = "Femme";
                        return;
                      };
                    }

                  }
                })
              }
            }
          }

        } else {
          this.errorMessage = true;
        }

        this.loader = false;
      },
      error => {
        this.loader = false;
        this.errorMessage = true;
      }

    );
    this.id = this.data.id;
    // end loaing annimation
  }

  // adding experience to candidate from sovren api result
  addExperience(): void {


    this.experiences.forEach(element => {

    });

  }


  updateCadidate(): void {

    var noerror = true;
    let regex = new Set(['\'', '\"', '.', ':', ' ', ';', ',', '+', '-', '*', '/', '?', '!', '&', '$', '(', ')', '{', '}', '[', ']', '@', '#']);

    let arr = Array.from(this.mobilePhone);
    this.mobilePhone = "";
    arr.forEach(element => {
      if (regex.has(element.toString())) {
      } else {
        this.mobilePhone += element;
      }
    });


    let candidate: Candidate = new Candidate(
      this.data.id,
      this.firstName,
      this.lastName,
      this.email,
      this.address,
      this.civility,
      this.mobilePhone,
      this.mobility,
      this.profile,
      this.candidateForm.controls['nexperience'].value
    );
    this.autheticationService.updateCandidate(candidate).subscribe(

      resp => {
        this.notyf2.confirm('Informations du candidate Modifiés');
      },
      err => {
        noerror = false;
        this.notyf2.alert('Informations non Modifiés , Réessayez');
      }
    );

    if (noerror) {
      this.updCandidate = true;
    }
  }
  // add new Position
  convert(str): string {
    var mnths = {
      Jan: "01", Feb: "02", Mar: "03", Apr: "04", May: "05", Jun: "06",
      Jul: "07", Aug: "08", Sep: "09", Oct: "10", Nov: "11", Dec: "12"
    },
      date = str.toString().split(" ");

    return [date[3], mnths[date[1]], date[2]].join("-");
  }
  addNewPosition(): void {
    let skills: Skill[] = [];
    var noerror = true;
    let positionDescription = this.positionForm.controls['positionDescription'].value;
    let positionName = this.positionForm.controls['positionName'].value;
    let positionSalary = this.positionForm.controls['positionSalary'].value;
    let positionCurrency = this.positionForm.controls['positionCurrency'].value;
    let positionType = this.positionForm.controls['positionType'].value;
    let positionCompany = this.positionForm.controls['positionCompany'].value;
    // date format '2018-08-22'
    let date = this.positionForm.controls['positionDate'].value;
    //let positionDate = this.convert(date);

    let poste: Poste = new Poste(positionDescription, positionName, positionSalary, positionCurrency, skills, positionType, positionCompany, date.toISOString().substring(0, 10));

    //console.log("positionDescription" + positionDescription);
    this.candidateService.addCurrentPositionById(this.id, poste).subscribe(
      resp => {
        //console.log(resp)
        this.notyf2.confirm('Poste ajouté');

      },
      err => {
        noerror = false;
        //console.log(err)
        this.notyf2.alert('Poste non ajouté , Réessayez');
      }
    );
    if (noerror) {
      this.postActuelAdded = true;
    }
  }
  // adding languages to candidate from sovren api result
  addLanguages(): void {

    var noerror = true;
    this.languages.forEach(element => {
      this.candidateService.addLanguageById(this.id, element).subscribe(
        resp => {
          this.notyf2.confirm('Langue ajoutée');
        },
        err => {
          noerror = false;
          this.notyf2.alert('Langue non ajoutée , Réessayez');
        }
      );
    });
    if (noerror) {
      this.languagesadded = true;
    }
  }

  delete(lang: Language): void {
    this.languages.splice(lang.id, 1);
    // changing id indexes
    var i = 0;
    this.languages.forEach(element => {
      element.id = i;
      i++;
    })
  }


  // adding skills to candidate from sovren api result
  addSkills(): void {
    var noerror = true;

    this.skills.forEach(element => {
      this.candidateService.addSkillById(this.id, element).subscribe(
        resp => {
          this.notyf2.confirm('Compétence ajoutée');
        },
        err => {

          this.notyf2.alert('Compétence non ajoutée , Réessayez');
          noerror = false;
        }
      );;
    });
    if (noerror) {
      this.skillsadded = true;
    }
  }

  deleteSkill(skill: Skill): void {
    this.skills.splice(skill.id, 1);
    var i = 0;
    this.skills.forEach(element => {
      element.id = i;
      i++;
    })
  }

  // adding socialNetworks to candidate from sovren api result
  addSocial(): void {
    var noerror = true;

    this.socialNetworks.forEach(element => {


      // if links does not have http we add https://
      if (element.url.slice(0, 4).toString() != "http") {
        element.url = "https://" + element.url;
      }

      let socialNetwork: SocialNetwork = new SocialNetwork(element.type, element.url);


      this.candidateService.addSocialNetworkById(this.data.id, socialNetwork).subscribe(
        resp => {
          this.notyf2.confirm('Réseau Social ajoutée');
        },
        err => {
          noerror = false;
          this.notyf2.alert('Réseau Social non ajoutée , Réessayez');
        }
      );
      if (noerror) {
        this.socialNetworksadded = true;
      }
    });

  }

  deleteSocial(social: SocialNetwork): void {

    this.socialNetworks.splice(social.id, 1);

    // changing id indexes
    var i = 0;
    this.socialNetworks.forEach(element => {
      element.id = i;
      i++;
    })

  }

  saveAll(): void {

    if (!this.languagesadded) {
      this.addLanguages();
    }
    if (!this.skillsadded) {
      this.addSkills();
    }
    if (!this.socialNetworksadded) {
      this.addSocial();
    }
    this.updateCadidate();
    this.addNewPosition();
  }

  close(): void {
    this.dialogRef.close();
  }


  // calcul de distance entre deux mots
  mini(a, b) { return (a < b) ? a : b; }

  minimum(a, b, c) { return this.mini(a, this.mini(b, c)); }

  distance(a, b): number {
    if (a != undefined && b != undefined) {
      var n = a.length, m = b.length, matrice = [];
      for (let i = -1; i < n; i++) {
        matrice[i] = [];
        matrice[i][-1] = i + 1;
      }
      for (let j = -1; j < m; j++) {
        matrice[-1][j] = j + 1;
      }
      for (let i = 0; i < n; i++) {
        for (var j = 0; j < m; j++) {
          var cout = (a.charAt(i) == b.charAt(j)) ? 0 : 1;
          matrice[i][j] = this.minimum(1 + matrice[i][j - 1], 1 + matrice[i - 1][j], cout + matrice[i - 1][j - 1]);
        }
      }
      return matrice[n - 1][m - 1];
    }
    return 3; // mains not a girl
  }

  getCountries(): void {
    this.uploadService.getCountriesAllInfo().subscribe(

      resp => {
        if ('body' in resp) {

          for (let i in resp.body) {
            let name = resp.body[i].name;
            let flag = resp.body[i].flag;
            let currency_code = resp.body[i].currencies[0].code;
            let currency_name = resp.body[i].currencies[0].name;
            let alpha2Code = resp.body[i].alpha2Code;

            let country = new COUNTRY(name, flag, currency_code, currency_name, alpha2Code);
            //console.log("currency Code" + currency_code);
            this.countries.push(country);
          }
        }
      }
    );
  }
}
