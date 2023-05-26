import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { CandidateinterviewListComponent } from './candidateinterview-list.component';

describe('CandidateinterviewListComponent', () => {
  let component: CandidateinterviewListComponent;
  let fixture: ComponentFixture<CandidateinterviewListComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ CandidateinterviewListComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(CandidateinterviewListComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
