import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';
import { DataComponent } from './data/data.component';

import { SqeComponent } from './sqe/sqe.component';
import { WarehouseComponent } from './warehouse/warehouse.component';
import { SqeAddComponent } from './sqe-add/sqe-add.component';
import { WarehouseGoodsComponent } from './warehouse-goods/warehouse-goods.component';
import { WarehouseGoodsAddComponent } from './warehouse-goods-add/warehouse-goods-add.component';
import { PurchaseOrderComponent } from './purchase-order/purchase-order.component';
import { PurchasePlanComponent } from './purchase-plan/purchase-plan.component';
import { PurchasePlanApplyComponent } from './purchase-plan-apply/purchase-plan-apply.component';
import { PurchaseOrderAddComponent } from './purchase-order-add/purchase-order-add.component';
import { PurchasePlanDetailsComponent } from './purchase-plan-details/purchase-plan-details.component';
import { PurchaseOrderDetailsComponent } from './purchase-order-details/purchase-order-details.component';
import { PutComponent } from './put/put.component';
import { PutSaveComponent } from './put-save/put-save.component';
import { PutDetailsComponent } from './put-details/put-details.component';
import { OutComponent } from './out/out.component';
import { OutSaveComponent } from './out-save/out-save.component';
import { OutDetailsComponent } from './out-details/out-details.component';
const routes: Routes = [
    // 默认访问
    { path: '', redirectTo: 'role', pathMatch: 'full' },
    // 供应商管理
    {
        path: 'sqe', component: SqeComponent,
        data: { breadcrumb: '供应商管理', keep: true }
    },
    // 新增供应商
    {
        path: 'sqeAdd/:id', component: SqeAddComponent,
        data: { breadcrumb: '新增供应商' }
    },

    // 仓库管理
    {
        path: 'warehouseWm', component: WarehouseComponent,
        data: { breadcrumb: '仓库商品管理', keep: true }
    },
    // 仓库商品管理
    {
        path: 'warehouseGoods', component: WarehouseGoodsComponent,
        data: { breadcrumb: '仓库管理', keep: true }
    },
    // 仓库商品管理(新增商品)
    {
        path: 'warehouseGoodsAdd/:id', component: WarehouseGoodsAddComponent,
        data: { breadcrumb: '新增商品' }
    },
    // 采购计划管理
    {
        path: 'purchasePlan', component: PurchasePlanComponent,
        data: { breadcrumb: '采购计划管理', keep: true }
    },
    // 申请采购
    {
        path: 'purchasePlanApply/:id', component: PurchasePlanApplyComponent,
        data: { breadcrumb: '申请采购' }
    },
    // 采购计划详情页
    {
        path: 'purchasePlanDetails/:id', component: PurchasePlanDetailsComponent,
        data: { breadcrumb: '采购计划详情页' }
    },
    // 采购单管理
    {
        path: 'purchaseOrder', component: PurchaseOrderComponent,
        data: { breadcrumb: '采购单管理', keep: true }
    },
    // 新建采购单
    {
        path: 'purchaseOrderAdd/:id', component: PurchaseOrderAddComponent,
        data: { breadcrumb: '新建采购单' }
    },
    // 采购单详情页
    {
        path: 'purchaseOrderDetails/:id', component: PurchaseOrderDetailsComponent,
        data: { breadcrumb: '采购单详情页' }
    },
    // 入库单
    {
        path: 'put', component: PutComponent,
        data: { breadcrumb: '采购单详情页', keep: true }
    },
    // 添加入库单
    {
        path: 'putSave/:id', component: PutSaveComponent,
        data: { breadcrumb: '申请入库单' }
    },
    // 入库单详情
    {
        path: 'putDetails/:id', component: PutDetailsComponent,
        data: { breadcrumb: '入库单详情' }
    },
    // 出库单
    {
        path: 'out', component: OutComponent,
        data: { breadcrumb: '出库单', keep: true }
    },
    // 申请出库单
    {
        path: 'outSave/:id', component: OutSaveComponent,
        data: { breadcrumb: '申请出库单' }
    },
    // 出库单详情
    {
        path: 'outDetails/:id', component: OutDetailsComponent,
        data: { breadcrumb: '出库单详情' }
    },
    // 数据看板
    {
        path: 'data', component: DataComponent,
        data: { breadcrumb: '数据看板' }
    },
];

@NgModule({
    imports: [RouterModule.forChild(routes)],
    exports: [RouterModule]
})
export class StockRoutingModule { }
