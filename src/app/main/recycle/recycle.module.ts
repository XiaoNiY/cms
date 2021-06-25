import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

import { RecycleRoutingModule } from './recycle-routing.module';
import { RecycleBrandComponent } from './recycle-brand/recycle-brand.component';
import { RecycleModelsComponent } from './recycle-models/recycle-models.component';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { DemoNgZorroAntdModule } from 'src/app/NG-ZORRO/ng-zorro-antd.module';
import { NzIconModule } from 'ng-zorro-antd/icon';
import { RecycleFeedbackComponent } from './recycle-feedback/recycle-feedback.component';
import { DataConfigComponent } from './data-config/data-config.component';
import { RecycleOrderComponent } from './recycle-order/recycle-order.component';
import { RecycleOrderDetailsComponent } from './recycle-order-details/recycle-order-details.component';

// 封装组件module
import { sharedModule } from '../../sharedModule/shared.module';

@NgModule({
  declarations: [
      RecycleBrandComponent,
      RecycleModelsComponent,
      RecycleFeedbackComponent,
      DataConfigComponent,
      RecycleOrderComponent,
      RecycleOrderDetailsComponent,
  ],
  imports: [
    sharedModule,
    CommonModule,
    RecycleRoutingModule,
    FormsModule,
    DemoNgZorroAntdModule,
    NzIconModule,
    ReactiveFormsModule
  ]
})
export class RecycleModule { }
