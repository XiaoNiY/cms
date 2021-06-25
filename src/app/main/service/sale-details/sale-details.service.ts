import { Injectable } from "@angular/core";
import { HttpClient, HttpParams } from "@angular/common/http";
import { Observable } from "rxjs";

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
  /**
   * 物流查询
   */
  public findOrderExpress_URL = "/orderExpress/findOrderExpress";

  constructor(public httpClient: HttpClient) { }
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
   * 售后订单详情
   */
  public getDetails(id: any | null): Observable<any> {
    const url = `${this.details_URL}${id}`;
    return this.httpClient.get(url);
  }
  /**
   * 物流查询
   */
  public findOrderExpress(json: any | null): Observable<any> {
    return this.httpClient.post(this.findOrderExpress_URL, new HttpParams({ fromObject: json }));
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
   * 修改物流公司
   */
  public updateExpress(json: any | null): Observable<any> {
    return this.httpClient.post(this.updateExpress_URL, json);
  }
  /**
   * 售后处理接口
   */
  public updateOrder(json: any | null): Observable<any> {
    let jsons = { ...json };
    jsons.imgs2 = JSON.stringify(jsons.imgs2);
    return this.httpClient.post(this.updateOrder_URL, jsons);
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
