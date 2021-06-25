import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';
import { DataConfigComponent } from './data-config/data-config.component';
import { RecycleBrandComponent } from './recycle-brand/recycle-brand.component';
import { RecycleFeedbackComponent } from './recycle-feedback/recycle-feedback.component';
import { RecycleModelsComponent } from './recycle-models/recycle-models.component';
import { RecycleOrderDetailsComponent } from './recycle-order-details/recycle-order-details.component';
import { RecycleOrderComponent } from './recycle-order/recycle-order.component';

const routes: Routes = [
    // 默认访问
    { path: '', redirectTo: 'brand', pathMatch: 'full' },
    // 品牌管理
    {
        path: 'brand', component: RecycleBrandComponent,
        data: { breadcrumb: '品牌管理' }
    },
    // 机型管理
    {
        path: 'models', component: RecycleModelsComponent,
        data: { breadcrumb: '机型管理' }
    },
    // 数据配置
    {
        path: 'dataConfig', component: DataConfigComponent,
        data: { breadcrumb: '意见反馈' }
    },
    // 意见反馈
    {
        path: 'feedback', component: RecycleFeedbackComponent,
        data: { breadcrumb: '数据配置' }
    },
    // 回收订单
    {
        path: 'recOrder', component: RecycleOrderComponent,
        data: { breadcrumb: '回收订单', keep: true  }
    },
    // 回收订单详情
    {
        path: 'orderDetails/:okey', component: RecycleOrderDetailsComponent,
        data: { breadcrumb: '回收订单详情' }
    },
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class RecycleRoutingModule { }
