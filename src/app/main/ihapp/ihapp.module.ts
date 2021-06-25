import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule ,ReactiveFormsModule} from '@angular/forms'; 
import { NzIconModule } from 'ng-zorro-antd/icon';
import { AlertFill } from '@ant-design/icons-angular/icons';
import { IconDefinition } from '@ant-design/icons-angular';
import { DemoNgZorroAntdModule } from '../../NG-ZORRO/ng-zorro-antd.module';
import { ServiceRoutingModule } from './ihapp-routing.module';
import { AppHardcoreAreaComponent } from './app-hardcore-area/app-hardcore-area.component';
import { AppDetailsComponent } from './app-details/app-details.component';
import { AppHomeActivityComponent } from './app-home-activity/app-home-activty.component';
import { AppHotSearchComponent } from './app-hot-search/app-hot-search.component';
import { AppManagementComponent } from './app-management/app-management.component';

// 封装组件module
import { sharedModule } from '../../sharedModule/shared.module';
const icons: IconDefinition[] = [AlertFill];
@NgModule({
  declarations: [
    AppHardcoreAreaComponent,
    AppDetailsComponent,
    AppHomeActivityComponent,
    AppHotSearchComponent,
    AppManagementComponent
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
export class ihappModule { }
