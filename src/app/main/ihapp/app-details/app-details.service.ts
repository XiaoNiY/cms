import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class SaleDetailsService {

  /**
   * 售后订单详情
   */
  public details_URL = "/orderRefund/details/";
  /**
   * 修改物流公司
   */
  public updateExpress_URL = "/orderRefund/updateExpress";
  /**
   * 售后处理接口
   */
  public updateOrder_URL = "/orderRefund/updateOrder";
  /**
   * 收货地址
   */
  public siteList_URL = "/address/list";

  constructor(public httpClient: HttpClient) { }
  /**
   * 售后订单详情
   */
  public getDetails(id: any | null): Observable<any> {
    const url = `${this.details_URL}${id}`;
    return this.httpClient.get(url);
  }
  /**
   * 修改物流公司
   */
  public updateExpress(json: any | null): Observable<any> {
    return this.httpClient.post(this.updateExpress_URL, json);
  }
  /**
   * 售后处理接口
   */
  public updateOrder(json: any | null): Observable<any> {
    return this.httpClient.post(this.updateOrder_URL, json);
  }
  /**
  * 查询收货地址
  * @param json 参数
  */
  public getSiteList(json: any | null): Observable<any> {
    json.name = json.name.trim();
    return this.httpClient.post(this.siteList_URL, json);
  }
}
