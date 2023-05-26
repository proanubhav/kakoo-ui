import { Component, OnInit } from '@angular/core';
import { MatDialogRef } from '@angular/material';

@Component({
  selector: 'app-auto-visuel-politique',
  templateUrl: './auto-visuel-politique.component.html',
  styleUrls: ['./auto-visuel-politique.component.scss']
})
export class AutoVisuelPolitiqueComponent implements OnInit {

  constructor(
    public dialogRef: MatDialogRef<AutoVisuelPolitiqueComponent>,
  ) { }

  ngOnInit() {
  }
  close(): void {
    this.dialogRef.close();
  }
}
