import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { CandidateVideoComponent } from './candidate-video.component';

describe('CandidateVideoComponent', () => {
  let component: CandidateVideoComponent;
  let fixture: ComponentFixture<CandidateVideoComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ CandidateVideoComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(CandidateVideoComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
