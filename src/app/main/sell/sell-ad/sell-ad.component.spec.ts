/* tslint:disable:no-unused-variable */
import { async, ComponentFixture, TestBed } from '@angular/core/testing';
import { By } from '@angular/platform-browser';
import { DebugElement } from '@angular/core';

import { SellAdComponent } from './sell-ad.component';

describe('SellAdComponent', () => {
  let component: SellAdComponent;
  let fixture: ComponentFixture<SellAdComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ SellAdComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(SellAdComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
