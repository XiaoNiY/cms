import { Component, OnInit } from '@angular/core';
import { Router, ActivatedRoute } from '@angular/router';
import { NzMessageService } from 'ng-zorro-antd/message';
import { SellDetailService } from './sell-detail.service';
@Component({
  selector: 'app-sell-detail',
  templateUrl: './sell-detail.component.html',
  styleUrls: ['./sell-detail.component.scss']
})
export class SellDetailComponent implements OnInit {
  /**
   * 优惠券Id
   */
  id: any = null;

  /**
   * 手动发放优惠券模态框
   */
  sendCouponsModal: boolean = false;
  /**
   * 用户列表
   */
  userListOption: {
    userList: Array<{ value: Number, label: string }>,
    isLoading: boolean
  } = {
      userList: [],
      isLoading: false,
    }
  /**
   * 已选择用户id
   */
  userSelectedValue = [];

  /**
   * 客户管理列表参数
   */
  siteParam = {
    id: "",
    //  用户
    user: '',
    // 账号状态
    status: '',
    //用户初始身份
    temUserType: '',
    //用户真实身份
    userType: '',
    // 开始时间
    beginTime: '',
    // 结束时间
    endTime: '',
    // 时间区间
    dateFormat: '',
    //0 表示userId查询 1表示id查询
    type: '0',
    page: 1,
    pageSize: 20,
  }
  /**
   * 详细数据
   */
  detailsData: any = null;
  // 列表数据
  listOfData?: any = null;
  /**
   * 全局 loading
   */
  messageId: any = null;
  stopVisible: any = false;
  showGoods = false;
  /**
   * 接口参数
   */
  entityParam: any = {
    "id": null,
    "goodsPageNum": 1,
    "goodsPageSize": 10,
    "couponUserRecordDTO": {
      "pageNum": 1,
      "pageSize": 10,
    },
    "couponGoodsUseRecordDTO": {
      "pageNum": 1,
      "pageSize": 10
    }
  };
  /**
   * 已选商品查询参数
   */
  selectGoodsParam = {
    "idList": [],
    "pageNum": 1,
    "pageSize": 10,
  }
  /**
   * 停止用券原因
   */
  stopContent: any = "";
  /**
   * 已选商品列表数据
   */
  selectGoodsTable: any = [];
  modalParam: any = {
    id: 0,
    selectGoodsArr: []
  };
  /**
   * 搜索加载
   */
  selectSearchLoading = false;
  selectSearchTime: any = null;
  /**
   * 用户优惠券 是否有待使用优惠券
   */
  stopUserCoupon: any = false;
  constructor(
    private message: NzMessageService,
    private activatedRoute: ActivatedRoute,
    private SellDetailService: SellDetailService,
  ) { }

  ngOnInit(): void {
    this.activatedRoute.params.subscribe(params => {
      this.id = params.id;
      this.entityParam.id = params.id;
    });
    this.details();
  }

  onSearch(value: string): void {
    clearTimeout(this.selectSearchTime);
    this.siteParam.id = value;
    if (this.siteParam.id) {
      this.selectSearchLoading = true;
      this.selectSearchTime = setTimeout(() => {

        this.siteParam.page = 1;
        this.siteParam.pageSize = 10;
        this.userListOption.userList = [];
        this.loadMore();
      }, 500);
    } else {
      this.loadMore();
    }
  }
  /**
   * 客户管理列表,下拉加载更多
   */
  loadMore(): void {
    this.userListOption.isLoading = true;
    this.SellDetailService.getUserList(this.siteParam).subscribe((res: any) => {
      this.userListOption.isLoading = false;
      this.selectSearchLoading = false;
      this.userListOption.userList = [...this.userListOption.userList, ...res.data.list.map((item: any) => {
        return {
          value: item.id,
          label: item.id
        };
      })];
      if (res.data.list.length != 0 && !this.siteParam.id) {
        this.siteParam.page++;
      }
    }, err => {
      this.createMessage("error", err.message);
    });
  }
  /**
   * 已选商品列表
   */
  selectGoodsList(ids: any) {
    if (this.messageId != null) {
      return;
    }
    this.selectGoodsParam.idList = ids;
    this.createBasicMessage();
    this.SellDetailService.selectGoodsList(this.selectGoodsParam).subscribe((res: any) => {
      this.removeBasicMessage();
      if (res.code != 0) {
        this.createMessage("error", res.message);
        return;
      }
      this.selectGoodsTable = res.data;
      this.showGoods = true;
    }, err => {
      this.removeBasicMessage();
      this.createMessage("error", err.message);
    });
  }
  /**
   * 打开模态框 已选择商品
   */
  showGoodsModal(ids: any = []) {
    this.modalParam.selectGoodsArr = ids;
    if (ids.length == 0) {
      return this.createMessage("warning", "没有已选商品");
    }
    this.selectGoodsList(ids);
  }

  /**
   * 页码改变
   * @param index 
   */
  onPageIndexChange_Select(index: number) {
    this.selectGoodsParam.pageNum = index;
    this.selectGoodsList(this.modalParam.selectGoodsArr);
  }
  /**
   * 每页条数改变的回调
   * @param index 
   */
  onPageSizeChange_Select(index: number) {
    this.selectGoodsParam.pageSize = index;
    this.selectGoodsList(this.modalParam.selectGoodsArr);
  }
  /**
   * 页码改变
   * @param index 
   */
  goods_onPageIndexChange(index: number) {
    console.log(index);
    this.entityParam.goodsPageNum = index;
    this.details();
  }
  /**
   * 每页条数改变的回调
   * @param index 
   */
  goods_onPageSizeChange(index: number) {
    console.log(index);
    this.entityParam.goodsPageSize = index;
    this.details();
  }
  /**
   * 页码改变
   * @param index 
   */
  user_onPageIndexChange(index: number) {
    console.log(index);
    this.entityParam.couponUserRecordDTO.pageNum = index;
    this.details();
  }
  /**
   * 每页条数改变的回调
   * @param index 
   */
  user_onPageSizeChange(index: number) {
    console.log(index);
    this.entityParam.couponUserRecordDTO.pageSize = index;
    this.details();
  }

  details() {
    this.SellDetailService.details(this.entityParam).subscribe((res: any) => {
      this.detailsData = res.data;
      // if (this.detailsData.applicableGoods.brandNames != "所有") {
      //   this.detailsData.applicableGoods.brandNames = this.detailsData.applicableGoods.brandNames.join(',');
      // }
      let stopArr = this.detailsData.couponUserRecordIPage.records.filter((item: any) => { return item.status == 1 });
      if (stopArr.length == 0) {
        this.stopUserCoupon = true;
      }
    }, err => {
      this.createMessage("error", err.message);
    });
  }
  /**
   * 停止用券
   */
  stopFun() {
    if (this.messageId != null) {
      return;
    }
    this.createBasicMessage();
    if (this.modalParam.id != 0) {
      this.SellDetailService.stop({ remark: this.stopContent, ids: [this.modalParam.id] }).subscribe((res: any) => {
        this.removeBasicMessage();
        if (res.code != 0) {
          this.createMessage("error", res.message);
          return;
        }
        this.createMessage("success", "停止成功");
        this.handleCancel();
        this.details();
      }, err => {
        this.removeBasicMessage();
        this.createMessage("error", err.message);
      });
    } else {
      let idArr = this.detailsData.couponUserRecordIPage.records.map((ele: any) => {
        return ele.id
      });
      this.SellDetailService.stop({ remark: this.stopContent, ids: idArr }).subscribe((res: any) => {
        this.removeBasicMessage();
        if (res.code != 0) {
          this.createMessage("error", res.message);
          return;
        }
        this.createMessage("success", "停止成功");
        this.details();
      }, err => {
        this.removeBasicMessage();
        this.createMessage("error", err.message);
      });
    }
  }

  /**
   * 保存手动发放优惠券
   */
  sendCoupons() {
    if (this.messageId != null) {
      return;
    }
    this.createBasicMessage();
    this.SellDetailService.sendCoupons({
      couponNo: this.detailsData.useCouponInfo.no,
      userIdList: this.userSelectedValue.map(Number)
    }).subscribe((res: any) => {
      this.removeBasicMessage();
      if (res.code != 0) {
        this.createMessage("error", res.message);
        return;
      }
      this.details();
      this.createMessage("success", "优惠券发放成功");
      this.handleCancel();
    }, err => {
      this.removeBasicMessage();
      this.createMessage("error", err.message);
    });
  }
  /**
   * 获取客户管理列表
   */
  // getUserList() {
  //   this.SellDetailService.getUserList().subscribe((res: any) => {
  //     this.userListOption = [];
  //     this.userListOption = res.data.list.map((item: any) => {
  //       return {
  //         value: item.id,
  //         label: item.id
  //       };
  //     });
  //     console.log(this.userListOption);
  //   }, err => {
  //     this.createMessage("error", err.message);
  //   });
  // }
  /**
   * 打开模态框(发放优惠券)
   */
  showCouponsModal() {
    this.siteParam.page = 1;
    this.siteParam.pageSize = 10;
    this.userListOption.userList = [];
    this.sendCouponsModal = true;
    this.loadMore();
  }
  /**
   * 打开模态框(手动关闭)
   * @param c 0:表格内手动关闭 1:订单关闭
   * @param index 表格id
   */
  showCloseModal(id: any = 0) {
    this.stopVisible = true;
    this.modalParam.id = id;

  }
  /**
   * 关闭模态框
   */
  handleCancel() {
    this.stopVisible = false
    this.showGoods = false;
    this.sendCouponsModal = false
    this.userSelectedValue = [];



    this.stopContent = "";
    this.selectGoodsParam = {
      "idList": [],
      "pageNum": 1,
      "pageSize": 10,
    }
  }
  /**
  * 状态转文字
  * @param status 
  */
  status_to_Text(status: any) {
    let text = "";
    switch (status) {
      case 1:
        text = "待使用";
        break;
      case 2:
        text = "售后中";
        break;
      case 3:
        text = "已过期";
        break;
      case 4:
        text = "已使用";
        break;
      case 5:
        text = "强制停止";
        break;
      default:
        text = "---";
        break;
    }
    return text;
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
   * @param type 其他提示类型 success:成功 error:失败 warning:警告
   */
  createMessage(type: any, str: any): void {
    this.message.create(type, str);
  }
}
