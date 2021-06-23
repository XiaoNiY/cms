import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

import { ConfigRoutingModule } from './config-routing.module';
import { AddressComponent } from './address/address.component';
import { NgZorroAntdModule } from 'src/app/NG-ZORRO/ng-zorro-antd.module';
import { DictionariesComponent } from './dictionaries/dictionaries.component';
import { DictionariesListComponent } from './dictionaries-list/dictionaries-list.component';


@NgModule({
  imports: [
    CommonModule,
    ConfigRoutingModule,
    NgZorroAntdModule,
  ],
  declarations: [
    AddressComponent,
    DictionariesComponent,
    DictionariesListComponent,
  ],
  exports: [
    AddressComponent,
    DictionariesComponent,
    DictionariesListComponent
  ]
})
export class ConfigModule { }
