import { Injectable } from '@angular/core';
import { HttpClient, HttpParams } from "@angular/common/http";
import { Observable } from "rxjs";
@Injectable({
  providedIn: 'root'
})
export class GoodsParamService {
  public UPDATE_URL = "/goods/update";

  constructor(public httpClient: HttpClient) { }
  /**
  * 更新
  */
  public update(json: any | null): Observable<any> {
    let jsons = { ...json };
    jsons.goodsParam = JSON.stringify(jsons.goodsParam);
    return this.httpClient.post(this.UPDATE_URL, jsons);
  }
}
