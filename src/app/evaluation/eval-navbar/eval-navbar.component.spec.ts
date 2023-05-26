import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { EvalNavbarComponent } from './eval-navbar.component';

describe('EvalNavbarComponent', () => {
  let component: EvalNavbarComponent;
  let fixture: ComponentFixture<EvalNavbarComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ EvalNavbarComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(EvalNavbarComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
