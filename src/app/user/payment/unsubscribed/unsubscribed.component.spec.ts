import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { UnsubscribedComponent } from './unsubscribed.component';

describe('UnsubscribedComponent', () => {
  let component: UnsubscribedComponent;
  let fixture: ComponentFixture<UnsubscribedComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ UnsubscribedComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(UnsubscribedComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
