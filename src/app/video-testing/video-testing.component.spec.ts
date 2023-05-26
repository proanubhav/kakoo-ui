import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { VideoTestingComponent } from './video-testing.component';

describe('VideoTestingComponent', () => {
  let component: VideoTestingComponent;
  let fixture: ComponentFixture<VideoTestingComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ VideoTestingComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(VideoTestingComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
