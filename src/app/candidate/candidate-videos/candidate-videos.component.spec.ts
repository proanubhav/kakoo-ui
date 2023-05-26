import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { CandidateVideosComponent } from './candidate-videos.component';

describe('CandidateVideosComponent', () => {
  let component: CandidateVideosComponent;
  let fixture: ComponentFixture<CandidateVideosComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ CandidateVideosComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(CandidateVideosComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
