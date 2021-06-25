import { Component, OnInit } from '@angular/core';
import { NzMessageService } from 'ng-zorro-antd/message';
import { SellCouponService } from './sell-coupon.service';
@Component({
  selector: 'app-sell-coupon',
  templateUrl: './sell-coupon.component.html',
  styleUrls: ['./sell-coupon.component.scss']
})
export class SellCouponComponent implements OnInit {
  /**
   * 手动发放优惠券模态框
   */
  sendCouponsModal: boolean = false;
  /**
   * 用户列表
   */
  // userListOption: Array<{ value: string; label: string }> = [];

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
   * 模态框参数
   */
  modalParam: any = {};
  /**
   * 表格全选按钮
   */
  checked = false;
  /**
   * 查询表格初始化
   */
  queryForm: any = {
    // 商品名称
    name: '',
    // 优惠券类型：1、满减卷  2、折扣卷 3、随机卷 全部:传空
    type: '',
    // status 状态：1、未开始 2、进行中 3、已结束 4、已停止 5 草稿 全部:传空
    status: '',
    // 第几页
    pageNum: '1',
    // 每页多少条
    pageSize: '20',
  };
  // 列表数据源
  listOfData?: any;
  // 表格是否加载中
  tableLoading: any = false;
  // 当前是否在搜索
  searchHint = false;
  // 当前搜索name
  searcName = "";
  /**
   * 全局 loading
   */
  messageId: any = null;
  /**
   * 搜索加载
   */
  selectSearchLoading = false;
  selectSearchTime: any = null;
  /**
   * 路由缓存恢复时
   */
  static updateCache: any = null;

  constructor(
    private message: NzMessageService,
    private SellCouponService: SellCouponService,
  ) { }

  ngOnInit(): void {
    SellCouponComponent.updateCache = () => {
      this.tableLoading = false;
      this.getList();
    }
    this.getList();

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
   * 查询
   */
  query(): void {
    if (this.queryForm.name != "") {
      this.searchHint = true;
    } else {
      this.searchHint = false;
    }
    this.getList();
  }

  /**
   * 打开模态框
   */
  showCloseModal(obj: object) {
    this.modalParam = obj;
    this.siteParam.page = 1;
    this.siteParam.pageSize = 10;
    this.userListOption.userList = [];
    this.sendCouponsModal = true;
    this.loadMore();
  }
  /**
   * 关闭模态框
   */
  handleCancel() {
    this.sendCouponsModal = false
    this.userSelectedValue = [];
  }

  /**
   * 搜索返回原列表
   */
  backList() {
    this.queryForm.name = "";
    this.queryForm.pageNum = 1;
    this.searchHint = false;
    this.getList();
  }
  /**
   * item单选
   * @param id 
   * @param checked 
   */
  onItemChecked(id: number, checked: boolean): void {
    console.log("id:" + id + ",checked:" + checked);
  }
  /**
   * 全选
   * @param value 
   */
  onAllChecked(value: boolean): void {
    this.listOfData.records.forEach((item: { Checked: boolean; }) => item.Checked = value);
    console.log(value);
  }
  /**
   * 页码改变
   * @param index 
   */
  onPageIndexChange(index: number) {
    console.log(index);
    this.queryForm.pageNum = index;
    this.getList();
  }
  /**
   * 每页条数改变的回调
   * @param index 
   */
  onPageSizeChange(index: number) {
    console.log(index);
    this.queryForm.pageSize = index;
    this.getList();
  }
  confirm(id: any) {
    this.delete(id);
  }
  toEdit(id: any) {

  }
  delete(id: any) {
    this.SellCouponService.delete(id).subscribe((res: any) => {
      if (res.code != 0) {
        this.createMessage("error", res.message);
        return;
      }
      this.getList();
    }, err => {
    });
  }
  /**
   * 获取优惠券列表
   */
  getList() {
    if (this.tableLoading) { return; }
    this.listOfData = [];
    this.tableLoading = true;
    this.SellCouponService.getList(this.queryForm).subscribe((res: any) => {
      if (res.code != 0) {
        this.createMessage("error", res.message);
        return;
      }
      this.listOfData = res.data;
      this.searcName = this.queryForm.name;
      for (let index = 0; index < this.listOfData.records.length; index++) {
        const element = this.listOfData.records[index];
        element.statusText = this.status_To_text(element.status);
        element.Checked = false;
      }
      this.tableLoading = false;
    }, err => {
      this.tableLoading = false;
      this.createMessage("error", err.message);
    });
  }
  /**
   * 保存手动发放优惠券
   */
  sendCoupons() {
    if (this.messageId != null) {
      return;
    }
    this.createBasicMessage();
    this.SellCouponService.sendCoupons({
      couponNo: this.modalParam.no,
      userIdList: this.userSelectedValue.map(Number)
    }).subscribe((res: any) => {
      this.removeBasicMessage();
      if (res.code != 0) {
        this.createMessage("error", res.message);
        return;
      }
      this.createMessage("success", "优惠券发放成功");
      this.handleCancel();
    }, err => {
      this.removeBasicMessage();
      this.createMessage("error", err.message);
    });
  }
  /**
   * 客户管理列表,下拉加载更多
   */
  loadMore(): void {
    this.userListOption.isLoading = true;
    this.SellCouponService.getUserList(this.siteParam).subscribe((res: any) => {
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
   * 停止优惠券
   */
  stop(id: any) {
    if (this.messageId != null) {
      return;
    }
    this.createBasicMessage();
    this.SellCouponService.stop(id).subscribe((res: any) => {
      this.removeBasicMessage();
      if (res.code != 0) {
        this.createMessage("error", res.message);
        return;
      }
      this.createMessage("success", "优惠券已停止");
      this.getList();
    }, err => {
      this.removeBasicMessage();
      this.createMessage("error", err.message);
    });
  }
  /**
   * 刷新列表
   */
  refresh() {
    this.listOfData = [];
    this.getList();
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
  /**
   * 状态转文字
   * @param status 
   */
  status_To_text(status: any) {
    let text = "";
    switch (status) {
      case 1:
        text = "未开始";
        break;
      case 2:
        text = "进行中";
        break;
      case 3:
        text = "已结束";
        break;
      case 4:
        text = "已停止";
        break;
      case 5:
        text = "草稿";
        break;
      default:
        text = "---";
        break;
    }
    return text;
  }
}
