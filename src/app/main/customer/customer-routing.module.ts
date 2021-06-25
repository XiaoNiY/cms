import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';
import { CustomerBasicsComponent } from './customer-basics/customer-basics.component';
import { CustomerBrowseComponent } from './customer-browse/customer-browse.component';
import { CustomerCollectionComponent } from './customer-collection/customer-collection.component';
import { CustomerCustomerBehaviorComponent } from './customer-customer-behavior/customer-customer-behavior.component';
import { CustomerDataComponent } from './customer-data/customer-data.component';
import { CustomerGrowthComponent } from './customer-growth/customer-growth.component';
import { CustomerIntegralComponent } from './customer-integral/customer-integral.component';
import { CustomerMembershipLevelComponent } from './customer-membership-level/customer-membership-level.component';
import { CustomerMembershipRightsSaveComponent } from './customer-membership-rights-save/customer-membership-rights-save.component';
import { CustomerMembershipRightsComponent } from './customer-membership-rights/customer-membership-rights.component';
import { CustomerMerchantComponent } from './customer-merchant/customer-merchant.component';
import { CustomerNewsSendComponent } from './customer-news-send/customer-news-send.component';
import { CustomerNewsComponent } from './customer-news/customer-news.component';
import { CustomerSearchComponent } from './customer-search/customer-search.component';
import { CustomerShopComponent } from './customer-shop/customer-shop.component';
import { CustomerStoreComponent } from './customer-store/customer-store.component';
import { CustomerTabsComponent } from './customer-tabs/customer-tabs.component';
import { CustomerUserCouponComponent } from './customer-user-coupon/customer-user-coupon.component';
import { CustomerUserTagsComponent } from './customer-user-tags/customer-user-tags.component';
import { CustomerWithdrawComponent } from './customer-withdraw/customer-withdraw.component';

const routes: Routes = [
    // 默认访问
    { path: '', redirectTo: 'merchant', pathMatch: 'full' },
    // 客户管理
    {
        path: 'merchant',
        component: CustomerMerchantComponent,
        data: { breadcrumb: '客户管理',keep: true  },
        children: [],
    },
    // 门店资料管理
    {
        path: 'store',
        component: CustomerStoreComponent,
        data: { breadcrumb: '门店资料管理' ,keep: true},
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
    // 数据看板
    {
        path: 'data',
        component: CustomerDataComponent,
        data: { breadcrumb: '数据看板' },
        children: [],
    },

    //客户详情tabs
    {
        path: 'tabs/:id/:tabIndex',
        component: CustomerTabsComponent,
        data: { id: 0, breadcrumb: '商户详情' },
        children: [
            //基础信息
            {
                path: 'basics/:id',
                component: CustomerBasicsComponent,
                data: { breadcrumb: '基础信息' },
            },
            //店铺信息
            {
                path: 'shop/:id',
                component: CustomerShopComponent,
                data: { breadcrumb: '店铺信息' },
            },
            //积分记录
            {
                path: 'integral',
                component: CustomerIntegralComponent,
                data: { breadcrumb: '基础信息' },
            },
            //成长值记录
            {
                path: 'growth',
                component: CustomerGrowthComponent,
                data: { breadcrumb: '积分记录' },
            },
            //客户行为
            {
                path: 'customerBehavior',
                component: CustomerCustomerBehaviorComponent,
                data: { breadcrumb: '客户行为' },
            },
            //用户优惠券
            {
                path: 'userCoupon',
                component: CustomerUserCouponComponent,
                data: { breadcrumb: '用户优惠券' },
            },
            //用户标签
            {
                path: 'userTags',
                component: CustomerUserTagsComponent,
                data: { breadcrumb: '用户标签' },
            },
            //提现记录
            {
                path: 'withdraw',
                component: CustomerWithdrawComponent,
                data: { breadcrumb: '提现记录' },
            },
        ],
    },
    // //基础信息
    // {
    //     path: 'basics',
    //     component: CustomerBasicsComponent,
    //     data: { breadcrumb: '基础信息' },
    // },
    // //店铺信息
    // {
    //     path: 'shop',
    //     component: CustomerShopComponent,
    //     data: { breadcrumb: '店铺信息' },
    // },
    // //积分记录
    // {
    //     path: 'integral',
    //     component: CustomerIntegralComponent,
    //     data: { breadcrumb: '基础信息' },
    // },
    // //成长值记录
    // {
    //     path: 'growth',
    //     component: CustomerGrowthComponent,
    //     data: { breadcrumb: '积分记录' },
    // },
    // //客户行为
    // {
    //     path: 'customerBehavior',
    //     component: CustomerCustomerBehaviorComponent,
    //     data: { breadcrumb: '客户行为' },
    // },
    // //用户优惠券
    // {
    //     path: 'userCoupon',
    //     component: CustomerUserCouponComponent,
    //     data: { breadcrumb: '用户优惠券' },
    // },
    // //用户标签
    // {
    //     path: 'userTags',
    //     component: CustomerUserTagsComponent,
    //     data: { breadcrumb: '用户标签' },
    // },
    // //提现记录
    // {
    //     path: 'withdraw',
    //     component: CustomerWithdrawComponent,
    //     data: { breadcrumb: '提现记录' },
    // },
    //通配符 通常指向404页面
    { path: '**', redirectTo: 'tabs' },
];

@NgModule({
    imports: [RouterModule.forChild(routes)],
    exports: [RouterModule],
})
export class CustomerRoutingModule { }
