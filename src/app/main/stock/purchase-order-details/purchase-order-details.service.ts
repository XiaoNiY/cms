import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
@Injectable({
  providedIn: 'root'
})
export class PurchaseOrderDetailsService {

  /**
   * 采购单详情
   */
  public details_URL = "/purchaseDetails/list";

  /**
   * 修改采购单
   */
  public update_URL = "/purchase/update";
  /**
   * 手动关闭(表格内)
   */
  public close_URL = "/purchaseDetails/close";

  constructor(private httpClient: HttpClient) { }
  /**
   * 采购单详情
   */
  public details(id: any | null): Observable<any> {
    return this.httpClient.post(this.details_URL, { id: id });
  }
  /**
   * 手动关闭(表格内)
   */
  public closeList(json: any | null): Observable<any> {
    return this.httpClient.post(this.close_URL, json);
  }
  /**
   * 修改采购单
   */
  public update(json: any | null): Observable<any> {
    let jsons = JSON.parse(JSON.stringify(json));
    let arr = jsons.list;
    for (let index = 0; index < arr.length; index++) {
      const element = arr[index];
      let d = new Date(element.deliveryTime)
      let str = d.getFullYear() + '-' + this.p((d.getMonth() + 1)) + '-' + this.p(d.getDate());

      element.deliveryTime = str;
    }
    return this.httpClient.post(this.update_URL, jsons);
  }
  /**
   * 补0
   * @param s 
   */
  p(s: any) {
    return s < 10 ? '0' + s : s
  }

}
