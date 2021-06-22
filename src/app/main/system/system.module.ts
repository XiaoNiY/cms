import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

import { SystemRoutingModule } from './system-routing.module';
import { MenuComponent } from './menu/menu.component';
import { NgZorroAntdModule } from 'src/app/NG-ZORRO/ng-zorro-antd.module';


@NgModule({
  imports: [
    CommonModule,
    SystemRoutingModule,
    NgZorroAntdModule
  ],
  declarations: [
    MenuComponent
  ],
  exports: [MenuComponent]
})
export class SystemModule { }
