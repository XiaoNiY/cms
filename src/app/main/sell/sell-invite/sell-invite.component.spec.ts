/* tslint:disable:no-unused-variable */
import { async, ComponentFixture, TestBed } from '@angular/core/testing';
import { By } from '@angular/platform-browser';
import { DebugElement } from '@angular/core';

import { SellInviteComponent } from './sell-invite.component';

describe('SellInviteComponent', () => {
  let component: SellInviteComponent;
  let fixture: ComponentFixture<SellInviteComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ SellInviteComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(SellInviteComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
