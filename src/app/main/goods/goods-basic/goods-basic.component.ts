import { Component, OnInit } from '@angular/core';
import { NzMessageService } from 'ng-zorro-antd/message';
import { forkJoin } from 'rxjs';

import { GoodsBasicService } from './goods-basic.service';
import { GoodsTabsService } from '../goods-tabs/goods-tabs.service';
import { ConfigDictListService } from '../../config/config-dict-list/config-dict-list.service';
@Component({
  selector: 'app-goods-basic',
  templateUrl: './goods-basic.component.html',
  styleUrls: ['./goods-basic.component.scss']
})
export class GoodsBasicComponent implements OnInit {
  /**
   * 商品详情数据(公共)
   */
  detailsData: any = null;
  // validateForm!: FormGroup;
  /**
   * 商品分类下拉
   */
  GoodsTypeList: any = null;
  /**
   * 通用说明下拉
   */
  PublicList: any = null;
  /**
   * 品牌下拉
   */
  BrandList: any = null;

  /**
   * 商品属性
   */
  goodsArr: any = [
    { label: '特价', value: '特价', checked: true },
    { label: '批发', value: '批发', checked: false },
    { label: '外配', value: '外配', checked: false },
    { label: '内配', value: '内配', checked: false },
    { label: '新机', value: '新机', checked: false },
    { label: '整机', value: '整机', checked: false },
    { label: '二手机', value: '二手机', checked: false },
    { label: '官翻机', value: '官翻机', checked: false },
  ];
  /**
   * 服务承诺
   */
  PromiseArr: any = []
  /**
   * 接口参数
   */
  entityParam: any = {
    id: null,
    // 商品名称
    name: '',
    // 短名称
    shortName: '',
    // 副标题
    slogan: '',
    // 商品分类
    typeId: '',
    // 标签（多个使用 , 号分割）
    labels: '',
    // 品牌ID
    brandId: '',
    // 搜索关键字
    keyword: '',
    // 商品属性 , 号分割
    properties: [],
    // 服务承诺, 号分割
    mallService: [],
    // 销量基数
    salesVolumeBase: 1,
    // 顶部说明
    topNoteldB: '',
    // 通用说明 B端  选择ID
    publicNoteldB: '',
    // 通用说明 C端  选择ID
    publicNoteldC: '',
    // // 购买倍数 B端 0 没有限制
    // buyMulB: '1',
    // 最小购买 B端 0 没有限制
    // buyMinB: '1',
    // 最大购买 B端 0 没有限制
    // buyMaxB: '1',
    // 商家ID
    // businessId: '',
    // 适用用户( 0 通用 1 C端 2 B端 )
    userType: '0',
    // B端商户
    selectUserTypeB: true,
    // C端用户
    selectUserTypeC: true,
  }
  /**
   * 全局 loading
   */
  messageId: any = null;
  constructor(
    private ConfigDictListService: ConfigDictListService,
    private GoodsTabsService: GoodsTabsService,
    private GoodsBasicService: GoodsBasicService,
    private message: NzMessageService,
  ) { }

  ngOnInit(): void {
    this.GoodsTabsService.updateFun = () => {
      this.initData();
    }
    this.initHttp();
  }
  /**
   * 初始化http请求
   */
  initHttp() {
    // 并联请求
    let postArr = [];
    // 获取字典的服务承诺
    postArr.push(this.ConfigDictListService.getDictList({
      // 名称或者编码搜索
      parentKey: "service_promise",
      // 多少页，默认1
      pageNum: 1,
      // 每页多少条，默认10
      pageSize: 999
    }).pipe((data) => {
      return data;
    }));
    // 获取字典的商品属性
    postArr.push(this.ConfigDictListService.getDictList({
      // 名称或者编码搜索
      parentKey: "GOODS_ATTR",
      // 多少页，默认1
      pageNum: 1,
      // 每页多少条，默认10
      pageSize: 999
    }).pipe((data) => {
      return data;
    }));
    // 品牌分类下拉
    postArr.push(this.GoodsBasicService.getBrandList().pipe((data) => {
      return data;
    }));
    // 通用说明下拉
    postArr.push(this.GoodsBasicService.getPublicList().pipe((data) => {
      return data;
    }));
    // 商品分类下拉
    postArr.push(this.GoodsBasicService.getGoodsTypeList().pipe((data) => {
      return data;
    }));

    forkJoin(postArr)
      .subscribe((data: any) => {
        // 服务承诺
        let DictLis1 = data[0];
        // 商品属性
        let DictLis2 = data[1];

        // 品牌分类下拉
        let dropdown1 = data[2];
        // 通用说明下拉
        let dropdown2 = data[3];
        // 商品分类下拉
        let dropdown3 = data[4];

        // 服务承诺转换格式
        for (const key in DictLis1.data.list.records) {
          const element = DictLis1.data.list.records[key];
          this.entityParam.mallService.push({
            label: element.name,
            value: element.id,
            checked: false
          });
        }
        // 商品属性转换格式
        for (const key in DictLis2.data.list.records) {
          const element = DictLis2.data.list.records[key];
          this.entityParam.properties.push({
            label: element.name,
            value: element.id,
            checked: false
          });
        }

        this.BrandList = dropdown1.data;
        this.PublicList = dropdown2.data;
        this.GoodsTypeList = dropdown3.data;

        this.initData();
      }, err => {
      });

  }
  /**
   * 初始化数据
   */
  initData() {
    this.detailsData = this.GoodsTabsService.detailsData;
    if (this.detailsData) {
      this.entityParam.id = this.detailsData.id;
      this.entityParam.name = this.detailsData.name;
      this.entityParam.shortName = this.detailsData.shortName;
      this.entityParam.slogan = this.detailsData.slogan;
      this.entityParam.typeId = this.detailsData.typeId;
      this.entityParam.labels = this.detailsData.labels;
      this.entityParam.brandId = this.detailsData.brandId;
      this.entityParam.keyword = this.detailsData.keyword;

      this.entityParam.salesVolumeBase = this.detailsData.salesVolumeBase;

      this.entityParam.topNoteldB = this.detailsData.topNoteldB;
      this.entityParam.publicNoteldB = this.detailsData.publicNoteldB;
      this.entityParam.publicNoteldC = this.detailsData.publicNoteldC;

      if (this.detailsData.userType == 0) {
        this.entityParam.selectUserTypeB = true;
        this.entityParam.selectUserTypeC = true;
      } else if (this.detailsData.userType == 1) {
        this.entityParam.selectUserTypeB = false;
        this.entityParam.selectUserTypeC = true;
      } else if (this.detailsData.userType == 2) {
        this.entityParam.selectUserTypeB = true;
        this.entityParam.selectUserTypeC = false;
      }
      // this.entityParam.properties = this.detailsData.properties ? this.detailsData.properties.split(',') : [];

      // 商品属性
      let propertiesArr = this.detailsData.properties ? this.detailsData.properties.split(',') : [];
      for (let index = 0; index < propertiesArr.length; index++) {
        const element = propertiesArr[index];
        const itemIndex = this.entityParam.properties.findIndex(function (item: any) { return item.label == element; });
        itemIndex != -1 ? this.entityParam.properties[itemIndex].checked = true : null;
      }
      // 服务承诺
      let mallServiceArr = this.detailsData.mallService ? this.detailsData.mallService.split(',') : [];
      for (let index = 0; index < mallServiceArr.length; index++) {
        const element = mallServiceArr[index];
        const itemIndex = this.entityParam.mallService.findIndex(function (item: any) { return item.value == element; });
        itemIndex != -1 ? this.entityParam.mallService[itemIndex].checked = true : null;
      }
    }
  }
  submitForm(): void {
    if (!this.entityParam.name) {
      return this.createMessage("warning", "请输入商品名称");
    }
    if (!this.entityParam.shortName) {
      return this.createMessage("warning", "请输入短名称");
    }
    if (!this.entityParam.typeId) {
      return this.createMessage("warning", "请选择商品分类");
    }
    if (!this.entityParam.brandId) {
      return this.createMessage("warning", "请选择品牌");
    }
    if (!this.entityParam.selectUserTypeB && !this.entityParam.selectUserTypeC) {
      return this.createMessage("warning", "请选择适用用户");
    }
    if (this.messageId != null) {
      return;
    }

    this.createBasicMessage();
    if (this.entityParam.id == null) {
      this.GoodsBasicService.add(this.entityParam).subscribe((res: any) => {
        this.removeBasicMessage();
        if (res.code != 0) {
          this.createMessage("error", res.message);
          return;
        }
        this.createMessage("success", "保存成功");
        this.GoodsTabsService.updateDetails(res.data);
        // this.router.navigate(['home/goods/goodsAll']);
      }, err => {
        this.removeBasicMessage();
        this.createMessage("error", err.message);
      });
    } else {
      this.GoodsBasicService.update(this.entityParam).subscribe((res: any) => {
        this.removeBasicMessage();
        if (res.code != 0) {
          this.createMessage("error", res.message);
          return;
        }
        this.createMessage("success", "保存成功");

        this.GoodsTabsService.updateDetails();
        // this.router.navigate(['home/goods/goodsAll']);
      }, err => {
        this.removeBasicMessage();
        this.createMessage("error", err.message);
      });
    }
  }

  /**
   * 开启loading
   */
  createBasicMessage(): void {
    this.messageId = this.message.loading('正在请求...', { nzDuration: 0 }).messageId;
  }
  /**
   * 移除loading
   */
  removeBasicMessage() {
    this.message.remove(this.messageId);
    this.messageId = null;
  }
  /**
   * 全局展示操作反馈信息
   * @param type 其他提示类型 success:成功 error:失败 warning：警告
   */
  createMessage(type: any, str: any): void {
    this.message.create(type, str);
  }
}
