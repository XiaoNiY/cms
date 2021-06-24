import { ComponentFixture, TestBed } from '@angular/core/testing';

import { CustomerMerchantComponent } from './customer-merchant.component';

describe('CustomerMerchantComponent', () => {
  let component: CustomerMerchantComponent;
  let fixture: ComponentFixture<CustomerMerchantComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ CustomerMerchantComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(CustomerMerchantComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
