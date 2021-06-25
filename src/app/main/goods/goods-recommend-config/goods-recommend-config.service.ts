import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';

@Injectable({
    providedIn: 'root'
})
export class GoodsRecommendConfigService {

    /**
     * 列表
     */
    public recommendGoods_URL = "/recommendGoods/list";
    
    /**
     * 新增
     */
    public ADD_URL = "/recommendGoods/addRecommendGoods/";

    /**
     * 保存
     */
    public SAVE_URL = "/recommendGoods/update";

    /**
     * 删除
     */
    public DELETE_URL = "/recommendGoods/delete/";

    /**
     * 商品列表
     */
    // public GOODSLIST_URL = "/goods/list/page";
    public GOODSLIST_URL = "/recommendGoods/goodsList";

    /**
   * 商品分类下拉
   */
    public GOODSTYPE_URL = "/goodstypes/list/";

    /**
     * 品牌分类下拉
     */
    public BRAND_URL = "/brand/list";

    constructor(public httpClient: HttpClient) { }

    /**
     * 推荐商品列表
     */
    public recommend(): Observable<any> {
        return this.httpClient.get(this.recommendGoods_URL);
    }
    /**
     * 新增推荐商品
     */
    public add(id: any | null): Observable<any> {
        const url = `${this.ADD_URL}${id}`;
        return this.httpClient.post(url, null);
    }
    /**
     * 更新推荐商品
     */
    public save(json: any | null): Observable<any> {
        return this.httpClient.post(this.SAVE_URL, json);
    }
    /**
     * 删除推荐商品
     */
    public delete(id: any | null): Observable<any> {
        const url = `${this.DELETE_URL}${id}`
        return this.httpClient.delete(url);
    }

    /**
     * 商品列表
     */
    public goodsList(json: any | null): Observable<any> {
        return this.httpClient.get(this.GOODSLIST_URL, { params: json });
    }

    /**
     * 商品分类下拉
     */
    public getGoodsTypeList(id: any = 1): Observable<any> {
        const url = `${this.GOODSTYPE_URL}${id}`;
        return this.httpClient.get(url);
    }

    /**
    * 品牌列表（下拉）
    */
    public getBrandTypeList(): Observable<any> {
        return this.httpClient.get(this.BRAND_URL);
    }
}
