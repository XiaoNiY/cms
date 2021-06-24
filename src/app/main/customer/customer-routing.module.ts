import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { CustomerBrowseComponent } from './customer-browse/customer-browse.component';
import { CustomerCollectionComponent } from './customer-collection/customer-collection.component';
import { CustomerMembershipLevelComponent } from './customer-membership-level/customer-membership-level.component';
import { CustomerMembershipRightsSaveComponent } from './customer-membership-rights-save/customer-membership-rights-save.component';
import { CustomerMembershipRightsComponent } from './customer-membership-rights/customer-membership-rights.component';
import { CustomerMerchantComponent } from './customer-merchant/customer-merchant.component';
import { CustomerNewsSendComponent } from './customer-news-send/customer-news-send.component';
import { CustomerNewsComponent } from './customer-news/customer-news.component';
import { CustomerSearchComponent } from './customer-search/customer-search.component';
import { CustomerStoreComponent } from './customer-store/customer-store.component';

const routes: Routes = [
  { path: '', redirectTo: 'merchant', pathMatch: 'full' },
  // 商户管理
  {
    path: 'merchant', component: CustomerMerchantComponent,
    data: { breadcrumb: '商户管理' }
  },
  // 门店管理
  {
    path: 'store', component: CustomerStoreComponent,
    data: { breadcrumb: '门店管理' }
  },
  // 客户消息
  {
    path: 'news',
    component: CustomerNewsComponent,
    data: { breadcrumb: '客户消息' },
    children: [],
  },
  // 发送客户消息
  {
    path: 'newsSend',
    component: CustomerNewsSendComponent,
    data: { breadcrumb: '发送客户消息' },
    children: [],
  },
  // 会员权益
  {
    path: 'membershipRights',
    component: CustomerMembershipRightsComponent,
    data: { breadcrumb: '会员权益' },
    children: [],
  },
  // 新建
  {
    path: 'membershipRightsSave',
    component: CustomerMembershipRightsSaveComponent,
    data: { breadcrumb: '新建' },
    children: [],
  },
  // 会员等级
  {
    path: 'membershipLevel',
    component: CustomerMembershipLevelComponent,
    data: { breadcrumb: '会员等级' },
    children: [],
  },
  // 客户浏览记录
  {
    path: 'browse',
    component: CustomerBrowseComponent,
    data: { breadcrumb: '客户浏览记录' },
    children: [],
  },
  // 客户收藏记录
  {
    path: 'collection',
    component: CustomerCollectionComponent,
    data: { breadcrumb: '客户收藏记录' },
    children: [],
  },
  // 客户搜索记录
  {
    path: 'search',
    component: CustomerSearchComponent,
    data: { breadcrumb: '客户搜索记录' },
    children: [],
  },
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class CustomerRoutingModule { }
