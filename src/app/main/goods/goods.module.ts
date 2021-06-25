import { CommonModule } from "@angular/common";
import { NgModule } from "@angular/core";
import { FormsModule ,ReactiveFormsModule} from '@angular/forms'; 
import { HtmlPipe } from '../../shared/HtmlPipe';
import { goodsRoutesModule } from './goods-routing.module';

import { NzIconModule } from 'ng-zorro-antd/icon';
import { AlertFill } from '@ant-design/icons-angular/icons';
import { IconDefinition } from '@ant-design/icons-angular';

import { GoodsAttrService } from './goods-attr/goods-attr.service';
import { GoodsClassifyService } from './goods-classify/goods-classify.service';

// import { GoodsAttrComponent } from './goods-attr/goods-attr.component';
import { GoodsAllComponent } from './goods-all/goods-all.component';
import { DemoNgZorroAntdModule } from '../../NG-ZORRO/ng-zorro-antd.module';
import { GoodsTabsComponent } from './goods-tabs/goods-tabs.component';
import { GoodsBasicComponent } from './goods-basic/goods-basic.component';
import { GoodsParamComponent } from './goods-param/goods-param.component';
import { GoodsSpecComponent } from './goods-spec/goods-spec.component';
import { GoodsImgComponent } from './goods-img/goods-img.component';
import { GoodsInfoBComponent } from './goods-info-b/goods-info-b.component';
import { GoodsInfoCComponent } from './goods-info-c/goods-info-c.component';
import { GoodsClassifyComponent } from './goods-classify/goods-classify.component';
// import { GoodsAttrListComponent } from './goods-attr-list/goods-attr-list.component';
import { GoodsPublicnoteComponent } from './goods-publicnote/goods-publicnote.component';
import { GoodsPriceComponent } from './goods-price/goods-price.component';
import { GoodsStockComponent } from './goods-stock/goods-stock.component';
import { GoodsSpecarrComponent } from './goods-specarr/goods-specarr.component';
import { GoodsSpecarrSaveComponent } from './goods-specarr-save/goods-specarr-save.component';

// 封装组件module
import { sharedModule } from '../../sharedModule/shared.module';
import { GoodsRecommendConfigComponent } from "./goods-recommend-config/goods-recommend-config.component";
import { ClientTypeManagementComponent } from "./client-type-management/client-type-management.component";
const icons: IconDefinition[] = [AlertFill];
@NgModule({
  declarations: [
    HtmlPipe,
    // GoodsAttrComponent,
    GoodsAllComponent,
    GoodsTabsComponent,
    GoodsBasicComponent,
    GoodsParamComponent,
    GoodsSpecComponent,
    GoodsImgComponent,
    GoodsInfoBComponent,
    GoodsInfoCComponent,
    GoodsClassifyComponent,
    // GoodsAttrListComponent,
    GoodsPublicnoteComponent,
    GoodsPriceComponent,
    GoodsStockComponent,
    GoodsSpecarrComponent,
    GoodsSpecarrSaveComponent,
    GoodsRecommendConfigComponent,
    ClientTypeManagementComponent,
  ],
  imports: [
    sharedModule,
    CommonModule,
    ReactiveFormsModule,
    FormsModule,
    NzIconModule.forRoot(icons),
    goodsRoutesModule,
    DemoNgZorroAntdModule,
  ],
  exports: [
  ],
  providers: [
    GoodsAttrService,
    GoodsClassifyService,
  ]
})
export class GoodsModule { }
