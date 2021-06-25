import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class CustomerMerchantService {

  /**
   * 客户管理列表
   */
  public get_URL = "/customer/list";

  constructor(public httpClient: HttpClient) { }

  /**
   * 客户管理列表
   */
  public getList(json: any | null): Observable<any> {
    let jsons = { ...json };
    jsons.user = jsons.user.trim();
    if (jsons.dateFormat.length != 0) {
      jsons.beginTime = this.shiftDate(jsons.dateFormat[0]);
      jsons.endTime = this.shiftDate(jsons.dateFormat[1]);
      delete jsons.dateFormat;
    }
    return this.httpClient.post(this.get_URL, jsons);
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
