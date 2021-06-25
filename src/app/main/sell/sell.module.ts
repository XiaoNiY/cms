import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule ,ReactiveFormsModule} from '@angular/forms'; 

import { NzIconModule } from 'ng-zorro-antd/icon';
import { AlertFill } from '@ant-design/icons-angular/icons';
import { IconDefinition } from '@ant-design/icons-angular';
import { DemoNgZorroAntdModule } from '../../NG-ZORRO/ng-zorro-antd.module';

import { SellRoutingModule } from './sell-routing.module';

import { SellCouponComponent } from './sell-coupon/sell-coupon.component';
import { SellDetailComponent } from './sell-detail/sell-detail.component';
import { SellSaveComponent } from './sell-save/sell-save.component';
import { SellUserCouponComponent } from './sell-user-coupon/sell-user-coupon.component';
import { SellAdComponent } from './sell-ad/sell-ad.component';
import { SellAdPositionComponent } from './sell-ad-position/sell-ad-position.component';
import { SellInviteComponent } from './sell-invite/sell-invite.component';
import { SellAdPositionSaveComponent } from './sell-ad-position-save/sell-ad-position-save.component';
import { SellAdSaveComponent } from './sell-ad-save/sell-ad-save.component';
import { SellInviteSaveComponent } from './sell-invite-save/sell-invite-save.component';

// 封装组件module
import { sharedModule } from '../../sharedModule/shared.module';
const icons: IconDefinition[] = [AlertFill];

@NgModule({
  declarations: [
    SellCouponComponent,
    SellDetailComponent,
    SellSaveComponent,
    SellUserCouponComponent,
    SellAdComponent,
    SellAdPositionComponent,
    SellInviteComponent,
    SellAdSaveComponent,
    SellAdPositionSaveComponent,
    SellInviteSaveComponent
  ],
  imports: [    
    sharedModule,
    DemoNgZorroAntdModule,
    NzIconModule.forRoot(icons),
    ReactiveFormsModule,
    FormsModule,
    CommonModule,
    SellRoutingModule
  ]
})
export class SellModule { }
