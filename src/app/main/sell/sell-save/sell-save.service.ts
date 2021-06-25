import { Injectable } from "@angular/core";
import { HttpClient, HttpParams } from "@angular/common/http";
import { Observable } from "rxjs";
@Injectable({
  providedIn: 'root'
})
export class SellSaveService {

  // 根据请求状态不同来区分功能
  public coupon_URL = "/coupon/";
  // 优惠劵详情
  public GET_URL = "/coupon/detail/";
  // 查询所有商品类型和品牌
  public goodsType_URL = "/coupon/goodsTypeAndBrand";
  // 已选商品详情
  public selectGoods_URL = "/goods/getGoodsByIdList";


  constructor(public httpClient: HttpClient) { }

  /**
  * 已选商品详情
  * @param json 参数
  */
  public selectGoodsList(json: any | null): Observable<any> {
    return this.httpClient.post(this.selectGoods_URL, json);
  }
  /**
  * 添加
  * @param json 参数
  */
  public add(json: any | null): Observable<any> {
    let jsons: any = { ...json };
    jsons = this.formatObj(jsons);
    return this.httpClient.post(this.coupon_URL, jsons);
  }
  /**
   * 优惠券详情
   * @param json 参数
   */
  public get(id: any): Observable<any> {
    const url = `${this.GET_URL}${id}`;
    return this.httpClient.get(url);
  }
  /**
   * 更新优惠券
   * @param json 参数
   */
  public update(id: any, json: any): Observable<any> {
    const url = `${this.coupon_URL}${id}`;
    let jsons: any = { ...json };
    jsons = this.formatObj(jsons);
    return this.httpClient.put(url, jsons);
  }
  /**
   * 获取适用分类 or 适用品牌
   */
  public getType(): Observable<any> {
    return this.httpClient.get(this.goodsType_URL);
  }
  public formatObj(obj: any) {
    // 已选择指定分类
    let goodsTypesList: any = obj.goodsTypesList.filter(function (item: { checked: boolean; }) { return item.checked == true; }).map((ele: any) => {
      return ele.value
    });
    // 已选择指定品牌
    let brandList: any = obj.brandList.filter(function (item: { checked: boolean; }) { return item.checked == true; }).map((ele: any) => {
      return ele.value
    });
    // 指定分类 or 指定品牌 or 追加可用商品 or 排除可用商品,过滤器 详情看接口文档......
    obj.goodsFilter = {
      '1': {
      },
      '2': {
      },
      '3': {
      },
      '4': {
      }
    }
    // 指定分类
    if (obj.classSelect) {
      obj.goodsFilter['1']['0'] = [];
    } else if (obj.classNoSelect) {
      obj.goodsFilter['1']['-1'] = [];
    } else if (obj.goodsTypesList.length != 0) {
      obj.goodsFilter['1']['1'] = goodsTypesList;
    }

    if (obj.brandSelect) {
      obj.goodsFilter['2']['0'] = [];
    } else if (obj.brandNoSelect) {
      obj.goodsFilter['2']['-1'] = [];
    } else if (obj.brandList.length != 0) {
      obj.goodsFilter['2']['1'] = brandList;
    }

    // 追加可用商品
    let assignGoodsArr: any = obj.modalParam.assignGoodsArr.map((ele: any) => {
      return ele.id
    });

    // 排除可用商品
    let excludeGoodsArr: any = obj.modalParam.excludeGoodsArr.map((ele: any) => {
      return ele.id
    });
    if (assignGoodsArr.length != 0) {
      obj.goodsFilter['3']['1'] = assignGoodsArr;
    } else {
      obj.goodsFilter['3']['0'] = [];
    }

    if (excludeGoodsArr.length != 0) {
      obj.goodsFilter['4']['1'] = excludeGoodsArr;
    } else {
      obj.goodsFilter['4']['0'] = [];
    }

    let useTime = obj.useTime;
    let getTime = obj.getTime;
    for (let index = 0; index < useTime.length; index++) {
      const element = useTime[index];
      let d = new Date(element)
      let str = d.getFullYear() + '-' + this.p((d.getMonth() + 1)) + '-' + this.p(d.getDate()) + ' ' + this.p(d.getHours()) + ':' + this.p(d.getMinutes());
      if (index == 0) {
        obj.useBeginTime = str + ':00';
      } else {
        obj.useEndTime = str + ':59';
      }
    }
    for (let index = 0; index < getTime.length; index++) {
      const element = getTime[index];
      let d = new Date(element)
      let str = d.getFullYear() + '-' + this.p((d.getMonth() + 1)) + '-' + this.p(d.getDate()) + ' ' + this.p(d.getHours()) + ':' + this.p(d.getMinutes());
      if (index == 0) {
        obj.getBeginTime = str + ':00';
      } else {
        obj.getEndTime = str + ':59';
      }
    }

    // 转换整形
    obj.orderLimitMoney = parseFloat(obj.orderLimitMoney);
    obj.limitBig = ~~obj.limitBig;
    obj.limitSmall = ~~obj.limitSmall;
    obj.userLimitNum = ~~obj.userLimitNum;
    obj.limitTimeNum = ~~obj.limitTimeNum;
    obj.type = ~~obj.type;
    obj.isShowWeb = ~~obj.isShowWeb;
    obj.applyGoods = ~~obj.applyGoods;
    obj.autoReverse = ~~obj.autoReverse;
    obj.userType = ~~obj.userType;
    obj.remind = ~~obj.remind;
    obj.total = ~~obj.total;

    if (obj.limitTimeNumGroup == 1) {
      delete obj.useBeginTime;
      delete obj.useEndTime;
    } else {
      obj.limitTimeNum = -1;
    }
    delete obj.id;
    delete obj.getTime;
    delete obj.useTime;
    delete obj.brandList;
    delete obj.goodsTypesList;
    delete obj.remindGroup;
    delete obj.userLimitNumGroup;
    delete obj.orderLimitMoneyGroup;
    delete obj.autoReverseGroup;
    delete obj.limitTimeNumGroup;
    delete obj.allCheckedA;
    delete obj.allCheckedB;
    delete obj.GoodsArr;
    delete obj.modalParam;

    return obj;
  }
  /**
   * 补0
   * @param s 
   */
  p(s: any) {
    return s < 10 ? '0' + s : s
  }
}
