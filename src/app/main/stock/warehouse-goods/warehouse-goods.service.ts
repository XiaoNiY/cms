import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';

@Injectable({
    providedIn: 'root'
})
export class WarehouseGoodsService {

    /**
     * 获取仓库商品列表
     */
    public get_URL = "/whgoods/query";
    /**
     * 删除仓库商品
     * @param httpClient 
     */
    public del_URL = "/whgoods/delete";
    /**
     * 同步
     */
    public itemSynchronize_URL = "/whgoods/itemSynchronize";
    /**
    * 同步商品库存
    */
    public stockInventoryQuery_URL = "/whgoods/stockInventoryQuery";
    /**
     * 仓库商品分类下拉
     */
    public type_URL = "/goodstypes/list/";
    /**
     * 仓库商品 品牌下拉
     */
    public brand_URL = "/brand/list";


    constructor(private httpClient: HttpClient) { }

    /**
     * 仓库商品列表
     */
    public getList(json: any | null): Observable<any> {
        let jsons = { ...json };
        if (jsons.dateFormat.length != 0) {
            jsons.beginTime = this.shiftDate(jsons.dateFormat[0]);
            jsons.endTime = this.shiftDate(jsons.dateFormat[1]);
            delete jsons.dateFormat;
        }
        return this.httpClient.post(this.get_URL, json);
    }
    /**
     * 删除仓库商品
     */
    public del(json: any | null): Observable<any> {
        return this.httpClient.post(this.del_URL, json);
    }

    /**
     * 同步
     */
    public itemSynchronize(): Observable<any> {
        return this.httpClient.post(this.itemSynchronize_URL, null);
    }
    /**
     * 同步商品库存
     */
    public stockInventoryQuery(): Observable<any> {
        return this.httpClient.post(this.stockInventoryQuery_URL, null);
    }
    /**
     * 仓库商品分类下拉
     */
     public getGoodsTypeList(id: any = 1): Observable<any> {
        const url = `${this.type_URL}${id}`
        return this.httpClient.get(url);
    }

    /**
     * 仓库商品 品牌下拉
     */
    public getBrandList(): Observable<any> {
        return this.httpClient.get(this.brand_URL);
    }
    /**
     * 时间格式转换 年月日
     * @param date 
     * @returns 
     */
    shiftDate(date: any) {
        let d = new Date(date)
        let str = d.getFullYear() + '-' + this.p((d.getMonth() + 1)) + '-' + this.p(d.getDate());
        return str;
    }
    /**
     * 补0
     * @param s 
     */
    p(s: any) {
        return s < 10 ? '0' + s : s
    }
}
