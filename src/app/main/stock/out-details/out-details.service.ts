import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class OutDetailsService {
  /**
   * 出库单详情
   */
  public details_URL = "/deliveryDetails/list";

  constructor(public httpClient: HttpClient) { }
  /**
   * 出库单详情
   */
  public getDetails(id: any | null): Observable<any> {
    return this.httpClient.post(this.details_URL, { id: id });
  }
}
