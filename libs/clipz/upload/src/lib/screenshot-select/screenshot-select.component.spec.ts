import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ScreenshotSelectComponent } from './screenshot-select.component';

describe('ScreenshotSelectComponent', () => {
  let component: ScreenshotSelectComponent;
  let fixture: ComponentFixture<ScreenshotSelectComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ ScreenshotSelectComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(ScreenshotSelectComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
