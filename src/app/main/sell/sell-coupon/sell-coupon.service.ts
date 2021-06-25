import { Injectable } from "@angular/core";
import { HttpClient } from "@angular/common/http";
import { Observable } from "rxjs";
@Injectable({
    providedIn: 'root'
})
export class SellCouponService {
    // 根据请求状态不同来区分功能
    public coupon_URL = "/coupon/";
    public STOP_URL = "/coupon/stop/";

    /**
     * 客户管理列表
     */
    public user_URL = "/customer/list";
    /**
     * 手动发放优惠券
     */
    public sendCoupons_URL = "/couponUserRecord/issueCoupons";

    constructor(public httpClient: HttpClient) { }
    /**
     * 客户管理列表
     */
    public getUserList(json: any | null): Observable<any> {
        return this.httpClient.post(this.user_URL, json);
    }
    /**
    * 查询列表
    * @param json 参数
    */
    public getList(json: any | null): Observable<any> {
        json.name = json.name.trim();
        return this.httpClient.get(this.coupon_URL, { params: json });
    }
    /**
    * 手动发放优惠券
    * @param json 参数
    */
    public sendCoupons(json: any | null): Observable<any> {
        return this.httpClient.post(this.sendCoupons_URL, json);
    }
    /**
     * 停止优惠券
     * @param json 参数
     */
    public stop(id: any | null): Observable<any> {
        const url = `${this.STOP_URL}${id}`;
        return this.httpClient.put(url, null);
    }
    /**
     * 删除优惠券
     * @param json 参数
     */
    public delete(id: any | null): Observable<any> {
        const url = `${this.coupon_URL}${id}`;
        return this.httpClient.delete(url);
    }
}
