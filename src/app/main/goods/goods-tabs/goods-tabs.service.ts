import { Injectable } from '@angular/core';
import { HttpClient, HttpParams } from "@angular/common/http";
import { Observable } from "rxjs";
@Injectable({
  providedIn: 'root'
})
export class GoodsTabsService {
  // 商品详情 公共数据
  public detailsData:any = null;
  // 更新详情 通知回调
  public updateDetails:any = null;
  // tabs更新 通知回调
  public updateFun:any = null;
  // 获取商品详情
  public GET_URL = "/goods/get/";
  // 上下架
  public UPDATE_STATUS_URL = "/goods/update/onlineStatusBatch";
  

  constructor(public httpClient: HttpClient) { }
  /**
  * 删除
  */
  public get(id: any | null): Observable<any> {
    const url = `${this.GET_URL}${id}`;
    return this.httpClient.get(url);
  }
  /**
  * 上下架
  */
  public updateStatus(json: any | null): Observable<any> {
    return this.httpClient.get(this.UPDATE_STATUS_URL, { params: json });
  }

}
