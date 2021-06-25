import { Injectable } from "@angular/core";
import { HttpClient, HttpParams } from "@angular/common/http";
import { Observable } from "rxjs";
@Injectable({
  providedIn: 'root'
})
export class CustomerBasicsService {
  /**
   * 基本信息详情
   */
  public DETAILS_URL = "/customer/list";
  constructor(public httpClient: HttpClient) { }
  /**
   * 基本信息详情
   */
  public details(json: any | null): Observable<any> {
    return this.httpClient.post(this.DETAILS_URL, json);
  }

}
