import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class NewAdjustOrderService {

  /**
   * 调节单下拉选择售后单号列表
   */
  public numList_URL = "/orderRefund/listOrderRefundNum";
  /**
   * 根据售后单号获取订单相关信息
   */
  public saleInfo = "/orderRefund/toOrderAdjust/"
  /**
   * 保存调节单
   */
  public save_URL = "/orderRefund/addOrderAdjust";
  /**
   * 地区API
   */
  public area_URL = "/assets/json/area31.json";


  constructor(public httpClient: HttpClient) { }

  /**
  * 地区
  * @param json 参数
  */
  public area(): Observable<any> {
    return this.httpClient.get(this.area_URL);
  }
  /**
   * 根据售后单号获取订单相关信息
   */
  getSaleInfo(id: Number = 0) {
    const url = `${this.saleInfo}${id}`;
    return this.httpClient.get(url);
  }
  /**
  * 调节单下拉选择售后单号列表
  * @param json 参数
  */
  public numList(json: any | null): Observable<any> {
    return this.httpClient.get(this.numList_URL, { params: json });
  }
  /**
   * 保存调节单
   */
  public save(json: any | null): Observable<any> {
    let jsons = JSON.parse(JSON.stringify(json));
    jsons.districtId = jsons.districtId[2];
    return this.httpClient.post(this.save_URL, jsons);
  }
}
