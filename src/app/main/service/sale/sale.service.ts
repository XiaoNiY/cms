import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class SaleService {

  /**
   * 列表
   */
  public GET_URL = "/orderRefund/list";
  /**
   * 文件上传地址
   */
  public FILE_URL = "/common/upload/file";
  /**
   * 新增跟进
   */
  public followerSave_URL = "/follower/save";
  /**
   * 跟进查询
   */
  public followerList_URL = "/follower/list";

  constructor(public httpClient: HttpClient) { }


  /**
  * 售后列表
  * @param json 参数
  */
  public get(json: any | null): Observable<any> {
    let jsons = { ...json };
    if (jsons.createFormat && jsons.createFormat.length != 0) {
      jsons.createTimeStart = this.shiftDate(jsons.createFormat[0]);
      jsons.createTimeEnd = this.shiftDate(jsons.createFormat[1]);
      delete jsons.createFormat;
    }
    if (jsons.timeoutFormat && jsons.timeoutFormat.length != 0) {
      jsons.timeoutTimeStart = this.shiftDate(jsons.timeoutFormat[0]);
      jsons.timeoutTimeStart = this.shiftDate(jsons.timeoutFormat[1]);
      delete jsons.timeoutFormat;
    }
    return this.httpClient.get(this.GET_URL, { params: jsons });
  }
  /**
   * 跟进查询
   */
  public followerLst(json: any | null): Observable<any> {
    return this.httpClient.post(this.followerList_URL, json);
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
   * 上传文件
   * @param fileToUpload 
   * @returns 
   */
  public postFile(fileToUpload: File): Observable<any> {
    const formData: FormData = new FormData();
    formData.append('file', fileToUpload);
    formData.append('name', "refund");
    return this.httpClient.post(this.FILE_URL, formData);
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
