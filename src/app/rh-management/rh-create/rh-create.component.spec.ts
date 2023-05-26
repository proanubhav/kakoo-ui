import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { RhCreateComponent } from './rh-create.component';

describe('RhCreateComponent', () => {
  let component: RhCreateComponent;
  let fixture: ComponentFixture<RhCreateComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ RhCreateComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(RhCreateComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
