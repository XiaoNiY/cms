import { Injectable } from "@angular/core";
import { HttpClient, HttpParams } from "@angular/common/http";
import { Observable } from "rxjs";
@Injectable({
  providedIn: 'root'
})
export class GoodsPriceService {

  // 更新
  public UPDATE_URL = "/goods/update";
  constructor(public httpClient: HttpClient) { }

  /**
  * 更新
  * @param json 参数
  */
  public update(json: any | null): Observable<any> {
    return this.httpClient.post(this.UPDATE_URL, json);
  }

}
