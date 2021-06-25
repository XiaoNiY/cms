import { BrowserModule } from '@angular/platform-browser';
import { NgModule } from '@angular/core';
import { AppComponent } from './app.component';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { HttpClientModule, HTTP_INTERCEPTORS } from '@angular/common/http';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';

import { WholeInterceptor } from './http-interceptors/WholeInterceptor';

import { registerLocaleData, CommonModule, LocationStrategy, HashLocationStrategy, APP_BASE_HREF } from '@angular/common';
import { zh_CN } from 'ng-zorro-antd/i18n';
import { NZ_I18N } from 'ng-zorro-antd/i18n';
import { NzIconModule } from 'ng-zorro-antd/icon';
import { AlertFill } from '@ant-design/icons-angular/icons';
import { IconDefinition } from '@ant-design/icons-angular';
import zh from '@angular/common/locales/zh';
import { RouteReuseStrategy } from '@angular/router';

import { RoutingCache } from './RoutesCache';
import { AppRoutingModule } from './app-routing.module';
import { DemoNgZorroAntdModule } from './NG-ZORRO/ng-zorro-antd.module';

import { HomeComponent } from './main/home/home.component';
import { LoginComponent } from './main/login/login.component';


registerLocaleData(zh);
const icons: IconDefinition[] = [AlertFill];

@NgModule({
  declarations: [
    AppComponent,
    HomeComponent,
    LoginComponent,
  ],
  imports: [
    BrowserModule,
    CommonModule,
    AppRoutingModule,
    FormsModule,
    ReactiveFormsModule,
    HttpClientModule,
    BrowserAnimationsModule,
    DemoNgZorroAntdModule,

    NzIconModule.forRoot(icons),
  ],
  providers: [
    { provide: NZ_I18N, useValue: zh_CN },
    { provide: RouteReuseStrategy, useClass: RoutingCache },
    { provide: LocationStrategy, useClass: HashLocationStrategy },
    { provide: APP_BASE_HREF, useValue: '/' },
    //全局Http拦截
    { provide: HTTP_INTERCEPTORS, useClass: WholeInterceptor, multi: true },
  ],
  bootstrap: [AppComponent]
})
export class AppModule { }
