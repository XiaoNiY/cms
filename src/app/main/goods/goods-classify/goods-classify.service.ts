import { Injectable } from "@angular/core";
import { HttpClient, HttpParams } from "@angular/common/http";
import { Observable } from "rxjs";

@Injectable({
  providedIn: 'root'
})
export class GoodsClassifyService {

  // 添加分类
  public ADD_URL = "/goodstypes/add";
  // 分类列表
  public GET_URL = "/goodstypes/list";
  // 获取分类item
  public GETITEM_URL = "/goodstypes/get/";
  // 分类下拉
  public GETLIST_URL = "/goodstypes/list/";
  // 分类删除
  public DELETE_URL = "/goodstypes/remove/";
  // 分类更新
  public UPDATE_URL = "/goodstypes/update";

  constructor(public httpClient: HttpClient) { }

  /**
  * 添加分类
  * @param json 参数
  */
  public add(json: any | null): Observable<any> {
    delete json.id;
    json.type == 0 ? delete json.url : null;
    return this.httpClient.post(this.ADD_URL, new HttpParams({ fromObject: json }));
  }
  /**
  * 分类列表
  * @param json 参数
  */
  public get(): Observable<any> {
    return this.httpClient.get(this.GET_URL);
  }
  /**
  * 分类列表
  * @param json 参数
  */
  public getList(id: any | null): Observable<any> {
    const url = `${this.GETLIST_URL}${id}`;
    return this.httpClient.get(url);
  }
  /**
  * 根据ID获取分类详情
  * @param json 参数
  */
  public getItem(id: any | null): Observable<any> {
    const url = `${this.GETITEM_URL}${id}`;
    return this.httpClient.get(url);
  }
  /**
  * 更新分类
  * @param json 参数
  */
  public update(json: any | null): Observable<any> {
    json.type == 0 ? delete json.url : null;
    return this.httpClient.post(this.UPDATE_URL, new HttpParams({ fromObject: json }));
  }
  /**
  * 删除分类
  * @param json 参数
  */
  public delete(id: any | null): Observable<any> {
    const url = `${this.DELETE_URL}${id}`;
    return this.httpClient.get(url);
  }

}
