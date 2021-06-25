import { Injectable } from "@angular/core";
import { HttpClient, HttpParams, HttpHeaders } from "@angular/common/http";
import { Observable } from "rxjs";
@Injectable({
  providedIn: 'root'
})
export class GoodsSpecService {
  public GET_URL = "/goodssku/list";
  public UPDATE_URL = "/goodssku/update";
  public ADD_URL = "/goodssku/add";
  // 属性分类下拉
  public GET_GOODSTYPE_URL = "/goodsattrtype/list";
  // 属性分类(获取参数列表)
  public GET_ATTRTYPE_URL = "/goodsattr/list/attrType/";
  // 添加参数下拉
  public GET_ATTRGOODS_URL = "/goodsattr/get/byGoods";
  //  全部保存
  public SAVEALL_URL = "/goodssku/update/batch";
  // 仓库下拉
  public WHGOODS_URL = "/whgoods/list";
  // 获取仓库信息
  public GET_WHGOODS_URL = "/whgoods/get/";
  // 阶梯相关接口
  public GET_MODAL_URL = "/skuladderprice/list";
  public ADD_MODAL_URL = "/skuladderprice/add";
  public UPDATE_MODAL_URL = "/skuladderprice/update";
  public DELETE_MODAL_URL = "/skuladderprice/remove/";
  // SKU属性聚合
  public GET_FACET_URL = "/goodssku/get/facet/";
  // 上库存
  public UPDATE_STOCKNUM_URL = "/goodssku/update/stocknum/";

  /**
   * 文件上传地址
   */
   public FILE_URL = "/common/upload/file";
  constructor(public httpClient: HttpClient) { }

  /**
  * 列表
  * @param json 参数
  */
  public get(json: any | null): Observable<any> {
    return this.httpClient.get(this.GET_URL, { params: json });
  }
  /**
  * 修改列表SKU
  * @param json 参数
  */
  public update(json: any | null): Observable<any> {
    let jsons: any = { ...json };
    jsons = this.formatObj(jsons);
    return this.httpClient.get(this.UPDATE_URL, { params: jsons });
  }
  /**
  * 添加列表SKU
  * @param json 参数
  */
  public add(json: any | null): Observable<any> {
    let jsons: any = { ...json };
    jsons = this.formatObj(jsons);
    return this.httpClient.post(this.ADD_URL, new HttpParams({ fromObject: jsons }));
  }
  /**
  * 添加阶梯价格
  * @param json 参数
  */
  public addModal(json: any | null): Observable<any> {
    return this.httpClient.get(this.ADD_MODAL_URL, { params: json });
  }
  /**
  * 阶梯价格列表
  * @param json 参数
  */
  public getModal(json: any | null): Observable<any> {
    return this.httpClient.get(this.GET_MODAL_URL, { params: json });
  }
  /**
  * 修改阶梯价格
  * @param json 参数
  */
  public UpdateModal(json: any | null): Observable<any> {
    return this.httpClient.get(this.UPDATE_MODAL_URL, { params: json });
  }
  /**
  * 删除阶梯价格
  * @param id 参数
  */
  public deleteModal(id: any | null): Observable<any> {
    const url = `${this.DELETE_MODAL_URL}${id}`;
    return this.httpClient.delete(url);
  }
  /**
  * 仓库下拉
  */
  public getWhgoods(): Observable<any> {
    return this.httpClient.get(this.WHGOODS_URL);
  }
  /**
  * 属性分类下拉
  */
  public getGoodsTypes(): Observable<any> {
    return this.httpClient.get(this.GET_GOODSTYPE_URL);
  }
  /**
  * 属性分类(获取参数列表)
  */
  public getAttrTypes(id: any | null): Observable<any> {
    const url = `${this.GET_ATTRTYPE_URL}${id}`;
    const json: any = {
      // 0 属性（SKU 规格） 1 参数
      type: 0
    }
    return this.httpClient.get(url, { params: json });
  }
  /**
  * 添加参数下拉
  */
  public getAttrGoods(json: any | null): Observable<any> {
    return this.httpClient.get(this.GET_ATTRGOODS_URL, { params: json });
  }
  /**
  * 全部保存
  */
  public saveAll(json: any | null): Observable<any> {
    let jsons: any = { ...json };
    for (const key in jsons.list) {
      let element = jsons.list[key];
      element = this.formatObj(element);
    }
    return this.httpClient.post(this.SAVEALL_URL, jsons);
  }
  /**
  * SKU属性聚合
  */
  public getFacet(id: any | null): Observable<any> {
    const json: any = {
      goodsId: id
    }
    return this.httpClient.get(this.GET_FACET_URL, { params: json });
  }
  /**
   * 上库存
   */
  public updateStocknum(json: any | null): Observable<any> {
    return this.httpClient.get(this.UPDATE_STOCKNUM_URL, { params: json });
  }
  /**
   * 获取仓库信息
   * @param json 
   */

  public getWhgoodsInfo(id: any | null): Observable<any> {
    const url = `${this.GET_WHGOODS_URL}${id}`;
    return this.httpClient.get(url);
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
    return obj;
  }
  /**
   * 上传文件
   * @param fileToUpload 
   * @returns 
   */
  public postFile(fileToUpload: File): Observable<any> {
    const formData: FormData = new FormData();
    formData.append('file', fileToUpload);
    return this.httpClient.post(this.FILE_URL, formData);
  }
}
