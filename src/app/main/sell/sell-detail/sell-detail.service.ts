import { Injectable } from "@angular/core";
import { HttpClient, HttpParams } from "@angular/common/http";
import { Observable } from "rxjs";

@Injectable({
  providedIn: 'root'
})
export class SellDetailService {
  /**
   * 优惠券详情
   */
  public details_URL = "/coupon/detail/";
  /**
   * 停止用户用券
   */
  public stopUserRecord_URL = "/couponUserRecord/list";
  /**
   * 已选商品详情
   */
  public selectGoods_URL = "/goods/getGoodsByIdList";

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
  * 手动发放优惠券
  * @param json 参数
  */
  public sendCoupons(json: any | null): Observable<any> {
    return this.httpClient.post(this.sendCoupons_URL, json);
  }
  /**
  * 已选商品详情
  * @param json 参数
  */
  public selectGoodsList(json: any | null): Observable<any> {
    return this.httpClient.post(this.selectGoods_URL, json);
  }
  /**
  * 优惠券详情
  * @param json 参数
  */
  public details(json: any | null): Observable<any> {
    return this.httpClient.post(this.details_URL, json);
  }
  /**
   * 停止用户用券
   * @param json 参数
   */
  public stop(json: any | null): Observable<any> {
    return this.httpClient.put(this.stopUserRecord_URL, json);
  }
}
