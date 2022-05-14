import { ComponentFixture, TestBed } from '@angular/core/testing';

import { Clipz404Component } from './404.component';

describe('404Component', () => {
  let component: Clipz404Component;
  let fixture: ComponentFixture<Clipz404Component>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ Clipz404Component ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(Clipz404Component);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
