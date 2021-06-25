import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';

import { LoginComponent } from './main/login/login.component';
import { HomeComponent } from './main/home/home.component';

const routes: Routes = [
  // 默认访问
  { path: '', redirectTo: 'login', pathMatch: 'full' },

  // 登录页
  {
    path: 'login', component: LoginComponent,
  },
  // 主页
  {
    path: '', component: HomeComponent,
    children: [
      // 商品
      {
        path: 'goods',
        loadChildren: () => import("./main/goods/goods.module").then(m => m.GoodsModule),
      },
      // 订单
      {
        path: 'order',
        loadChildren: () => import("./main/order/order.module").then(m => m.OrderModule),
      },
      // 售后
      {
        path: 'service',
        loadChildren: () => import("./main/service/service.module").then(m => m.ServiceModule),
      },
      // 客户
      {
        path: 'customer',
        loadChildren: () => import("./main/customer/customer.module").then(m => m.CustomerModule),
      },
      // 营销
      {
        path: 'sell',
        loadChildren: () => import("./main/sell/sell.module").then(m => m.SellModule),
      },
      // 库存
      {
        path: 'stock',
        loadChildren: () => import("./main/stock/stock.module").then(m => m.StockModule),
      },
      // 配置
      {
        path: 'config',
        loadChildren: () => import("./main/config/config.module").then(m => m.ConfigModule),
      },
      // 系统
      {
        path: 'system',
        loadChildren: () => import("./main/system/system.module").then(m => m.SystemModule),
      },
      // 二手回收
      {
        path: 'recycle',
        loadChildren: () => import("./main/recycle/recycle.module").then(m => m.RecycleModule),
      },
      // 爱乐app
      {
        path: 'ihapp',
        loadChildren: () => import("./main/ihapp/ihapp.module").then(m => m.ihappModule),
      },
    ]
  },
  //通配符 通常指向404页面
  // { path: '**', redirectTo: '/goods' },
];

@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule]
})
export class AppRoutingModule { }
