import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';
import { HomeComponent } from './main/home/home.component';
import { LoginComponent } from './main/login/login.component';

const routes: Routes = [
    { path: '', pathMatch: 'full', redirectTo: 'login' },
    {
        path: 'login', component: LoginComponent
    },
    {
        path: 'home', component: HomeComponent,
        children: [
            {
                path: 'system', 
                loadChildren: () => import('./main/system/system.module').then(m => m.SystemModule)
            },
            {
                path: 'config', 
                loadChildren: () => import('./main/config/config.module').then(m => m.ConfigModule)
            },
        ]
    },
];

@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule]
})
export class AppRoutingModule { }
