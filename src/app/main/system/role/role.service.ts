import { Injectable } from "@angular/core";
import { HttpClient, HttpParams } from "@angular/common/http";
import { Observable } from "rxjs";

@Injectable({
  providedIn: 'root'
})
export class RoleService {
  /**
   * 角色列表
   */
  public GET_URL = "/sys/role/roleQuery";
  /**
   * 修改角色
   */
  public UPDATE_URL = "/sys/role/roleModify";
  /**
   * 角色详情
   */
  public details_URL = "/sys/role/details/";
  /**
   * 添加角色
   */
  public add_URL = "/sys/role/save";
  /**
   * 权限列表
   */
  public menuList_URL = "/sys/menu/menuList";
  /**
   * 查询角色权限
   */
  public Permission_URL = "/sys/role/findPermission";
  /**
   * 设置角色权限
   */
  public setPermission_URL = "/sys/role/setPermission";
  
  constructor(public httpClient: HttpClient) { }
  /**
  * 添加角色
  * @param json 参数
  */
  public add(json: any | null): Observable<any> {
    return this.httpClient.post(this.add_URL, json);
  }
  /**
  * 添加角色
  * @param json 参数
  */
  public update(json: any | null): Observable<any> {
    return this.httpClient.post(this.UPDATE_URL, json);
  }
  /**
  * 查询角色列表
  * @param json 参数
  */
  public list(json: any | null): Observable<any> {
    json.name = json.name.trim();
    return this.httpClient.post(this.GET_URL, json);
  }
  /**
  * 角色详情
  * @param json 参数
  */
  public details(id: any): Observable<any> {
    const url = `${this.details_URL}${id}`;
    return this.httpClient.get(url);
  }
  /**
  * 权限列表
  * @param json 参数
  */
  public menuList(json: any | null): Observable<any> {
    return this.httpClient.post(this.menuList_URL, json);
  }
  /**
  * 查询角色权限
  * @param json 参数
  */
  public Permission(json: any | null): Observable<any> {
    return this.httpClient.post(this.Permission_URL, json);
  }
  /**
  * 设置角色权限
  * @param json 参数
  */
  public setPermission(json: any | null): Observable<any> {
    return this.httpClient.post(this.setPermission_URL, json);
  }
  
  
}
