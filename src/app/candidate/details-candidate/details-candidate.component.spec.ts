import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { DetailsCandidateComponent } from './details-candidate.component';

describe('DetailsCandidateComponent', () => {
  let component: DetailsCandidateComponent;
  let fixture: ComponentFixture<DetailsCandidateComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ DetailsCandidateComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(DetailsCandidateComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
