import { Component, OnInit } from '@angular/core';
import { FormGroup } from '@angular/forms';

@Component({
  selector: 'app-arret-create',
  templateUrl: './arret-create.component.html',
  styleUrls: ['./arret-create.component.scss']
})
export class ArretCreateComponent implements OnInit {

  arretForm: FormGroup;

  constructor() { }

  ngOnInit() {
  }

  onSubmit() {}

  cancel() {}

}
