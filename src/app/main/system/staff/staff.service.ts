import { Injectable } from "@angular/core";
import { HttpClient, HttpParams } from "@angular/common/http";
import { Observable } from "rxjs";

@Injectable({
  providedIn: 'root'
})
export class StaffService {
  /**
   * 员工列表
   */
  public GET_URL = "/sys/user/query";
  /**
   * 角色列表
   */
  public role_URL = "/sys/role/roleQuery";
  /**
   * 保存员工
   */
  public save_URL = "/sys/user/save";
  /**
   * 删除员工
   */
  public delete_URL = "/sys/user/remove";
  /**
   * 重置密码
   */
  public resetPwd_URL = "/sys/user/originalPwd";
  /**
   * 员工详情
   */
  public details_URL = "/sys/user/details/";
  /**
   * 员工修改
   */
  public update_URL = "/sys/user/modify";

  constructor(public httpClient: HttpClient) { }
  /**
  * 查询员工列表
  * @param json 参数
  */
  public list(json: any | null): Observable<any> {
    let jsons: any = { ...json };
    delete jsons.inputVal;
    delete jsons.userNameSelect;
    return this.httpClient.post(this.GET_URL, jsons);
  }
  /**
  * 查询角色列表
  * @param json 参数
  */
  public getRoleList(json: any | null): Observable<any> {
    return this.httpClient.post(this.role_URL, json);
  }
  /**
  * 保存员工
  * @param json 参数
  */
  public save(json: any | null): Observable<any> {
    let jsons: any = { ...json };
    jsons.roleId = jsons.roleList.filter(function (item: { checked: boolean; }) { return item.checked == true; }).map((ele: any) => {
      return ele.value
    }).join(',');
    delete jsons.id;
    return this.httpClient.post(this.save_URL, jsons);
  }
  /**
  * 删除员工
  * @param json 参数
  */
  public delete(json: any | null): Observable<any> {
    return this.httpClient.post(this.delete_URL, json);
  }
  /**
  * 重置密码
  * @param json 参数
  */
  public resetPwd(json: any | null): Observable<any> {
    return this.httpClient.post(this.resetPwd_URL, json);
  }
  /**
  * 员工详情
  * @param json 参数
  */
  public details(id: any | null): Observable<any> {
    const url = `${this.details_URL}${id}`;
    return this.httpClient.get(url);
  }
  /**
  * 员工修改
  * @param json 参数
  */
  public update(json: any | null): Observable<any> {
    let jsons: any = { ...json };
    jsons.roleId = jsons.roleList.filter(function (item: { checked: boolean; }) { return item.checked == true; }).map((ele: any) => {
      return ele.value
    }).join(',');
    delete jsons.accountNumber;
    return this.httpClient.post(this.update_URL, jsons);
  }
}
