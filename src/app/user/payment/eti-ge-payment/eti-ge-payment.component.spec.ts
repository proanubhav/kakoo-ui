import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { EtiGePaymentComponent } from './eti-ge-payment.component';

describe('EtiGePaymentComponent', () => {
  let component: EtiGePaymentComponent;
  let fixture: ComponentFixture<EtiGePaymentComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ EtiGePaymentComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(EtiGePaymentComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
