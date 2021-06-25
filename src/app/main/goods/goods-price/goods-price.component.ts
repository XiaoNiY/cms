import { Component, OnInit } from '@angular/core';
import { NzMessageService } from 'ng-zorro-antd/message';

import { GoodsTabsService } from '../goods-tabs/goods-tabs.service';
import { GoodsPriceService } from './goods-price.service';
@Component({
  selector: 'app-goods-price',
  templateUrl: './goods-price.component.html',
  styleUrls: ['./goods-price.component.scss']
})
export class GoodsPriceComponent implements OnInit {

  /**
   * 商品详情数据(公共)
   */
  detailsData: any = null;

  /**
   * 接口参数
   */
  entityParam: any = {
    id: null,
    // 更新类型
    updateType: 2,
    // C端单个售价
    shopPriceC: "",
    // C端-最小购买， 0-不限制
    buyMinC: "",
    // C端-最大购买， 0-不限制
    buyMaxC: "",
    // C端-商品原价 (划线价)
    originalPriceC: "",
    // B端-商品价格
    shopPriceB: "",
    // B端-建议零售价
    retailPriceB: "",
    // B端-商品原价 (划线价)
    originalPriceB: "",
    // B端-最小购买， 0-不限制
    buyMinB: "",
    // B端-最大购买， 0-不限制
    buyMaxB: ""
  }

  /**
   * 全局 loading
   */
  messageId: any = null;

  constructor(
    private message: NzMessageService,
    private GoodsTabsService: GoodsTabsService,
    private GoodsPriceService: GoodsPriceService,
  ) { }

  ngOnInit(): void {
    // 详情更新回调
    this.GoodsTabsService.updateFun = () => {
      this.initData();
    }
    this.initData();
  }
  initData() {
    this.detailsData = this.GoodsTabsService.detailsData;
    if (this.detailsData) {
      this.entityParam.id = this.detailsData.id;
      this.entityParam.shopPriceC = this.detailsData.shopPriceC;
      this.entityParam.buyMinC = this.detailsData.buyMinC == 0 ? 1 : this.detailsData.buyMinC;
      this.entityParam.buyMaxC = this.detailsData.buyMaxC;
      this.entityParam.originalPriceC = this.detailsData.originalPriceC;
      this.entityParam.shopPriceB = this.detailsData.shopPriceB;
      this.entityParam.retailPriceB = this.detailsData.retailPriceB;
      this.entityParam.originalPriceB = this.detailsData.originalPriceB;
      this.entityParam.buyMinB = this.detailsData.buyMinB == 0 ? 1 : this.detailsData.buyMinB;
      this.entityParam.buyMaxB = this.detailsData.buyMaxB
    }
  }

  submitForm(): void {
    if (!this.entityParam.shopPriceB && !this.entityParam.shopPriceC && this.detailsData.userType == 0) {
      return this.createMessage("warning", "B,C端价格单个售价不能为空");
    }
    if (!this.entityParam.shopPriceB && this.detailsData.userType == 1) {
      return this.createMessage("warning", "B端价格单个售价不能为空");
    }
    if (!this.entityParam.shopPriceC && this.detailsData.userType == 2) {
      return this.createMessage("warning", "C端价格单个售价不能为空");
    }
    if (this.entityParam.buyMinB > this.entityParam.buyMaxB && this.entityParam.buyMaxB != 0) {
      return this.createMessage("warning", "B端价格最小购买值不能大于最大购买值");
    }
    if (this.entityParam.buyMinC > this.entityParam.buyMaxC && this.entityParam.buyMaxC != 0) {
      return this.createMessage("warning", "C端价格最小购买值不能大于最大购买值");
    }
    if (this.messageId != null) {
      return;
    }
    this.createBasicMessage();
    this.GoodsPriceService.update(this.entityParam).subscribe((res: any) => {
      this.removeBasicMessage();
      if (res.code != 0) {
        this.createMessage("error", res.message);
        return;
      }
      this.createMessage("success", "保存成功");

      this.GoodsTabsService.updateDetails();
    }, err => {
      this.removeBasicMessage();
      this.createMessage("error", err.message);
    });

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
