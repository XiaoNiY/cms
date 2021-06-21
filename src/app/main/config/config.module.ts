import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

import { ConfigRoutingModule } from './config-routing.module';
import { AddressComponent } from './address/address.component';
import { NgZorroAntdModule } from 'src/app/NG-ZORRO/ng-zorro-antd.module';


@NgModule({
  declarations: [
    AddressComponent
  ],
  imports: [
    CommonModule,
    ConfigRoutingModule,
    NgZorroAntdModule,
  ]
})
export class ConfigModule { }
