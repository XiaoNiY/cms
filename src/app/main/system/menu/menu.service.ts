import { Injectable } from "@angular/core";
import { HttpClient, HttpParams } from "@angular/common/http";
import { Observable } from "rxjs";
@Injectable({
  providedIn: 'root'
})
export class MenuService {

  /**
   * 菜单列表
   */
  public GET_URL = "/sys/menu/menuList";
  /**
   * 添加菜单
   */
  public addMenu_URL = "/sys/menu/insertMenu";
  /**
   * 删除菜单
   */
  public delete_URL = "/sys/menu/deleteMenu";
  /**
   * 菜单详情
   */
  public details_URL = "/sys/menu/details/";
  /**
   * 编辑菜单
   */
  public update_URL = "/sys/menu/updateMenu";

  constructor(public httpClient: HttpClient) { }
  /**
  * 查询菜单列表
  * @param json 参数
  */
  public list(json: any | null): Observable<any> {
    return this.httpClient.post(this.GET_URL, json);
  }
  /**
  * 添加菜单
  * @param json 参数
  */
  public addMenu(json: any | null): Observable<any> {
    return this.httpClient.post(this.addMenu_URL, json);
  }
  /**
  * 删除菜单
  * @param json 参数
  */
  public delete(json: any | null): Observable<any> {
    return this.httpClient.post(this.delete_URL, json);
  }
  /**
  * 编辑菜单
  * @param json 参数
  */
  public update(json: any | null): Observable<any> {
    return this.httpClient.post(this.update_URL, json);
  }
  /**
  * 菜单详情
  * @param json 参数
  */
  public details(id: any): Observable<any> {
    const url = `${this.details_URL}${id}`;
    return this.httpClient.get(url);
  }
}
