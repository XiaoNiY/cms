import { Injectable } from "@angular/core";
import { HttpClient, HttpParams } from "@angular/common/http";
import { Observable } from "rxjs";
@Injectable({
  providedIn: 'root'
})
export class AppService {

  public RefreshCache_URL = "/cache/reload/";
  constructor(public httpClient: HttpClient) { }
  /**
   * 刷新缓存
   * @param json 参数
   */
  public refreshCache(id: any | null): Observable<any> {
    const url = `${this.RefreshCache_URL}${id}`;
    return this.httpClient.get(url);
  }
}
