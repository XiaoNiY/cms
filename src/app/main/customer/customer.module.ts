import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';

import { NzIconModule } from 'ng-zorro-antd/icon';
import { AlertFill } from '@ant-design/icons-angular/icons';
import { IconDefinition } from '@ant-design/icons-angular';
import { DemoNgZorroAntdModule } from '../../NG-ZORRO/ng-zorro-antd.module';
import { CustomerMerchantComponent } from './customer-merchant/customer-merchant.component';
import { CustomerRoutingModule } from './customer-routing.module';
import { CustomerBrowseComponent } from './customer-browse/customer-browse.component';
import { CustomerCollectionComponent } from './customer-collection/customer-collection.component';
import { CustomerSearchComponent } from './customer-search/customer-search.component';
import { CustomerNewsComponent } from './customer-news/customer-news.component';
import { CustomerMembershipRightsComponent } from './customer-membership-rights/customer-membership-rights.component';
import { CustomerMembershipLevelComponent } from './customer-membership-level/customer-membership-level.component';
import { CustomerDataComponent } from './customer-data/customer-data.component';
import { CustomerNewsSendComponent } from './customer-news-send/customer-news-send.component';
import { CustomerMembershipRightsSaveComponent } from './customer-membership-rights-save/customer-membership-rights-save.component';
import { CustomerBasicsComponent } from './customer-basics/customer-basics.component';
import { CustomerShopComponent } from './customer-shop/customer-shop.component';
import { CustomerIntegralComponent } from './customer-integral/customer-integral.component';
import { CustomerGrowthComponent } from './customer-growth/customer-growth.component';
import { CustomerCustomerBehaviorComponent } from './customer-customer-behavior/customer-customer-behavior.component';
import { CustomerUserCouponComponent } from './customer-user-coupon/customer-user-coupon.component';
import { CustomerUserTagsComponent } from './customer-user-tags/customer-user-tags.component';
import { CustomerWithdrawComponent } from './customer-withdraw/customer-withdraw.component';
import { CustomerTabsComponent } from './customer-tabs/customer-tabs.component';
import { CustomerStoreComponent } from './customer-store/customer-store.component';

// 封装组件module
import { sharedModule } from '../../sharedModule/shared.module';

const icons: IconDefinition[] = [AlertFill];

@NgModule({
    declarations: [
        CustomerMerchantComponent,
        CustomerBrowseComponent,
        CustomerCollectionComponent,
        CustomerSearchComponent,
        CustomerNewsComponent,
        CustomerMembershipRightsComponent,
        CustomerMembershipLevelComponent,
        CustomerDataComponent,
        CustomerNewsSendComponent,
        CustomerMembershipRightsSaveComponent,
        CustomerBasicsComponent,
        CustomerShopComponent,
        CustomerIntegralComponent,
        CustomerGrowthComponent,
        CustomerCustomerBehaviorComponent,
        CustomerUserCouponComponent,
        CustomerUserTagsComponent,
        CustomerWithdrawComponent,
        CustomerTabsComponent,
        CustomerStoreComponent,
    ],
    imports: [
        sharedModule,
        DemoNgZorroAntdModule,
        NzIconModule.forRoot(icons),
        ReactiveFormsModule,
        FormsModule,
        CommonModule,
        CustomerRoutingModule,
    ]
})
export class CustomerModule { }
