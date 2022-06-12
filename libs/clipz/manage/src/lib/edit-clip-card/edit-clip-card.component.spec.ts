import { ComponentFixture, TestBed } from '@angular/core/testing';

import { EditClipCardComponent } from './edit-clip-card.component';

describe('ClipCardComponent', () => {
  let component: EditClipCardComponent;
  let fixture: ComponentFixture<EditClipCardComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ EditClipCardComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(EditClipCardComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
