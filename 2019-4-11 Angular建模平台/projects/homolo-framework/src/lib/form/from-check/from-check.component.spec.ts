import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { FromCheckComponent } from './from-check.component';

describe('FromCheckComponent', () => {
  let component: FromCheckComponent;
  let fixture: ComponentFixture<FromCheckComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ FromCheckComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(FromCheckComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
