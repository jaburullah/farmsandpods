import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { FarmOwnerComponent } from './farm-owner.component';

describe('FarmOwnerComponent', () => {
  let component: FarmOwnerComponent;
  let fixture: ComponentFixture<FarmOwnerComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ FarmOwnerComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(FarmOwnerComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
