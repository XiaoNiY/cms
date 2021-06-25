import { Component, OnInit } from '@angular/core';
import { Router, ActivatedRoute } from '@angular/router';
import { NzNotificationService } from 'ng-zorro-antd/notification';
import { NzMessageService } from 'ng-zorro-antd/message';

import { GoodsTabsService } from './goods-tabs.service';
@Component({
  selector: 'app-goods-tabs',
  templateUrl: './goods-tabs.component.html',
  styleUrls: ['./goods-tabs.component.scss']
})
export class GoodsTabsComponent implements OnInit {
  loading = false;
  // 0：无效 1：已上架 2：未上架
  status: any = 2;
  // 是否显示骨架屏
  skeletonActive = true;
  // 服务器发生了错误。结果页
  resultError: any = false;
  // 是否可以上架 true:不可以上架 false:可以上架
  detailsData = true;

  // 详情id
  id: any = 0;
  tabArr = [
    {
      name: "基本信息", path: "goodsBasic", disabled: false
    },
    {
      name: "价格信息", path: "goodsPrice", disabled: true
    },
    {
      name: "详细信息", path: "goodsInfoB", disabled: true
    },
    {
      name: "图片信息", path: "goodsImg", disabled: true
    },
    {
      name: "商品参数", path: "goodsParam", disabled: true
    },
    {
      name: "库存信息", path: "goodsStock", disabled: true
    },
    // {
    //   name: "详细信息-b端", path: "goodsInfoC", disabled: true
    // },
    // {
    //   name: "商品规格", path: "goodsSpec", disabled: true
    // },
  ]
  constructor(
    private router: Router,
    private activatedRoute: ActivatedRoute,
    public GoodsTabsService: GoodsTabsService,
    private message: NzMessageService
  ) { }

  ngOnInit(): void {
    this.GoodsTabsService.updateFun = null;
    this.GoodsTabsService.updateDetails = null;
    // 子tabs通知更新数据
    this.GoodsTabsService.updateDetails = (id: any = null) => {
      if (id) {
        this.id = id;
      }
      this.getDetails(this.id);
    }
    this.activatedRoute.params.subscribe(params => {
      this.id = params.id;
      this.activatedRoute.snapshot.data['id'] = this.id
    });

    if (this.id != 0) {
      this.getDetails(this.id);
    } else {
      this.GoodsTabsService.detailsData = null;
      this.skeletonActive = false;
      this.resultError = false;
      this.toTabs("goodsBasic");
    }
  }
  resetTab() {
    for (let index = 1; index < this.tabArr.length; index++) {
      const element = this.tabArr[index];
      element.disabled = false;
    }
  }

  verify() {
    let text = ""
    this.detailsData = false;
    if (this.GoodsTabsService.detailsData.imgs == null) {
      this.detailsData = true;
      text = "不满足上架条件,图片信息不能为空";
    }
    if (this.GoodsTabsService.detailsData.introduction == null) {
      this.detailsData = true;
      text = "不满足上架条件,详细信息不能为空";
    }
    if (this.GoodsTabsService.detailsData.userType == 1 && this.GoodsTabsService.detailsData.shopPriceB == "") {
      this.detailsData = true;
      text = "不满足上架条件,B端售价不能为空";
    }
    if (this.GoodsTabsService.detailsData.userType == 2 && this.GoodsTabsService.detailsData.shopPriceC == "") {
      this.detailsData = true;
      text = "不满足上架条件,C端售价不能为空";
    }
    if (this.GoodsTabsService.detailsData.userType == 0 && this.GoodsTabsService.detailsData.shopPriceB == "" && this.GoodsTabsService.detailsData.shopPriceC == "") {
      this.detailsData = true;
      text = "不满足上架条件,B C端售价不能为空";
    }
    return text;
  }
  /**
   * 上下架
   * @returns 
   */
  clickSwitch(): void {
    if (this.id == 0) {
      return;
    }
    let text = this.verify();
    if (text != "") {
      return this.createMessage("warning", text);
    }
    this.detailsData = false;
    if (!this.loading && this.id != 0 && !this.resultError) {
      this.loading = true;
      let stat = this.status == 2 ? 1 : 2;

      this.GoodsTabsService.updateStatus({ ids: this.id, status: stat }).subscribe((res: any) => {
        this.loading = false;
        if (res.code != 0) {
          this.createMessage("error", res.message);
          return;
        }
        if (stat == 1) {
          this.createMessage("success", "商品已成功上架");
        } else {
          this.createMessage("success", "商品已成功下架");
        }
        this.getDetails(this.id);
      }, err => {
        this.loading = false;
        this.createMessage("error", err.message);
      });
    }
  }
  /**
   * 全局展示操作反馈信息
   * @param type 其他提示类型 success error warning
   */
  createMessage(type: any, str: any): void {
    this.message.create(type, str);
  }

  /**
   * 跳转tabs子路由
   * @param path 路由地址
   */
  toTabs(path: any) {
    console.log(!this.skeletonActive && !this.resultError);
    if (!this.skeletonActive && !this.resultError) {
      this.router.navigate([path], {
        relativeTo: this.activatedRoute,
        skipLocationChange: true
      });
    }
  }
  /**
   * 获取详情数据
   */
  getDetails(id: any) {
    this.GoodsTabsService.get(id).subscribe((res: any) => {
      this.skeletonActive = false;
      if (res.code == 0) {
        this.GoodsTabsService.detailsData = res.data;
        this.status = res.data.status;

        if (this.GoodsTabsService.detailsData.imgs == null ||
          this.GoodsTabsService.detailsData.goodsParam == null ||
          this.GoodsTabsService.detailsData.introductionB == null ||
          this.GoodsTabsService.detailsData.introductionC == null
        ) {
          this.detailsData = true;
        } else {
          this.detailsData = false;
        }
        this.resetTab();
        if (this.GoodsTabsService.updateFun) {
          this.GoodsTabsService.updateFun();
        } else {
          this.toTabs("goodsBasic");
        }
        this.verify();
      }
    }, err => {
      this.skeletonActive = false;
      this.resultError = true;
    });
  }

}
