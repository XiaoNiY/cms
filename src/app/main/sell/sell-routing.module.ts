import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';
import { SellAdPositionSaveComponent } from './sell-ad-position-save/sell-ad-position-save.component';
import { SellAdPositionComponent } from './sell-ad-position/sell-ad-position.component';
import { SellAdSaveComponent } from './sell-ad-save/sell-ad-save.component';
import { SellAdComponent } from './sell-ad/sell-ad.component';

import { SellCouponComponent } from './sell-coupon/sell-coupon.component';
import { SellDetailComponent } from './sell-detail/sell-detail.component';
import { SellInviteSaveComponent } from './sell-invite-save/sell-invite-save.component';
import { SellInviteComponent } from './sell-invite/sell-invite.component';
import { SellSaveComponent } from './sell-save/sell-save.component';
import { SellUserCouponComponent } from './sell-user-coupon/sell-user-coupon.component';

const routes: Routes = [
  // 默认访问
  { path: '', redirectTo: 'coupon', pathMatch: 'full' },
  // 优惠券列表
  {
    path: 'coupon',
    component: SellCouponComponent, 
    data: { breadcrumb: '优惠券', keep: true },
    children: [],
  },
  // 新增&&编辑 优惠券
  {
    path: 'save/:id',
    component: SellSaveComponent,
    data: { breadcrumb: '新增&&编辑优惠券' },
  },
  // 查看优惠券详情
  {
    path: 'detail/:id',
    component: SellDetailComponent,
    data: { breadcrumb: '查看优惠券' },
  },
  // 用户优惠券
  {
    path: 'userCoupon',
    component: SellUserCouponComponent,
    data: { breadcrumb: '用户优惠券' },
  },
  //新增广告项
  {
      path: 'adSave',
      component: SellAdSaveComponent,
      data: { breadcrumb: '新增广告项' }
  },
  // 广告管理
  {
      path: 'ad',
      component: SellAdComponent,
      data: { breadcrumb: '广告管理' }
  },
  // 广告位管理
  {
      path: 'adPosition',
      component: SellAdPositionComponent,
      data: { breadcrumb: '广告位管理' }
  },
  // 新增广告位
  {
      path: 'adPositionSave',
      component: SellAdPositionSaveComponent,
      data: { breadcrumb: '新增广告位' }
  },
  // 邀请有礼
  {
      path: 'invite',
      component: SellInviteComponent,
      data: { breadcrumb: '邀请有礼' }
  },
  // 邀请有礼活动配置
  {
      path: 'inviteSave',
      component: SellInviteSaveComponent,
      data: { breadcrumb: '邀请有礼活动配置' }
  },
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule],
})
export class SellRoutingModule {}
