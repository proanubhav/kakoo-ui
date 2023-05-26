import { Component, AfterViewInit } from '@angular/core';
import { AuthenticationService } from './user/services/authentication.service';

export class TrackedUser {
  id: number;
  ipAddress: string;
  continentName: string;
  countryName: string;
  city: string;
  constructor(ipAddress: string, continentName: string, countryName: string, city: string) {
    this.ipAddress = ipAddress;
    this.continentName = continentName;
    this.countryName = countryName;
    this.city = city;
  }
}


@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.scss'],

})
export class AppComponent implements AfterViewInit {
  title = 'app';

  constructor(
    private authenticationService: AuthenticationService
  ) { }

  ngOnInit() {
    
  }

  saveUserIpAdresse(): void {
    this.authenticationService.getTrackedUser().subscribe(
      resp => {
        const response = 'ipAddress' in resp.body ? true : false; // to avoid typeError property ipAddress undefined
        if (response) {
          if (resp.body['ipAddress'] !== null && resp.body['ipAddress'] !== "" && resp.body['ipAddress'] !== undefined) { // check validiti of ipAddress

            var ipAddress = resp.body['ipAddress'];
            var continentName = resp.body['continentName'];
            var countryName = resp.body['countryName'];
            var city = resp.body['city'];
            //console.log("I m here ");
            let trackUser = new TrackedUser(ipAddress, continentName, countryName, city);
            this.authenticationService.saveTrackedUser(trackUser).subscribe(
              response => {
                //console.log(response);
              }
            );
          }
        }
      }
    );
  }

  ngAfterViewInit() {
    //this.saveUserIpAdresse(); 
  }
}
