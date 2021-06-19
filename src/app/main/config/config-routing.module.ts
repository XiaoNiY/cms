import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { AddressComponent } from './address/address.component';

const routes: Routes = [
  { path: '', redirectTo: 'address', pathMatch: 'full' },
  {
    path: 'address',
    component: AddressComponent,
    data: { breadcurmb: '地址管理' },
  },
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule],
})
export class ConfigRoutingModule {}
