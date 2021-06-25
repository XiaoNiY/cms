import { Injectable } from "@angular/core";
import { HttpClient, HttpParams } from "@angular/common/http";
import { Observable } from "rxjs";
@Injectable({
  providedIn: 'root'
})
export class GoodsSpecarrSaveService {

  /**
   * 商品列表
   */
  public goodsList_URL = "/goods/list/page";
  /**
   * 商品分类下拉
   */
  public GOODSTYPE_URL = "/goodstypes/list/";
  /**
   * 新增商品规格组
   */
  public ADD_URL = "/skugroup/add";
  /**
   * 修改商品规格组
   */
  public UPDATE_URL = "/skugroup/update";

  /**
   * 详情
   */
  public details_URL = "/skugroup/get/";

  /**
   * 商品更新
   */
  public GOODSUPDATE_URL = "/goods/update";
  /**
   * 上下架
   */
  public UPDATE_STATUS_URL = "/goods/update/onlineStatusBatch";
  /**
   * 文件上传地址
   */
  public FILE_URL = "/common/upload/file";
  constructor(public httpClient: HttpClient) { }

  /**
  * 详情
  */
  public details(id: any | null): Observable<any> {
    const url = `${this.details_URL}${id}`;
    return this.httpClient.get(url);
  }
  /**
  * 商品列表
  * @param json 参数
  */
  public getGoodsList(json: any | null): Observable<any> {
    return this.httpClient.get(this.goodsList_URL, { params: json });
  }
  /**
  * 上下架
  */
  public updateStatus(json: any | null): Observable<any> {
    return this.httpClient.get(this.UPDATE_STATUS_URL, { params: json });
  }

  /**
   * 商品分类下拉
   */
  getGoodsTypeList(id: any = 1) {
    const url = `${this.GOODSTYPE_URL}${id}`;
    return this.httpClient.get(url);
  }
  /**
  * 添加 or 修改
  * @param json 参数
  */
  public save(json: any | null): Observable<any> {
    let jsons = JSON.parse(JSON.stringify(json));
    for (let index = 0; index < jsons.properties.length; index++) {
      const element = jsons.properties[index];
      element.value = element.value.map((ele: any) => {
        return ele.key
      }).join(',');
      delete element.inputVisible;
    }
    jsons.properties = JSON.stringify(jsons.properties);
    jsons.delIds = jsons.delIds.toString();

    for (let index = 0; index < jsons.list.length; index++) {
      const element = jsons.list[index];

      if (!element.id) {
        delete element.id;
      }
      delete element.goods;
      delete element.selectUserTypeB;
      delete element.selectUserTypeC;
      delete element.disabled;
    }
    let url = this.ADD_URL;
    if (jsons.id != 0) {
      url = this.UPDATE_URL;
    } else {
      delete jsons.id;
    }
    return this.httpClient.post(url, jsons);
  }
  /**
  * 商品更新
  * @param json 参数
  */
  public goodsUpdate(json: any | null): Observable<any> {
    let jsons = { ...json };
    jsons.updateType = "6";

    if (jsons.selectUserTypeB && jsons.selectUserTypeC) {
      jsons.userType = 0;
    } else if (jsons.selectUserTypeB) {
      jsons.userType = 2;
    } else if (jsons.selectUserTypeC) {
      jsons.userType = 1;
    }

    jsons = this.formatObj(jsons);

    return this.httpClient.post(this.GOODSUPDATE_URL, jsons);
  }

  /**
   * 上传文件
   * @param fileToUpload 
   * @returns 
   */
  public postFile(fileToUpload: File): Observable<any> {
    const formData: FormData = new FormData();
    formData.append('file', fileToUpload);
    formData.append('name', "goods");
    return this.httpClient.post(this.FILE_URL, formData);
  }
  public formatObj(obj: any) {
    if (obj.warnSkuNum == null) {
      obj.warnSkuNum = 0;
    }
    if (obj.buyMaxB == null) {
      obj.buyMaxB = 0;
    }
    if (obj.buyMinB == null) {
      obj.buyMinB = 0;
    }
    if (obj.retailPriceB == null) {
      obj.retailPriceB = 0;
    }
    if (obj.originalPriceB == null) {
      obj.originalPriceB = 0;
    }
    if (obj.shopPriceB == null) {
      obj.shopPriceB = 0;
    }
    if (obj.buyMaxC == null) {
      obj.buyMaxC = 0;
    }
    if (obj.buyMinC == null) {
      obj.buyMinC = 0;
    }
    if (obj.originalPriceC == null) {
      obj.originalPriceC = 0;
    }
    if (obj.shopPriceC == null) {
      obj.shopPriceC = 0;
    }
    if (obj.stockNum == null) {
      obj.stockNum = 0;
    }
    return obj;
  }
}
