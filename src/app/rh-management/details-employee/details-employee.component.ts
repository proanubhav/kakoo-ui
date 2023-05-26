import {Component, OnInit} from '@angular/core';
import {environment} from "../../../assets/environments/environment";
import {Employee} from "../employee";
import {RhManagementService} from "../rh-management.service";
import {HttpEventType, HttpResponse} from "@angular/common/http";
import {ActivatedRoute, Router} from "@angular/router";

declare var require: any;

@Component({
  selector: 'app-details-employee',
  templateUrl: './details-employee.component.html',
  styleUrls: ['./details-employee.component.scss']
})
export class DetailsEmployeeComponent implements OnInit {

  private apiUrl = environment.apiUrl;
  private sub: any;
  id: number;
  private projectsEdit: boolean;
  private tasksEdit: boolean;

  public employee: Employee;
  public imgSrc: string;
  public firstName: string;
  public lastName: string;
  public email: string;
  public address: string;
  public profile: string;
  public mobilePhone: string;
  public exist: boolean;
  public deleteEmployeeConfirm: boolean;

  private jwtToken = null;

  private Notyf = require('notyf');
  private notyf2 = new this.Notyf(
    {
      delay: 4000,
      alertIcon: 'fa fa-exclamation-circle',
      confirmIcon: 'fa fa-check-circle'
    }
  );

  selectedFiles: FileList;
  currentFileUpload: File;
  progress: { percentage: number } = { percentage: 0 };

  deleteImg: String;

  constructor(private rhManagementService: RhManagementService,
              public route: ActivatedRoute,
              private router: Router) { }

  ngOnInit() {

    this.imgSrc = "assets/home/images/loading.gif";
    this.deleteImg = "assets/home/images/delete.png";

    this.loadToken();
    if(!this.jwtToken) {
      this.router.navigate(['']);
    }

    this.sub = this.route.params.subscribe(
      params => {
        this.id = params['id'];
        if(this.id)
          this.getEmployee(this.id);
      });
  }

  selectFile(event) {
    this.selectedFiles = event.target.files;
    if(this.selectedFiles.item(0))
      this.upload();
  }

  upload() {
    this.progress.percentage = 0;
    this.currentFileUpload = this.selectedFiles.item(0 );
    this.rhManagementService.pushFileToStorage(this.currentFileUpload, this.employee.id).subscribe(
      event => {
        if(event.type === HttpEventType.UploadProgress) {
          this.progress.percentage = Math.round(100 * event.loaded / event.total);
          this.imgSrc = this.apiUrl + "employees/" + this.employee.id + "/downloadPhoto";
        }else if(event instanceof HttpResponse) {
          this.imgSrc = this.apiUrl + "employees/" + this.employee.id + "/downloadPhoto";
          this.selectedFiles = undefined;
        }
      }, progress => {
        console.log(progress);
      });
  }

  redirectEditPage(employee: Employee) {

  }

  getEmployee(idEmployee: number) {
    if(idEmployee) {
      this.exist = true;
      this.rhManagementService.findEmployeeById(idEmployee).subscribe(
        resp => {
          //console.log(resp);
          if(resp.body) {
            this.employee = new Employee(
              resp.body['id'],
              resp.body['matricule'],
              resp.body['firstName'],
              resp.body['lastName'],
              resp.body['familySituation'],
              resp.body['childrenNbr'],
              resp.body['phone'],
              resp.body['email'],
              resp.body['address'],
              resp.body['gender'],
              resp.body['experienceNbr'],
              resp.body['username'],
              resp.body['salary'],
              resp.body['profile'],
              resp.body['serviceName']
            );
            this.firstName = resp.body['firstName'];
            this.lastName = resp.body['lastName'];
            this.profile = resp.body['profile'];
            this.email = resp.body['email'];
            this.address = resp.body['address'];
            this.mobilePhone = resp.body['phone'];

            if(resp.body['photo'])
              this.imgSrc = this.apiUrl + "employees/" + idEmployee + "/downloadPhoto";
            else
              this.imgSrc = (resp.body['gender'] == "Homme") ? "assets/home/images/male-candidate.png" : "assets/home/images/female-candidate.png";
          }else {
            this.exist = false;
            this.router.navigate(['/employee/notFound']);
          }
        }
      );
    }
  }

  deleteEmployee(employee: Employee) {
    if(employee) {
      this.rhManagementService.deleteEmployeeById(employee.id).subscribe(
        resp => {
          //console.log(resp);
          this.exist = false;
          this.notyf2.confirm('Employé supprimer avec succès');
          this.router.navigate(['rh/list']);
        }
      );
    }
  }

  loadToken() {
    this.jwtToken = localStorage.getItem('token');
  }

}
