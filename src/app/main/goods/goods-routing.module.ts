import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { GoodsAddComponent } from './goods-add/goods-add.component';
import { GoodsAllComponent } from './goods-all/goods-all.component';
import { GoodsRecommendComponent } from './goods-recommend/goods-recommend.component';

const routes: Routes = [
  { path: '', redirectTo: 'goodsRecommend', pathMatch: 'full' },
  // 所有商品
  {
    path: 'goodsAll', component: GoodsAllComponent,
    data: { breadcrumb: '所有商品' }
  },
  // 新增商品
  {
    path: 'goodsAdd', component: GoodsAddComponent,
    data: { breadcrumb: '新增商品' }
  },
  // 推荐商品配置
  {
    path: 'goodsRecommend', component: GoodsRecommendComponent,
    data: { breadcrumb: '推荐商品配置' }
  },
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class GoodsRoutingModule { }
