import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { QuizzReportComponent } from './quizz-report.component';

describe('QuizzReportComponent', () => {
  let component: QuizzReportComponent;
  let fixture: ComponentFixture<QuizzReportComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ QuizzReportComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(QuizzReportComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
