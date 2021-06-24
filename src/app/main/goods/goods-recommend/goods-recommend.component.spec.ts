import { ComponentFixture, TestBed } from '@angular/core/testing';

import { GoodsRecommendComponent } from './goods-recommend.component';

describe('GoodsRecommendComponent', () => {
  let component: GoodsRecommendComponent;
  let fixture: ComponentFixture<GoodsRecommendComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ GoodsRecommendComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(GoodsRecommendComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
