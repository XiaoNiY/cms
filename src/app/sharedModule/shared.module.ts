
import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms'; // <--- JavaScript import from Angular

import { NzIconModule } from 'ng-zorro-antd/icon';
import { AlertFill } from '@ant-design/icons-angular/icons';
import { IconDefinition } from '@ant-design/icons-angular';
import { DemoNgZorroAntdModule } from '../NG-ZORRO/ng-zorro-antd.module';

import { BtGroupComponent } from './bt-group/bt-group.component';
const icons: IconDefinition[] = [AlertFill];
@NgModule({
    declarations: [
        BtGroupComponent
    ],
    imports: [
        NzIconModule.forRoot(icons),
        DemoNgZorroAntdModule,
        FormsModule,
        CommonModule,
    ],
    exports: [
        BtGroupComponent
    ],
    providers: [
    ]
})
export class sharedModule { }