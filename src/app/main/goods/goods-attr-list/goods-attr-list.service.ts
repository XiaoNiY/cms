import { Injectable } from "@angular/core";
import { HttpClient, HttpParams } from "@angular/common/http";
import { Observable } from "rxjs";
@Injectable({
  providedIn: 'root'
})
export class GoodsAttrListService {
  public GET_URL = "/goodsattr/list/page";
  public GETITEM_URL = "/goodsattr/get/";
  public DELETE_URL = "/goodsattr/remove/";

  public ADD_URL = "/goodsattr/add";
  public UPDATE_URL = "/goodsattr/update";
  constructor(public httpClient: HttpClient) { }
  /**
  * 参数列表
  * @param json 参数
  */
  public get(json: any | null): Observable<any> {
    return this.httpClient.get(this.GET_URL, { params: json });
  }
  /**
  * 添加参数
  * @param json 参数
  */
  public add(json: any | null): Observable<any> {
    delete json.id;
    return this.httpClient.post(this.ADD_URL, new HttpParams({ fromObject: json }));
  }
  /**
  * 更新参数
  * @param json 参数
  */
  public update(json: any | null): Observable<any> {
    return this.httpClient.post(this.UPDATE_URL, new HttpParams({ fromObject: json }));
  }
  /**
  * 根据ID获取参数详情
  * @param json 参数
  */
  public getItem(id: any | null): Observable<any> {
    const url = `${this.GETITEM_URL}${id}`;
    return this.httpClient.get(url);
  }
  /**
  * 删除参数
  * @param json 参数
  */
  public delete(id: any | null): Observable<any> {
    const url = `${this.DELETE_URL}${id}`;
    return this.httpClient.get(url);
  }


}
