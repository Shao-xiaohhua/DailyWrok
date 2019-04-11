import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { SettingsBasicComponent } from './settings-basic.component';

describe('SetBasicComponent', () => {
  let component: SettingsBasicComponent;
  let fixture: ComponentFixture<SettingsBasicComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ SettingsBasicComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(SettingsBasicComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
