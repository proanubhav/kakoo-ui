import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { RhdeletedComponent } from './rhdeleted.component';

describe('RhdeletedComponent', () => {
  let component: RhdeletedComponent;
  let fixture: ComponentFixture<RhdeletedComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ RhdeletedComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(RhdeletedComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
