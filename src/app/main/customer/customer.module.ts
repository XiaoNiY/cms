import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

import { CustomerRoutingModule } from './customer-routing.module';
import { CustomerMerchantComponent } from './customer-merchant/customer-merchant.component';
import { NgZorroAntdModule } from 'src/app/NG-ZORRO/ng-zorro-antd.module';
import { CustomerStoreComponent } from './customer-store/customer-store.component';
import { CustomerNewsComponent } from './customer-news/customer-news.component';
import { CustomerNewsSendComponent } from './customer-news-send/customer-news-send.component';
import { CustomerMembershipRightsComponent } from './customer-membership-rights/customer-membership-rights.component';
import { CustomerMembershipRightsSaveComponent } from './customer-membership-rights-save/customer-membership-rights-save.component';
import { CustomerMembershipLevelComponent } from './customer-membership-level/customer-membership-level.component';
import { CustomerBrowseComponent } from './customer-browse/customer-browse.component';
import { CustomerCollectionComponent } from './customer-collection/customer-collection.component';
import { CustomerSearchComponent } from './customer-search/customer-search.component';


@NgModule({
  declarations: [
    CustomerMerchantComponent,
    CustomerStoreComponent,
    CustomerNewsComponent,
    CustomerNewsSendComponent,
    CustomerMembershipRightsComponent,
    CustomerMembershipRightsSaveComponent,
    CustomerMembershipLevelComponent,
    CustomerBrowseComponent,
    CustomerCollectionComponent,
    CustomerSearchComponent
  ],
  imports: [
    CommonModule,
    CustomerRoutingModule,
    NgZorroAntdModule
  ]
})
export class CustomerModule { }
