import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';

import { ConfigDictComponent } from './config-dict/config-dict.component';
import { ConfigAddressComponent } from './config-address/config-address.component';
import { ConfigDictListComponent } from './config-dict-list/config-dict-list.component';
import { ConfigBrandComponent } from './config-brand/config-brand.component';


const routes: Routes = [
  // 默认访问
  { path: '', redirectTo: 'configDict', pathMatch: 'full' },

  // 字典管理
  {
    path: 'configDict', component: ConfigDictComponent,
    data: { breadcrumb: '字典管理' },
    children: [
    ]
  },
  // 字典管理列表
  {
    path: 'DictList',
    component: ConfigDictListComponent,
    data: { breadcrumb: '字典管理列表' },
  },
  // 地址管理
  {
    path: 'configAddress', component: ConfigAddressComponent,
    data: { breadcrumb: '地址管理' },
  },
  // 品牌管理
  {
    path: 'ConfigBrand', component: ConfigBrandComponent,
    data: { breadcrumb: '品牌管理' },
  },
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class ConfigRoutingModule { }
