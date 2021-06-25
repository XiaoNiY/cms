import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule ,ReactiveFormsModule} from '@angular/forms'; 

import { NzIconModule } from 'ng-zorro-antd/icon';
import { AlertFill } from '@ant-design/icons-angular/icons';
import { IconDefinition } from '@ant-design/icons-angular';

import { DemoNgZorroAntdModule } from '../../NG-ZORRO/ng-zorro-antd.module';
import { SystemRoutingModule } from './system-routing.module';

import { RoleComponent } from './role/role.component';
import { ULogComponent } from './ulog/ulog.component';
import { InLogComponent } from './in-log/in-log.component';
import { StaffComponent } from './staff/staff.component';
import { MenuComponent } from './menu/menu.component';


const icons: IconDefinition[] = [AlertFill];
@NgModule({
  declarations: [
    RoleComponent,
    ULogComponent,
    InLogComponent,
    StaffComponent,
    MenuComponent,
  ],
  imports: [
    CommonModule,
    ReactiveFormsModule,
    FormsModule,
    SystemRoutingModule,
    DemoNgZorroAntdModule,
    NzIconModule.forRoot(icons),
  ]
})
export class SystemModule { }
