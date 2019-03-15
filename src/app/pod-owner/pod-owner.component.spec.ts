import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { PodOwnerComponent } from './pod-owner.component';

describe('PodOwnerComponent', () => {
  let component: PodOwnerComponent;
  let fixture: ComponentFixture<PodOwnerComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ PodOwnerComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(PodOwnerComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
