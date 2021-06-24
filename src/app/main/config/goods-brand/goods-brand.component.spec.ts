import { ComponentFixture, TestBed } from '@angular/core/testing';

import { GoodsBrandComponent } from './goods-brand.component';

describe('GoodsBrandComponent', () => {
  let component: GoodsBrandComponent;
  let fixture: ComponentFixture<GoodsBrandComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ GoodsBrandComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(GoodsBrandComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
