import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { ArretCreateComponent } from './arret-create.component';

describe('ArretCreateComponent', () => {
  let component: ArretCreateComponent;
  let fixture: ComponentFixture<ArretCreateComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ ArretCreateComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(ArretCreateComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
