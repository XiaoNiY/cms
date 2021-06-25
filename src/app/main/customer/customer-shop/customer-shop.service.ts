import { Injectable } from "@angular/core";
import { HttpClient, HttpParams } from "@angular/common/http";
import { Observable } from "rxjs";
@Injectable({
  providedIn: 'root'
})
export class CustomerShopService {
  /**
   * 门店详情
   */
  public DETAILS_URL = "/customer/storeList";
  /**
   * 门店信息审核 
   */
  public AUDIT_URL = "/customer/update";

  
  constructor(public httpClient: HttpClient) { }
  /**
   * 门店详情
   */
  public details(json: any | null): Observable<any> {
    return this.httpClient.post(this.DETAILS_URL, json);
  }
  /**
   * 门店信息审核
   */
  public audit(json: any | null): Observable<any> {
    return this.httpClient.post(this.AUDIT_URL, json);
  }

}
