/* tslint:disable:no-unused-variable */
import { async, ComponentFixture, TestBed } from '@angular/core/testing';
import { By } from '@angular/platform-browser';
import { DebugElement } from '@angular/core';

import { CustomerMembershipRightsSaveComponent } from './customer-membership-rights-save.component';

describe('CustomerMembershipRightsSaveComponent', () => {
  let component: CustomerMembershipRightsSaveComponent;
  let fixture: ComponentFixture<CustomerMembershipRightsSaveComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ CustomerMembershipRightsSaveComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(CustomerMembershipRightsSaveComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
