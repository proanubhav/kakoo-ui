import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { AddRhComponent } from './add-rh.component';

describe('AddRhComponent', () => {
  let component: AddRhComponent;
  let fixture: ComponentFixture<AddRhComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ AddRhComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(AddRhComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
