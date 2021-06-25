
import { HttpClient, HttpParams } from "@angular/common/http";
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class GoodsStockService {
  /**
   * 仓库商品查询
   */
  public GOODS_URL = "/whgoods/conditionQuery";
  /**
   * 根据商品id返回已关联的仓库商品列表
   */
  public GOODSID_URL = "/goods/relWhGoods/list/";


  public UPDATE_URL = "/goods/update";
  constructor(private httpClient: HttpClient) { }
  /**
  * 仓库商品列表
  */
  public getGoodsList(json: any | null): Observable<any> {
    return this.httpClient.post(this.GOODS_URL, json);
  }
  /**
  * 更新
  */
  public update(json: any | null): Observable<any> {
    let jsons = JSON.parse(JSON.stringify(json));
    for (let index = 0; index < jsons.whGoodsList.length; index++) {
      const element = jsons.whGoodsList[index];
      delete element.code;
      delete element.attr;
      delete element.name;
    }
    jsons.whGoodsList = JSON.stringify(jsons.whGoodsList);
    return this.httpClient.post(this.UPDATE_URL, jsons);
  }
  /**
   * 根据商品id返回已关联的仓库商品列表
   */
  getGoodsId(id: any) {
    const url = `${this.GOODSID_URL}${id}`;
    return this.httpClient.get(url);
  }
}
