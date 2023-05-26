import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { RhListComponent } from './rh-list.component';

describe('RhListComponent', () => {
  let component: RhListComponent;
  let fixture: ComponentFixture<RhListComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ RhListComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(RhListComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
