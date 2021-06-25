import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class PutSaveService {

  /**
   * 采购单列表
   */
  public purchaseList_URL = "/purchase/list";
  /**
   * 仓库列表
   */
  public whList_URL = "/whPut/list";

  /**
   * 入库单详情
   */
  public details_URL = "/warehousingDetails/list";

  /**
   * 采购单详情
   */
  public purchaseDetails_URL = "/purchaseDetails/list";
  /**
   * 添加入库单
   */
  public save_URL = "/warehousing/save";
  /**
   * 修改入库单
   */
  public update_URL = "/warehousing/update";

  constructor(public httpClient: HttpClient) { }
  /**
   * 采购单查询
   */
  public getPurchaseList(): Observable<any> {
    return this.httpClient.post(this.purchaseList_URL, {
      // 采购单
      purchaseNumber: '',
      // 采购申请单
      applyNumber: '',
      //状态
      state: '',
      // 开始时间
      beginTime: '',
      // 结束时间
      endTime: '',
      // 时间区间
      dateFormat: '',
      // 包含商品
      whGood: '',
      page: '1',
      pageSize: '9999',
    });
  }
  /**
   * 仓库列表
   */
  public getWhList(): Observable<any> {
    return this.httpClient.post(this.whList_URL, {
      name: '',
      type: '',
      // 多少页，默认1
      page: '1',
      // 每页多少条，默认10
      pageSize: '9999',
    });
  }
  /**
   * 入库单详情
   */
  public details(id: any | null): Observable<any> {
    return this.httpClient.post(this.details_URL, { id: id });
  }
  /**
   * 采购单详情
   */
  public getPurchaseDetails(id: any | null): Observable<any> {
    return this.httpClient.post(this.purchaseDetails_URL, { id: id });
  }
  /**
  * 添加采购单
  */
  public save(json: any | null) {
    return this.httpClient.post(this.save_URL, json);
  }
  /**
  * 修改采购单
  */
  public update(json: any | null) {
    return this.httpClient.post(this.update_URL, json);
  }

}
