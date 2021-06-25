import { Injectable } from "@angular/core";
import { HttpClient, HttpParams } from "@angular/common/http";
import { Observable } from "rxjs";

@Injectable({
  providedIn: 'root'
})
export class OrderAccService {
  // 列表
  public GET_URL = "/order/list";
  // 批量审核
  public audit_URL = "/order/deliverySynchronize";
  // 导出主信息
  public export_URL = "/order/getOrderExcel";
  // 导出明细信息
  public getOrderDescExcel_URL = "/order/getOrderDescExcel";

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
  * 列表
  * @param json 参数
  */
  public get(json: any | null): Observable<any> {
    let jsons = { ...json };
    jsons.orderNum = jsons.orderNum.trim();
    jsons.goodsName = jsons.goodsName.trim();
    if (jsons.dateFormat.length != 0) {
      jsons.orderBeginTime = this.shiftDate(jsons.dateFormat[0]);
      jsons.orderEndTime = this.shiftDate(jsons.dateFormat[1]);
      delete jsons.dateFormat;
    }
    return this.httpClient.post(this.GET_URL, jsons);
  }
  /**
  * 导出
  * @param json 参数
  */
  public export(json: any | null): Observable<any> {
    let jsons = { ...json };
    let url = "";
    if (jsons.exportCode == 1) {
      url = this.export_URL;
    } else {
      url = this.getOrderDescExcel_URL;
    }
    if (jsons.dateFormat.length != 0) {
      jsons.orderBeginTime = this.shiftDate(jsons.dateFormat[0]);
      jsons.orderEndTime = this.shiftDate(jsons.dateFormat[1]);
      delete jsons.dateFormat;
    }
    delete jsons.exportCode;
    return this.httpClient.get(url, { params: jsons });
  }
  /**
  * 批量审核
  * @param json 参数
  */
  public audit(json: any | null): Observable<any> {
    return this.httpClient.post(this.audit_URL, json);
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
