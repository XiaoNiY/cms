import { ComponentFixture, TestBed } from '@angular/core/testing';

import { OrderGcComponent } from './order-gc.component';

describe('OrderGcComponent', () => {
  let component: OrderGcComponent;
  let fixture: ComponentFixture<OrderGcComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ OrderGcComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(OrderGcComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
