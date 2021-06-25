import { Injectable } from "@angular/core";
import { HttpClient, HttpParams } from "@angular/common/http";
import { Observable } from "rxjs";

@Injectable()
export class ConfigBrandService {
  public GET_URL = "/brand/list/page";
  public ADD_URL = "/brand/add";
  public UPDATE_URL = "/brand/update";
  public DELETE_URL = "/brand/remove/";

  public ADD_ITEM_URL = "/brand/get/";
  constructor(public httpClient: HttpClient) { }
  /**
  * 品牌列表
  * @param json 参数
  */
  public get(json: any | null): Observable<any> {
    json.name = json.name.trim();
    return this.httpClient.get(this.GET_URL, { params: json });
  }
  /**
  * 添加品牌
  * @param json 参数
  */
  public add(json: any | null): Observable<any> {
    delete json.id;
    return this.httpClient.post(this.ADD_URL, new HttpParams({ fromObject: json }));
  }
  /**
  * 更新品牌
  * @param json 参数
  */
  public update(json: any | null): Observable<any> {
    return this.httpClient.get(this.UPDATE_URL, { params: json });
  }
  /**
  * 删除品牌
  * @param json 参数
  */
  public delete(id: any | null): Observable<any> {
    const url = `${this.DELETE_URL}${id}`;
    return this.httpClient.get(url);
  }
  /**
  * 根据ID获取品牌详情
  * @param json 参数
  */
  public getItem(id: any | null): Observable<any> {
    const url = `${this.ADD_ITEM_URL}${id}`;
    return this.httpClient.get(url);
  }
}
