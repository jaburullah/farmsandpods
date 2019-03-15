import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { FarmLoginComponent } from './farm-login.component';

describe('FarmLoginComponent', () => {
  let component: FarmLoginComponent;
  let fixture: ComponentFixture<FarmLoginComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ FarmLoginComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(FarmLoginComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
