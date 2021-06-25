import { Injectable } from "@angular/core";
import { HttpClient, HttpParams } from "@angular/common/http";
import { Observable } from "rxjs";
@Injectable({
  providedIn: 'root'
})
export class GoodsAllService {

  /**
   * 列表
   */
  public GET_URL = "/goods/list/page";
  /**
   * 删除
   */
  public DELETE_URL = "/goods/remove/";
  /**
   * 批量上下架
   */
  public onlineStatusBatch_URL = "/goods/update/onlineStatusBatch";
  /**
   * 商品分类下拉
   */
  public GOODSTYPE_URL = "/goodstypes/list/";
  /**
   * 复制
   */
  public COPY_URL = "/goods/copy/";

  constructor(public httpClient: HttpClient) { }

  /**
  * 商品列表
  * @param json 参数
  */
  public get(json: any | null): Observable<any> {
    let jsons = { ...json };
    jsons.name = jsons.name.trim();
    jsons.name = encodeURIComponent(jsons.name);
    if (jsons.nzFormat && jsons.nzFormat.length != 0 ) {
      jsons.createTimeStart = this.shiftDate(jsons.nzFormat[0]);
      jsons.createTimeEnd = this.shiftDate(jsons.nzFormat[1]);
      delete jsons.nzFormat;
    }
    return this.httpClient.get(this.GET_URL, { params: jsons });
  }
  /**
  * 删除类型
  * @param json 参数
  */
  public delete(id: any | null): Observable<any> {
    const url = `${this.DELETE_URL}${id}`;
    return this.httpClient.get(url);
  }
  /**
  * 复制
  * @param json 参数
  */
  public copy(id: any | null): Observable<any> {
    const url = `${this.COPY_URL}${id}`;
    return this.httpClient.get(url);
  }

  /**
  * 批量上下架
  * @param json 参数
  */
  public onlineStatusBatch(json: any | null): Observable<any> {
    return this.httpClient.get(this.onlineStatusBatch_URL, { params: json });
  }
  /**
   * 商品分类下拉
   */
  getGoodsTypeList(id: any = 1) {
    const url = `${this.GOODSTYPE_URL}${id}`;
    return this.httpClient.get(url);
  }
  /**
   * 时间格式转换 年月日
   * @param date 
   * @returns 
   */
  shiftDate(date: any) {
    let d = new Date(date)
    let str = d.getFullYear() + '-' + this.p((d.getMonth() + 1)) + '-' + this.p(d.getDate());
    return str;
  }
  /**
   * 补0
   * @param s 
   */
  p(s: any) {
    return s < 10 ? '0' + s : s
  }
}
