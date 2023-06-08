import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { CandidateSidebarComponent } from './candidate-sidebar.component';

describe('CandidateSidebarComponent', () => {
  let component: CandidateSidebarComponent;
  let fixture: ComponentFixture<CandidateSidebarComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ CandidateSidebarComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(CandidateSidebarComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
