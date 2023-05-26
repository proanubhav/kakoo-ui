import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { EmployeeTasksManagementComponent } from './employee-tasks-management.component';

describe('EmployeeTasksManagementComponent', () => {
  let component: EmployeeTasksManagementComponent;
  let fixture: ComponentFixture<EmployeeTasksManagementComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ EmployeeTasksManagementComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(EmployeeTasksManagementComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
