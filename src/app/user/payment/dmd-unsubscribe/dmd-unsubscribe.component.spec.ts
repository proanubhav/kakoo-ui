import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { DmdUnsubscribeComponent } from './dmd-unsubscribe.component';

describe('DmdUnsubscribeComponent', () => {
  let component: DmdUnsubscribeComponent;
  let fixture: ComponentFixture<DmdUnsubscribeComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ DmdUnsubscribeComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(DmdUnsubscribeComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
