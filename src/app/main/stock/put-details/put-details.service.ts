import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class PutDetailsService {
  /**
   * 入库单详情
   */
  public details_URL = "/warehousingDetails/list";
  /**
   * 修改入库单
   */
  public update_URL = "/warehousing/update";
  /**
   * 入库单关闭(表格内)
   */
  public close_URL = "/warehousingDetails/close";

  constructor(public httpClient: HttpClient) { }
  /**
   * 入库单详情
   */
  public getDetails(id: any | null): Observable<any> {
    return this.httpClient.post(this.details_URL, { id: id });
  }
  /**
  * 修改采购单
  */
  public update(json: any | null) {
    return this.httpClient.post(this.update_URL, json);
  }

  /**
   * 手动关闭(表格内)
   */
  public closeList(json: any | null): Observable<any> {
    return this.httpClient.post(this.close_URL, json);
  }

}
