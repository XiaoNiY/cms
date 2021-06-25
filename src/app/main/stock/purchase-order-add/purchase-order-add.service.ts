import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
@Injectable({
  providedIn: 'root'
})
export class PurchaseOrderAddService {

  /**
  * 采购计划单列表
  */
  public PlanList_URL = "/procurementPlan/list";
  /**
   * 供应商列表
   */
  public SupplierList_URL = "/supplier/list";
  /**
   * 申请单列表
   */
  public PlanDetails_URL = "/purchasePlanDetails/list";
  /**
   * 添加采购单
   */
  public save_URL = "/purchase/save";
  /**
   * 采购单详情
   */
  public details_URL = "/purchaseDetails/list";
  /**
   * 修改采购单
   */
  public update_URL = "/purchase/update";


  constructor(private httpClient: HttpClient) { }
  /**
   * 采购计划列表
   */
  public getPlanList() {
    let json = {
      // 计划单号
      billNo: '',
      // 包含商品
      whGood: '',
      // 状态(0 草稿 1待审核 2审核通过 3审核不通过 4采购中 5已完成 6已关闭)
      state: '',
      // 页数 1
      page: '1',
      // 页码 10
      pageSize: '9999',
      beginTime: '',
      endTime: '',
    }
    return this.httpClient.post(this.PlanList_URL, json);
  }
  /**
   * 供应商列表
   */
  public getSupplierList() {
    let json = {
      name: '',
      type: '',
      // 状态(0草稿、1正常、2冻结、3合作结束、4合同过期)
      state: '',
      page: '1',
      pageSize: '9999',
    }
    return this.httpClient.post(this.SupplierList_URL, json);
  }
  /**
  * 申请单列表
  */
  public getPlanDetails(id: any) {
    let json = {
      id: id,
    }
    return this.httpClient.post(this.PlanDetails_URL, json);
  }
  /**
  * 添加采购单
  */
  public save(json: any | null) {
    let jsons = JSON.parse(JSON.stringify(json));
    let arr = jsons.list;
    for (let index = 0; index < arr.length; index++) {
      const element = arr[index];

      let d = new Date(element.deliveryTime)
      let str = d.getFullYear() + '-' + this.p((d.getMonth() + 1)) + '-' + this.p(d.getDate());

      element.deliveryTime = str;

    }

    return this.httpClient.post(this.save_URL, jsons);
  }
  /**
   * 采购单详情
   */
  public details(id: any | null): Observable<any> {
    return this.httpClient.post(this.details_URL, {id:id});
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
    return this.httpClient.post(this.update_URL,jsons);
  }

  /**
   * 补0
   * @param s 
   */
  p(s: any) {
    return s < 10 ? '0' + s : s
  }

}
