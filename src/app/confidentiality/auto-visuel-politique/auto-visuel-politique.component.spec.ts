import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { AutoVisuelPolitiqueComponent } from './auto-visuel-politique.component';

describe('AutoVisuelPolitiqueComponent', () => {
  let component: AutoVisuelPolitiqueComponent;
  let fixture: ComponentFixture<AutoVisuelPolitiqueComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ AutoVisuelPolitiqueComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(AutoVisuelPolitiqueComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
