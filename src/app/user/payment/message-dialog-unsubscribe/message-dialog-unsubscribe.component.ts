import { Component, OnInit } from '@angular/core';
import { MatDialogRef } from '@angular/material';

@Component({
  selector: 'app-message-dialog-unsubscribe',
  templateUrl: './message-dialog-unsubscribe.component.html',
  styleUrls: ['./message-dialog-unsubscribe.component.scss']
})
export class MessageDialogUnsubscribeComponent implements OnInit {

  constructor(public matDialogRef: MatDialogRef<MessageDialogUnsubscribeComponent>) { }

  ngOnInit() {
  }

  close(): void {
    this.matDialogRef.close();
  }
}
