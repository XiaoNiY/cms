import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';

import { RoleComponent } from './role/role.component';
import { ULogComponent } from './ulog/ulog.component';
import { InLogComponent } from './in-log/in-log.component';
import { StaffComponent } from './staff/staff.component';
import { MenuComponent } from './menu/menu.component';
const routes: Routes = [
  // 默认访问
  { path: '', redirectTo: 'role', pathMatch: 'full' },
  // 菜单管理
  {
    path: 'menu', component: MenuComponent,
    data: { breadcrumb: '菜单管理' }
  },
  // 角色管理
  {
    path: 'role', component: RoleComponent,
    data: { breadcrumb: '角色管理' }
  },
  // 员工管理
  {
    path: 'staff', component: StaffComponent,
    data: { breadcrumb: '员工管理' }
  },
  // 操作日志
  {
    path: 'ulog', component: ULogComponent,
    data: { breadcrumb: '操作日志' }
  },
  // 登陆日志
  {
    path: 'inLog', component: InLogComponent,
    data: { breadcrumb: '登陆日志' }
  },
];
@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class SystemRoutingModule { }
