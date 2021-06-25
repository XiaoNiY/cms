import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule ,ReactiveFormsModule} from '@angular/forms'; 

import { NzIconModule } from 'ng-zorro-antd/icon';
import { AlertFill } from '@ant-design/icons-angular/icons';
import { IconDefinition } from '@ant-design/icons-angular';

import { NgZorroAntdModule } from '../../NG-ZORRO/ng-zorro-antd.module';

import { OrderRoutingModule } from './order-routing.module';
import { OrderAccComponent } from './order-acc/order-acc.component';
import { OrderGcComponent } from './order-gc/order-gc.component';
import { OrderUsedComponent } from './order-used/order-used.component';
import { OrderAccDetailsComponent } from './order-acc-details/order-acc-details.component';

// 封装组件module
import { sharedModule } from '../../sharedModule/shared.module';

const icons: IconDefinition[] = [AlertFill];
@NgModule({
  declarations: [
    OrderAccComponent,
    OrderGcComponent,
    OrderUsedComponent,
    OrderAccDetailsComponent,
  ],
  imports: [
    sharedModule,
    FormsModule,
    ReactiveFormsModule,
    CommonModule,
    OrderRoutingModule,
    NgZorroAntdModule,
    NzIconModule.forRoot(icons),
  ]
})
export class OrderModule { }
