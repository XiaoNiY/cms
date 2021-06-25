import { Injectable } from "@angular/core";
import { HttpClient, HttpParams } from "@angular/common/http";
import { Observable } from "rxjs";
@Injectable({
  providedIn: 'root'
})
export class GoodsBasicService {

  public ADD_URL = "/goods/add";
  // 更新
  public UPDATE_URL = "/goods/update";
  // 通用说明下拉
  public PUBLICLIST_URL = "/goodspublicnote/list";
  // 商品分类下拉
  public GOODSTYPE_URL = "/goodstypes/list/";
  // 品牌下拉
  public BRANDLIST_URL = "/brand/list";

  constructor(public httpClient: HttpClient) { }
  /**
  * 添加
  * @param json 参数
  */
  public add(json: any | null): Observable<any> {
    let jsons = { ...json };
    if (jsons.selectUserTypeB && jsons.selectUserTypeC) {
      jsons.userType = 0;
    } else if (jsons.selectUserTypeB) {
      jsons.userType = 2;
    } else if (jsons.selectUserTypeC) {
      jsons.userType = 1;
    }


    if (jsons.topNoteldB == null || jsons.topNoteldB == "") {
      jsons.topNoteldB = 0;
    }
    if (jsons.publicNoteldB == null || jsons.publicNoteldB == "") {
      jsons.publicNoteldB = 0;
    }
    if (jsons.publicNoteldC == null || jsons.publicNoteldC == "") {
      jsons.publicNoteldC = 0;
    }
    jsons.properties = jsons.properties.filter(function (item: { checked: boolean; }) { return item.checked == true; }).map((ele: any) => {
      return ele.label
    }).join(',');

    jsons.mallService = jsons.mallService.filter(function (item: { checked: boolean; }) { return item.checked == true; }).map((ele: any) => {
      return ele.value
    }).join(',');

    delete jsons.id;
    delete jsons.selectUserTypeB;
    delete jsons.selectUserTypeC;
    return this.httpClient.post(this.ADD_URL, jsons);
  }
  /**
  * 更新
  * @param json 参数
  */
  public update(json: any | null): Observable<any> {
    let jsons = { ...json };
    jsons.properties = jsons.properties.filter(function (item: { checked: boolean; }) { return item.checked == true; }).map((ele: any) => {
      return ele.label
    }).join(',');

    jsons.mallService = jsons.mallService.filter(function (item: { checked: boolean; }) { return item.checked == true; }).map((ele: any) => {
      return ele.value
    }).join(',');

    if (jsons.selectUserTypeB && jsons.selectUserTypeC) {
      jsons.userType = 0;
    } else if (jsons.selectUserTypeB) {
      jsons.userType = 2;
    } else if (jsons.selectUserTypeC) {
      jsons.userType = 1;
    }
    if (jsons.topNoteldB == null || jsons.topNoteldB == "") {
      jsons.topNoteldB = 0;
    }
    if (jsons.publicNoteldB == null || jsons.publicNoteldB == "") {
      jsons.publicNoteldB = 0;
    }
    if (jsons.publicNoteldC == null || jsons.publicNoteldC == "") {
      jsons.publicNoteldC = 0;
    }
    jsons.updateType = 1;
    delete jsons.selectUserTypeB;
    delete jsons.selectUserTypeC;
    return this.httpClient.post(this.UPDATE_URL, jsons);
  }
  /**
   * 通用说明下拉
   */
  getPublicList() {
    return this.httpClient.get(this.PUBLICLIST_URL);
  }
  /**
   * 商品分类下拉
   */
  getGoodsTypeList(id: any = 1) {
    const url = `${this.GOODSTYPE_URL}${id}`;
    return this.httpClient.get(url);
  }
  /**
   * 品牌分类下拉
   */
  getBrandList() {
    return this.httpClient.get(this.BRANDLIST_URL);
  }
}
