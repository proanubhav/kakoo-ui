import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { EmployeeConfirmComponent } from './employee-confirm.component';

describe('EmployeeConfirmComponent', () => {
  let component: EmployeeConfirmComponent;
  let fixture: ComponentFixture<EmployeeConfirmComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ EmployeeConfirmComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(EmployeeConfirmComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
