import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule ,ReactiveFormsModule} from '@angular/forms'; 
import { NzIconModule } from 'ng-zorro-antd/icon';
import { AlertFill } from '@ant-design/icons-angular/icons';
import { IconDefinition } from '@ant-design/icons-angular';
import { DemoNgZorroAntdModule } from '../../NG-ZORRO/ng-zorro-antd.module';

import { saleTypeStatusPipe, saleStatusPipe ,orderTypeStatusPipe,orderStatusPipe,expressStatusPipe , saleRefundStatusPipe} from './status.pipe';


import { ServiceRoutingModule } from './service-routing.module';
import { SaleComponent } from './sale/sale.component';
import { SaleDetailsComponent } from './sale-details/sale-details.component';

// 封装组件module
import { sharedModule } from '../../sharedModule/shared.module';
import { NewAdjustOrderComponent } from './new-adjust-order/new-adjust-order.component';
const icons: IconDefinition[] = [AlertFill];
@NgModule({
  declarations: [
    SaleComponent,
    SaleDetailsComponent,
    NewAdjustOrderComponent,

    saleTypeStatusPipe,
    saleStatusPipe,
    orderTypeStatusPipe,
    orderStatusPipe,
    expressStatusPipe,
    saleRefundStatusPipe,
  ],
  imports: [
    sharedModule,
    NzIconModule.forRoot(icons),
    ReactiveFormsModule,
    FormsModule,
    DemoNgZorroAntdModule,
    CommonModule,
    ServiceRoutingModule
  ],
  providers: [
  ]
})
export class ServiceModule { }
