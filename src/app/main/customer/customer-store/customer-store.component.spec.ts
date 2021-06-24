import { ComponentFixture, TestBed } from '@angular/core/testing';

import { CustomerStoreComponent } from './customer-store.component';

describe('CustomerStoreComponent', () => {
  let component: CustomerStoreComponent;
  let fixture: ComponentFixture<CustomerStoreComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ CustomerStoreComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(CustomerStoreComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
