import { Component, OnInit, Inject, Renderer2 } from '@angular/core';
import { NotificationsService } from 'angular4-notify';
import { AuthenticationService } from '../../services/authentication.service';
import { PaymentService } from '../../services/payment.service';
import { MatDialogRef } from '@angular/material';
import { FormGroup, FormControl, Validators } from '@angular/forms';
import { Router } from '@angular/router';
import { DOCUMENT } from '@angular/common';

@Component({
  selector: 'app-request-eti-ge',
  templateUrl: './request-eti-ge.component.html',
  styleUrls: ['./request-eti-ge.component.scss']
})
export class RequestEtiGeComponent implements OnInit {
  loader: boolean = false;
  mailSenderGroup: FormGroup;
  ckeditorContent: any;



  email: any;
  firstName: any;
  lastName: any;
  constructor(
    public dialogRef: MatDialogRef<RequestEtiGeComponent>,
    private notificationsService: NotificationsService,
    private authenticationService: AuthenticationService,
    private paymentService: PaymentService,
    public router: Router, private renderer2: Renderer2,
    @Inject(DOCUMENT) private _document
  ) { }

  ngOnInit() {
    const s = this.renderer2.createElement('script');
    s.src = '//cdn.ckeditor.com/4.7.1/full/ckeditor.js';
    this.renderer2.appendChild(this._document.body, s);
    
    this.mailSenderGroup = new FormGroup({
      ckeditorContent: new FormControl('', Validators.required)

    });
  }

  checkMessage(): boolean {
    if (this.ckeditorContent !== null || this.ckeditorContent !== "" || this.ckeditorContent !== undefined) {
      return false;
    }
    else {
      return true;
    }
  }

  cancel(): void {
    this.dialogRef.close();
  }
  sendRequest(): void {

    //console.log(this.ckeditorContent);
    this.loader = true;
    //console.log("mail sent " + this.ckeditorContent);
    this.authenticationService.getConnectedUser().subscribe(
      res => {
        this.email = res.body['email'];
        this.paymentService.sendMailRequest(this.email, this.ckeditorContent).subscribe(
          resp => {
            if (resp) {
              this.loader = false;
              this.notificationsService.addInfo("Votre demande a été envoyé avec succés ");

            } else {
              this.loader = false;
              this.notificationsService.addWarning("Votre demande n'a pas été envoyé, réessayez SVP ");

            }
          }
        );
      }
    );

  }

}
