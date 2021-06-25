import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { NzIconModule } from 'ng-zorro-antd/icon';
import { AlertFill } from '@ant-design/icons-angular/icons';
import { IconDefinition } from '@ant-design/icons-angular';
import { DemoNgZorroAntdModule } from '../../NG-ZORRO/ng-zorro-antd.module';

import { ConfigDictService } from './config-dict/config-dict.service';
import { ConfigDictListService } from './config-dict-list/config-dict-list.service';
import { ConfigBrandService } from './config-brand/config-brand.service';

import { ConfigRoutingModule } from './config-routing.module';
import { ConfigDictComponent } from './config-dict/config-dict.component';
import { ConfigAddressComponent } from './config-address/config-address.component';
import { ConfigDictListComponent } from './config-dict-list/config-dict-list.component';
import { ConfigBrandComponent } from './config-brand/config-brand.component';

// 封装组件module
import { sharedModule } from '../../sharedModule/shared.module';
const icons: IconDefinition[] = [AlertFill];
@NgModule({
  declarations: [
    ConfigDictComponent,
    ConfigAddressComponent,
    ConfigDictListComponent,
    ConfigBrandComponent
  ],
  imports: [
    sharedModule,
    NzIconModule.forRoot(icons),
    ReactiveFormsModule,
    FormsModule,
    DemoNgZorroAntdModule,
    CommonModule,
    ConfigRoutingModule
  ],
  providers: [
    ConfigDictService,
    ConfigDictListService,
    ConfigBrandService,
  ]
})
export class ConfigModule { }
