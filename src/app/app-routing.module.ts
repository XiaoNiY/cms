import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';
import { HomeComponent } from './main/home/home.component';
import { LoginComponent } from './main/login/login.component';

const routes: Routes = [
  { path: '', pathMatch: 'full', redirectTo: 'login' },
  {
    path: 'login', component: LoginComponent
  },
  {
    path: 'home', component: HomeComponent,
    children: [
      // 商品
      {
        path: 'goods',
        loadChildren: () => import('./main/goods/goods.module').then(m => m.GoodsModule)
      },
      // 订单
      {
        path: 'order',
        loadChildren: () => import('./main/order/order.module').then(m => m.OrderModule)
      },
      // 客户
      {
        path: 'customer',
        loadChildren: () => import('./main/customer/customer.module').then(m => m.CustomerModule)
      },
      // 营销
      {
        path: 'system',
        loadChildren: () => import('./main/system/system.module').then(m => m.SystemModule)
      },
      // 售后
      {
        path: 'sales',
        loadChildren: () => import('./main/sales/sales.module').then(m => m.SalesModule)
      },
      // 仓储
      {
        path: 'storage',
        loadChildren: () => import('./main/storage/storage.module').then(m => m.StorageModule)
      },
      // 统计
      {
        path: 'statistics',
        loadChildren: () => import('./main/statistics/statistics.module').then(m => m.StatisticsModule)
      },
      // 系统
      {
        path: 'system',
        loadChildren: () => import('./main/system/system.module').then(m => m.SystemModule)
      },
      // 配置
      {
        path: 'config',
        loadChildren: () => import('./main/config/config.module').then(m => m.ConfigModule)
      },
    ]
  },
];

@NgModule({
  imports: [RouterModule.forRoot(routes, { useHash: true })],
  exports: [RouterModule]
})
export class AppRoutingModule { }
