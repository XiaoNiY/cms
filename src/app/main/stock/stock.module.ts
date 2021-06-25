import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule ,ReactiveFormsModule} from '@angular/forms'; 

import { NzIconModule } from 'ng-zorro-antd/icon';
import { AlertFill } from '@ant-design/icons-angular/icons';
import { IconDefinition } from '@ant-design/icons-angular';
import { DemoNgZorroAntdModule } from '../../NG-ZORRO/ng-zorro-antd.module';

import { StockRoutingModule } from './stock-routing.module';

import { SqeComponent } from './sqe/sqe.component';
import { WarehouseComponent } from './warehouse/warehouse.component';
import { DataComponent } from './data/data.component';
import { SqeAddComponent } from './sqe-add/sqe-add.component';
import { WarehouseGoodsComponent } from './warehouse-goods/warehouse-goods.component';
import { WarehouseGoodsAddComponent } from './warehouse-goods-add/warehouse-goods-add.component';
import { PurchaseOrderComponent } from './purchase-order/purchase-order.component';
import { PurchaseOrderAddComponent } from './purchase-order-add/purchase-order-add.component';
import { PurchasePlanComponent } from './purchase-plan/purchase-plan.component';
import { PurchasePlanApplyComponent } from './purchase-plan-apply/purchase-plan-apply.component';
import { PurchasePlanDetailsComponent } from './purchase-plan-details/purchase-plan-details.component';
import { PurchaseOrderDetailsComponent } from './purchase-order-details/purchase-order-details.component';
import { PutComponent } from './put/put.component';
import { PutSaveComponent } from './put-save/put-save.component';
import { PutDetailsComponent } from './put-details/put-details.component';

// 封装组件module
import { sharedModule } from '../../sharedModule/shared.module';
import { OutComponent } from './out/out.component';
import { OutSaveComponent } from './out-save/out-save.component';
import { OutDetailsComponent } from './out-details/out-details.component';
const icons: IconDefinition[] = [AlertFill];
@NgModule({
  declarations: [
    SqeComponent,
    WarehouseComponent,
    DataComponent,
    SqeAddComponent,
    WarehouseGoodsComponent,
    WarehouseGoodsAddComponent,
    PurchaseOrderComponent,
    PurchaseOrderAddComponent,
    PurchaseOrderDetailsComponent,
    PurchasePlanComponent,
    PurchasePlanApplyComponent,
    PurchasePlanDetailsComponent,
    PutComponent,
    PutSaveComponent,
    PutDetailsComponent,
    OutComponent,
    OutSaveComponent,
    OutDetailsComponent,
  ],
  imports: [
    sharedModule,
    StockRoutingModule,
    CommonModule,
    ReactiveFormsModule,
    FormsModule,
    DemoNgZorroAntdModule,
    NzIconModule.forRoot(icons),
  ]
})
export class StockModule { }
