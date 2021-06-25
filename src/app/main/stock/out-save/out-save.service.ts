import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class OutSaveService {

  /**
   * 供应商列表
   */
  public SupplierList_URL = "/supplier/list";
  /**
   * 仓库列表
   */
  public whList_URL = "/whPut/list";
  /**
   * 出库单详情
   */
  public details_URL = "/deliveryDetails/list";
  /**
   * 仓库商品列表
   */
  public whGet_URL = "/whgoods/conditionQuery";
  /**
   * 添加出库单
   */
  public save_URL = "/delivery/save";
  /**
   * 修改出库单
   */
  public update_URL = "/delivery/update";
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
  * 添加出库单
  */
  public save(json: any | null) {
    let jsons = JSON.parse(JSON.stringify(json));
    jsons.delivery.districtId = jsons.delivery.districtId[2];
    delete jsons.delivery.id;

    for (let index = 0; index < jsons.list.length; index++) {
      const element = jsons.list[index];
      delete element.name;
      delete element.code;
      delete element.standardCostPrice;
    }
    return this.httpClient.post(this.save_URL, jsons);
  }
  /**
  * 修改出库单
  */
  public update(json: any | null) {
    let jsons = JSON.parse(JSON.stringify(json));
    jsons.delivery.districtId = jsons.delivery.districtId[2];

    for (let index = 0; index < jsons.list.length; index++) {
      const element = jsons.list[index];
      delete element.name;
      delete element.code;
      delete element.standardCostPrice;
    }
    return this.httpClient.post(this.update_URL, jsons);
  }

  /**
   * 出库单详情
   */
  public getDetails(id: any | null): Observable<any> {
    return this.httpClient.post(this.details_URL, { id: id });
  }

  /**
   * 仓库商品列表
   */
  public whGetList(json: any | null): Observable<any> {
    return this.httpClient.post(this.whGet_URL, json);
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
}
