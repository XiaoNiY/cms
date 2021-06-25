import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';

// import { GoodsAttrComponent } from './goods-attr/goods-attr.component';
import { GoodsAllComponent } from './goods-all/goods-all.component';
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
import { GoodsRecommendConfigComponent } from './goods-recommend-config/goods-recommend-config.component';
import { ClientTypeManagementComponent } from './client-type-management/client-type-management.component';

export const goodsRoutes: Routes = [
    // 默认访问
    { path: '', redirectTo: 'goodsTabs', pathMatch: 'full' },
    // 所有商品
    {
        path: 'goodsAll', component: GoodsAllComponent,
        data: { breadcrumb: '所有商品', keep: true },
    },
    // 商品属性
    // {
    //     path: 'goodsAttr', component: GoodsAttrComponent,
    //     data: { breadcrumb: '商品属性',keep: true  },
    // },
    // 商品属性列表
    // {
    //     path: 'goodsList', component: GoodsAttrListComponent,
    //     data: { breadcrumb: '商品属性列表',keep: true  },
    // },
    // 商品分类
    {
        path: 'goodsClassify', component: GoodsClassifyComponent,
        data: { breadcrumb: '商品分类', keep: true },
    },
    // 商品通用说明
    {
        path: 'goodsPublicnote', component: GoodsPublicnoteComponent,
        data: { breadcrumb: '商品分类', keep: true },
    },
    // 商品规格组
    {
        path: 'goodsSpenarr', component: GoodsSpecarrComponent,
        data: { breadcrumb: '商品规格组', keep: true },
    },
    // 添加商品规格组
    {
        path: 'goodsSpenarrSave/:id', component: GoodsSpecarrSaveComponent,
        data: { breadcrumb: '添加商品规格组' },
    },
    // 推荐商品配置
    {
        path: 'goodsRecommendConfig', component: GoodsRecommendConfigComponent,
        data: { breadcrumb: '推荐商品配置' },
    },
    // 用户端分类管理
    {
        path: 'clientTypeManagement', component: ClientTypeManagementComponent,
        data: { breadcrumb: '用户端分类管理' },
    },
    // 商品详情tabs
    {
        path: 'goodsTabs/:id',
        component: GoodsTabsComponent,
        data: { id: 0, breadcrumb: '新增商品' },
        children: [
            // { path: '', redirectTo: 'goodsBasic', pathMatch: 'full' },
            // 商品-基本信息
            {
                path: 'goodsBasic', component: GoodsBasicComponent,
                data: { breadcrumb: '基本信息' },
            },
            // 商品-价格信息
            {
                path: 'goodsPrice', component: GoodsPriceComponent,
                data: { breadcrumb: '价格信息' },
            },
            // 商品-参数
            {
                path: 'goodsParam', component: GoodsParamComponent,
                data: { breadcrumb: '商品参数' },
            },
            // 商品-规格
            {
                path: 'goodsSpec', component: GoodsSpecComponent,
                data: { breadcrumb: '商品规格' },
            },
            // 商品-图片信息
            {
                path: 'goodsImg', component: GoodsImgComponent,
                data: { breadcrumb: '图片信息' },
            },
            // 商品-C端
            // {
            //     path: 'goodsInfoC', component: GoodsInfoCComponent,
            //     data: { breadcrumb: '详细信息C端' },
            // },
            // 商品-B端
            {
                path: 'goodsInfoB', component: GoodsInfoBComponent,
                data: { breadcrumb: '详细信息B端' },
            },
            // 商品-库存信息
            {
                path: 'goodsStock', component: GoodsStockComponent,
                data: { breadcrumb: '库存信息' },
            },

        ]
    },
    //通配符 通常指向404页面
    { path: '**', redirectTo: 'goodsTabs' },
];

@NgModule({
    imports: [RouterModule.forChild(goodsRoutes)],
    exports: [RouterModule]
})
export class goodsRoutesModule { }