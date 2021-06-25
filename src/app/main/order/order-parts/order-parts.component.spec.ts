import { ComponentFixture, TestBed } from '@angular/core/testing';

import { OrderPartsComponent } from './order-parts.component';

describe('OrderPartsComponent', () => {
  let component: OrderPartsComponent;
  let fixture: ComponentFixture<OrderPartsComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ OrderPartsComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(OrderPartsComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
