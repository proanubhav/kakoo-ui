import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { CandidateEmailComponent } from './candidate-email.component';

describe('CandidateEmailComponent', () => {
  let component: CandidateEmailComponent;
  let fixture: ComponentFixture<CandidateEmailComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ CandidateEmailComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(CandidateEmailComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
