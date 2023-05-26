import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { RequestEtiGeComponent } from './request-eti-ge.component';

describe('RequestEtiGeComponent', () => {
  let component: RequestEtiGeComponent;
  let fixture: ComponentFixture<RequestEtiGeComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ RequestEtiGeComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(RequestEtiGeComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
