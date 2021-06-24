import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

import { GoodsRoutingModule } from './goods-routing.module';
import { NgZorroAntdModule } from 'src/app/NG-ZORRO/ng-zorro-antd.module';
import { GoodsAllComponent } from './goods-all/goods-all.component';
import { GoodsAddComponent } from './goods-add/goods-add.component';
import { GoodsRecommendComponent } from './goods-recommend/goods-recommend.component';


@NgModule({
  imports: [
    CommonModule,
    GoodsRoutingModule,
    NgZorroAntdModule,
  ],
  declarations: [
    GoodsAllComponent,
    GoodsAddComponent,
    GoodsRecommendComponent,
  ],
  exports: [
    GoodsAllComponent,
    GoodsAddComponent,
    GoodsRecommendComponent,
  ]
})
export class GoodsModule { }
