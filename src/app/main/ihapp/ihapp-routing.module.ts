import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';
import { AppDetailsComponent } from './app-details/app-details.component';
import { AppHardcoreAreaComponent } from './app-hardcore-area/app-hardcore-area.component';
import { AppHomeActivityComponent } from './app-home-activity/app-home-activty.component';
import { AppHotSearchComponent } from './app-hot-search/app-hot-search.component';
import { AppManagementComponent } from './app-management/app-management.component';

const routes: Routes = [
  // 默认访问
  { path: '', redirectTo: 'app', pathMatch: 'full' },
  // 爱乐物金刚区
  {
    path: 'appHardcoreArea', component: AppHardcoreAreaComponent,
    data: { breadcrumb: '金刚区' }
  },
  // 爱乐物首页活动
  {
    path: 'appHomeActivity', component: AppHomeActivityComponent,
    data: { breadcrumb: '首页活动' }
  },
  // 爱乐物热门搜索
  {
    path: 'appHotSearch', component: AppHotSearchComponent,
    data: { breadcrumb: '热门搜索' }
  },
  // 爱乐物分类管理
  {
    path: 'appManagement', component: AppManagementComponent,
    data: { breadcrumb: '分类管理' }
  },
  // 爱乐物详情
  {
    path: 'appDetails/:id', component: AppDetailsComponent,
    data: { breadcrumb: '爱乐物详情' }
  },
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class ServiceRoutingModule { }
