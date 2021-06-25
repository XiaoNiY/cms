import { Injectable } from "@angular/core";
import { HttpClient, HttpParams } from "@angular/common/http";
import { Observable } from "rxjs";
@Injectable({
  providedIn: 'root'
})
export class LoginService {
  // 登录
  public URL = "/sys/user/login";
  constructor(public httpClient: HttpClient) { }
  /**
  * 登录
  * @param json 参数
  */
  public login(json: any | null): Observable<any> {
    return this.httpClient.post(this.URL, json);
  }
  /**
   * 菜单列表
   */
  public menuList_URL = "/sys/menu/menuQuery";

  /**
  * 查询菜单列表
  * @param json 参数
  */
  public menuList(): Observable<any> {
    return this.httpClient.post(this.menuList_URL, null);
  }
}
