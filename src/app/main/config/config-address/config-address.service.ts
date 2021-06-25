import { Injectable } from "@angular/core";
import { HttpClient, HttpParams } from "@angular/common/http";
import { Observable } from "rxjs";

@Injectable({
  providedIn: 'root'
})
export class ConfigAddressService {
  /**
   * 查询地址
   */
  public GET_URL = "/address/list";
  /**
   * 新增地址
   */
  public save_URL = "/address/save";
  /**
   * 修改或者删除地址
   */
  public edit_URL = "/address/updateOrDelete";
  /**
   * 查询详情
   */
  public details_URL = "/address/get/";
  /**
   * 地区API
   */
  public area_URL = "/assets/json/area31.json";


  constructor(public httpClient: HttpClient) { }
  /**
  * 查询地址
  * @param json 参数
  */
  public get(json: any | null): Observable<any> {
    json.name = json.name.trim();
    return this.httpClient.post(this.GET_URL, json);
  }
  /**
  * 地区
  * @param json 参数
  */
  public area(): Observable<any> {
    return this.httpClient.get(this.area_URL);
  }
  /**
  * 新增地址
  * @param json 参数
  */
  public save(json: any | null): Observable<any> {
    let jsons = JSON.parse(JSON.stringify(json));
    jsons.districtId = jsons.districtId[2];
    delete jsons.id;
    return this.httpClient.post(this.save_URL, jsons);
  }
  /**
  * 修改或者删除地址
  * @param json 参数
  */
  public edit(json: any | null): Observable<any> {
    let jsons = JSON.parse(JSON.stringify(json));
    if (jsons.delete_state == 1) {
      delete jsons.name;
      delete jsons.districtId;
      delete jsons.tel;
      delete jsons.address;
      delete jsons.contacts;
      delete jsons.region;
      delete jsons.status;
    }else{
      jsons.districtId = jsons.districtId[2];
    }
    return this.httpClient.post(this.edit_URL, jsons);
  }

  /**
  * 根据ID获取地址详情
  * @param json 参数
  */
   public details(id: any | null): Observable<any> {
    const url = `${this.details_URL}${id}`;
    return this.httpClient.get(url);
  }
  
}
