import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { GoodsAllComponent } from './goods-all/goods-all.component';

const routes: Routes = [
  { path: '', redirectTo: 'goodsAll', pathMatch: 'full' },
  {
    path: 'goodsAll', component: GoodsAllComponent,
    data: { breadcrumb: '所有商品' }
  }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class GoodsRoutingModule { }
