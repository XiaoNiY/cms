import { Injectable } from "@angular/core";
import { HttpClient, HttpParams } from "@angular/common/http";
import { Observable } from "rxjs";
@Injectable()
export class GoodsAttrService {
  // 获取类型列表
  public GET_URL = "/goodsattrtype/list/page";
  // 删除类型
  public DELETE_URL = "/goodsattrtype/remove/";

  public ADD_URL = "/goodsattrtype/add";
  public UPDATE_URL = "/goodsattrtype/update";

  // 获取类型列表item
  public GETITEM_URL = "/goodsattrtype/get/";

  constructor(public httpClient: HttpClient) { }
  /**
  * 类型列表
  * @param json 参数
  */
  public get(json: any | null): Observable<any> {
    return this.httpClient.get(this.GET_URL, { params: json });
  }
  /**
  * 添加类型
  * @param json 参数
  */
  public add(json: any | null): Observable<any> {
    delete json.id;
    return this.httpClient.post(this.ADD_URL, new HttpParams({ fromObject: json }));
  }
  /**
  * 更新类型
  * @param json 参数
  */
  public update(json: any | null): Observable<any> {
    return this.httpClient.get(this.UPDATE_URL, { params: json });
  }

  /**
  * 删除类型
  * @param json 参数
  */
  public delete(id: any | null): Observable<any> {
    const url = `${this.DELETE_URL}${id}`;
    return this.httpClient.get(url);
  }  
  /**
  * 根据ID获取类型详情
  * @param json 参数
  */
  public getItem(id: any | null): Observable<any> {
    const url = `${this.GETITEM_URL}${id}`;
    return this.httpClient.get(url);
  }

}
