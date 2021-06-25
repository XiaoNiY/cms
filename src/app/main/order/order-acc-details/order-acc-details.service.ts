import { Injectable } from "@angular/core";
import { HttpClient, HttpParams } from "@angular/common/http";
import { Observable } from "rxjs";
@Injectable({
  providedIn: 'root'
})
export class OrderAccDetailsService {
  /**
   * 配件订单详情
   */
  public details_URL = "/order/details";
  /**
   * 修改订单
   */
  public UPDATE_URL = "/order/update";
  /**
   * 改价
   */
  public modifyPrice_URL = "/order/modifyPrice";
  /**
   * 跟进查询
   */
  public followerList_URL = "/follower/list";
  /**
   * 文件上传地址
   */
  public FILE_URL = "/common/upload/file";
  /**
   * 新增跟进
   */
  public followerSave_URL = "/follower/save";

  constructor(public httpClient: HttpClient) { }

  /**
   * 上传文件
   * @param fileToUpload 
   * @returns 
   */
  public postFile(fileToUpload: File): Observable<any> {
    const formData: FormData = new FormData();
    formData.append('file', fileToUpload);
    formData.append('name', "order");
    return this.httpClient.post(this.FILE_URL, formData);
  }
  /**
   * 新增跟进
   */
  public followerSave(json: any | null): Observable<any> {
    let jsons = { ...json };
    jsons.enclosure = jsons.enclosure.map((ele: any) => {
      return ele.url
    }).join(',');

    return this.httpClient.post(this.followerSave_URL, jsons);
  }
  /**
   * 跟进查询
   */
  public followerLst(json: any | null): Observable<any> {
    return this.httpClient.post(this.followerList_URL, json);
  }
  /**
   * 入库单详情
   */
  public getDetails(id: any | null): Observable<any> {
    return this.httpClient.post(this.details_URL, { id: id });
  }
  /**
   * 改价
   */
  public modifyPrice(json: any | null): Observable<any> {
    return this.httpClient.post(this.modifyPrice_URL, json);
  }
  /**
   * 修改订单
   */
  public update(json: any | null): Observable<any> {
    let jsons = { ...json };
    if (jsons.afterSaleCloseTime) {
      jsons.afterSaleCloseTime = this.shiftDate(jsons.afterSaleCloseTime) + " 23:59:59";
    }
    return this.httpClient.post(this.UPDATE_URL, jsons);
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
