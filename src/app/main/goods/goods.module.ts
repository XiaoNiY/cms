import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

import { GoodsRoutingModule } from './goods-routing.module';
import { NgZorroAntdModule } from 'src/app/NG-ZORRO/ng-zorro-antd.module';
import { GoodsAllComponent } from './goods-all/goods-all.component';


@NgModule({
  declarations: [
    GoodsAllComponent,
  ],
  imports: [
    CommonModule,
    GoodsRoutingModule,
    NgZorroAntdModule,
  ]
})
export class GoodsModule { }
