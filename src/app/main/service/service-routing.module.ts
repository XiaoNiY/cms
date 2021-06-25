import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';
import { NewAdjustOrderComponent } from './new-adjust-order/new-adjust-order.component';
import { SaleDetailsComponent } from './sale-details/sale-details.component';
import { SaleComponent } from './sale/sale.component';

const routes: Routes = [
  // 默认访问
  { path: '', redirectTo: 'configDict', pathMatch: 'full' },
  // 售后单管理
  {
    path: 'sale', component: SaleComponent,
    data: { breadcrumb: '售后单管理' , keep: true }
  },
  // 售后单详情
  {
    path: 'saleDetails/:id', component: SaleDetailsComponent,
    data: { breadcrumb: '售后单详情' }
  },
  // 新建调节单
  {
    path: 'newAdjustOrder', component: NewAdjustOrderComponent,
    data: { breadcrumb: '新建调节单' }
  },
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class ServiceRoutingModule { }
