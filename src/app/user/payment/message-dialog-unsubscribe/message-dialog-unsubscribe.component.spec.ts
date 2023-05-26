import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { MessageDialogUnsubscribeComponent } from './message-dialog-unsubscribe.component';

describe('MessageDialogUnsubscribeComponent', () => {
  let component: MessageDialogUnsubscribeComponent;
  let fixture: ComponentFixture<MessageDialogUnsubscribeComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ MessageDialogUnsubscribeComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(MessageDialogUnsubscribeComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
