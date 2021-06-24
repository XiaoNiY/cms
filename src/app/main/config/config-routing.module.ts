import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { AddressComponent } from './address/address.component';
import { DictionariesListComponent } from './dictionaries-list/dictionaries-list.component';
import { DictionariesComponent } from './dictionaries/dictionaries.component';
import { GoodsBrandComponent } from './goods-brand/goods-brand.component';

const routes: Routes = [
  { path: '', redirectTo: 'address', pathMatch: 'full' },
  // 字典管理
  {
    path: 'dictionaries', component: DictionariesComponent,
    data: { breadcrumb: '字典管理' }
  },
  // 字典管理列表
  {
    path: 'dictionariesList', component: DictionariesListComponent,
    data: { breadcrumb: '字典管理列表' }
  },
  // 地址管理
  {
    path: 'address', component: AddressComponent,
    data: { breadcrumb: '地址管理' }
  },
  // 商品品牌配置
  {
    path: 'goodsBrand', component: GoodsBrandComponent,
    data: { breadcrumb: '商品品牌配置' }
  },
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule],
})
export class ConfigRoutingModule {}
