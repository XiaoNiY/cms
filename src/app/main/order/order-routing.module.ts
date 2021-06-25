import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';

import { OrderAccComponent } from './order-acc/order-acc.component';
import { OrderGcComponent } from './order-gc/order-gc.component';
import { OrderUsedComponent } from './order-used/order-used.component';
import { OrderAccDetailsComponent } from './order-acc-details/order-acc-details.component';

const routes: Routes = [
  // 默认访问
  { path: '', redirectTo: 'orderAcc', pathMatch: 'full' },
  // 配件订单
  { path: 'orderAcc', component: OrderAccComponent, data: { keep: true }, },
  // 配件订单详情
  { path: 'accDetails/:id', component: OrderAccDetailsComponent },
  // 配件回收
  { path: 'orderGc', component: OrderGcComponent },
  // 二手订单
  { path: 'orderUsed', component: OrderUsedComponent },
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class OrderRoutingModule { }
