import { Component, OnInit } from '@angular/core';
import { FormBuilder } from '@angular/forms';
import { NzMessageService } from 'ng-zorro-antd/message';
import { Router } from '@angular/router';

import { OrderAccService } from './order-acc.service';
@Component({
  selector: 'app-order-acc',
  templateUrl: './order-acc.component.html',
  styleUrls: ['./order-acc.component.scss']
})
export class OrderAccComponent implements OnInit {

  /**
   * 跟进模态框
   */
  followVisible: boolean = false;
  /**
   * 跟进内容
   */
  followList: any = [];
  /**
   * 查询参数
   */
  queryForm = {
    // 商品名称
    goodsName: '',
    // 订单编号
    orderNum: '',
    // 订单状态(暂定这几个后面会加) 0：有效1：无效2：待付款3：待发货4：已发货 5已收货 6已取消
    orderState: '',
    // 付款状态 (0、未付款 1、已付款 2、部分退款 3、全部退款)
    paymentState: '',
    // 售后状态 0：待审核，1：审核通过，2：审核未通过，3：已取消，4：已返款
    afterState: '',

    // 时间区间
    dateFormat: '',
    // 下单开始时间
    orderBeginTime: '',
    // 下单结束时间
    orderEndTime: '',
    // 付款开始时间
    paymentBeginTime: '',
    // 付款结束时间
    paymentEndTime: '',

    // 用户类型：1-C端用户、2-B端商户
    userType: '',
    // 页数
    page: 1,
    // 条数
    pageSize: 20,
  };
  /**
   * 跟进参数
   */
  followParam: any = {
    // 关联信息(订单号 售后单号 客户id 出库单号)
    relationInformation: "",
    // 1、订单 2、售后 3、客户 4、出库
    type: 1,
    // 文件列表
    enclosure: [],
    // 备注
    content: "",
  }
  /**
   * 列表数据
   */
  listOfData?: any;

  /**
   * 当前是否在搜索
   */
  searchHint = false;
  /**
   * 表格是否加载中
   */
  tableLoading: any = false;
  /**
   * 当前搜索name
   */
  searcName = "";
  /**
   * 是否全选
   */
  checked = false;
  /**
   * 审核意见
   */
  auditDesc = "";
  /**
   * 全局 loading
   */
  messageId: any = null;
  /**
   * 已选择订单
   */
  selectArr: any = [];
  /**
   * 导出信息模态框
   */
  exportVisible = false;
  isVisible = false;
  /**
   * 时间选择器
   */
  exportDate = null;
  /**
   * 模态框参数
   */
  modalParam: any = {};
  /**
   * 上传val
   */
  inputVal: any = null;
  /**
   * 加载失败显示图像占位符
   */
  fallback =
    'data:image/png;base64,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';

  /**
   * 路由缓存恢复时
   */
  static updateCache: any = null;

  constructor(
    private router: Router,
    private OrderAccService: OrderAccService,
    private message: NzMessageService,
    private fb: FormBuilder
  ) { }

  ngOnInit(): void {
    OrderAccComponent.updateCache = () => {
      this.tableLoading = false;
      this.getList();
    }
    this.getList();
  }
  toTabs(id: any) {
    // this.queryForm.searchType = id;
    this.getList();
  }
  // 页码改变
  onPageIndexChange(index: number) {
    console.log(index);
    this.queryForm.page = index;
    this.checked = false;
    this.getList();
  }
  // 每页条数改变的回调
  onPageSizeChange(index: number) {
    console.log(index);
    this.queryForm.pageSize = index;
    this.checked = false;
    this.getList();
  }
  /**
   * 查询
   */
  query(): void {
    if (this.queryForm.goodsName != "" || this.queryForm.orderNum != "" || this.queryForm.orderState != "" ||
      this.queryForm.dateFormat != "") {
      this.searchHint = true;
    } else {
      this.searchHint = false;
    }
    this.getList();
  }
  /**
   * 获取列表数据
   * @returns 
   */
  getList() {
    if (this.tableLoading) { return; }
    this.listOfData = [];
    this.tableLoading = true;

    this.OrderAccService.get(this.queryForm).subscribe((res: any) => {
      if (res.code != 0) {
        this.createMessage("error", res.message);
        return;
      }
      res.data.records.forEach((element: any) => {
        element['Checked'] = false;
      });
      this.listOfData = res.data;

      for (let index = 0; index < this.listOfData.records.length; index++) {
        let element = this.listOfData.records[index];
        element.statusTest = this.status_To_Text(element.status);

      }
      let textArr = [];
      if (this.queryForm.goodsName) {
        textArr.push(this.queryForm.goodsName);
      }
      if (this.queryForm.orderNum) {
        textArr.push(this.queryForm.orderNum);
      }
      if (this.queryForm.orderState) {
        textArr.push(this.status_To_Text(this.queryForm.orderState));
      }
      if (this.queryForm.dateFormat) {
        let strTime = this.OrderAccService.shiftDate(this.queryForm.dateFormat[0]);
        let endTime = this.OrderAccService.shiftDate(this.queryForm.dateFormat[1]);
        let time = strTime + " - " + endTime;
        textArr.push(time);
      }
      this.searcName = textArr.join(' | ');

      this.tableLoading = false;
    }, err => {
      this.tableLoading = false;
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
   * 搜索返回原列表
   */
  backList() {
    this.queryForm.goodsName = "";
    this.queryForm.orderNum = "";
    this.queryForm.orderState = "";
    this.queryForm.dateFormat = "";
    this.queryForm.page = 1;

    this.searchHint = false;
    this.getList();
  }

  /**
   * 审核保存
   */
  save(state: any) {
    if (this.messageId != null) {
      return;
    }
    let ids = this.selectArr.map((ele: any) => {
      return ele.id
    });
    if (ids.length == 0) {
      return this.createMessage("warning", "请选择要审核的订单");
    }
    if (state == 4 && !this.auditDesc) {
      return this.createMessage("warning", "请输入备注");
    }
    let json = {
      ids: ids,
      //审核状态 4:不通过 5:通过
      state: state,
      // 审核意见
      auditDesc: this.auditDesc,
      type: 0
    }
    this.createBasicMessage();
    this.OrderAccService.audit(json).subscribe((res: any) => {
      this.removeBasicMessage();
      if (res.code != 0) {
        this.createMessage("error", res.message);
        return;
      }
      this.createMessage("success", res.message);
      this.handleCancel();
      this.getList();
    }, err => {
      this.removeBasicMessage();
      this.createMessage("error", err.message);
    });
  }
  /**
   * 状态转换颜色
   */
  getStatusColor(s: any) {
    let colorText = "";
    switch (parseInt(s)) {
      // 红色
      case 2: case 10: case 11: case 12: case 14:
        colorText = "font2"
        break;
      // 橙色
      case 3: case 6: case 13:
        colorText = "font3"
        break;
      // 灰色
      case 4:
        colorText = "font3"
        break;
      // 绿色
      case 5: case 9:
        colorText = "font3"
        break;

    }
    return colorText;
  }
  /**
   * item单选
   * @param id 
   * @param checked 
   */
  onItemChecked(id: number, checked: boolean): void {
    const index = this.listOfData.records.findIndex((item: { id: number; }) => item.id === id);
    this.listOfData.records[index].Checked = checked;
    this.updataCheckAll();
  }
  /**
   * 全选
   * @param value 
   */
  onAllChecked(value: boolean): void {
    this.listOfData.records.forEach((item: any) => {
      if (item.statusTest == "待审核") {
        item.Checked = value
      }

    });
  }
  /**
   * 判断item是否全部选择
   */
  updataCheckAll() {
    const index = this.listOfData.records.findIndex((item: { Checked: boolean; }) => item.Checked == false);
    if (index != -1) {
      this.checked = false;
    } else {
      this.checked = true;
    }
  }
  /**
   * 物流编码转文字
   */
  expressCode_To_Text(s: any) {
    let test = "";
    switch (s) {
      case "SF":
        test = "顺丰";
        break;
      case "YTO":
        test = "圆通";
        break;
      case "ZTO":
        test = "中通";
        break;
      case "STO":
        test = "申通";
        break;
      case "YUNDA":
        test = "韵达";
        break;
      case "JD":
        test = "京东";
        break;
      default:
        test = "-";
        break;
    }
    return test;
  }
  /**
   * 打开模态框(导出信息)
   */
  exportModal(s: any) {
    this.exportVisible = true;
    this.modalParam.exportCode = s;
  }
  /**
   * 打开模态框(审核)
   */
  showModal(obj: any = null) {
    this.isVisible = true;
    this.selectArr = this.listOfData.records.filter(function (item: any) {
      return obj ? obj.id == item.id : item.Checked == true
    })
  }
  /**
   * 关闭模态框
   */
  handleCancel() {
    this.isVisible = false;
    this.exportVisible = false;
    
    this.exportDate = null;
    this.followVisible = false;

    this.followParam.content = "";
    this.followParam.enclosure = [];
  }
  /**
   * 只保留文件名加后缀
   */
  formUrl(url: String) {
    return url.substr(url.lastIndexOf('/') + 1);
  }
  /**
   * 删除跟进图片
   */
  deleteFollowImg(index: any) {
    this.inputVal = null;
    this.followParam.enclosure = this.followParam.enclosure.filter((item: any, i: any) => {
      return i != index;
    });
  }
  /**
   * 打开模态框(跟进) 初始化
   * @param id 
   */
  followModal(relationInformation: any): void {
    this.followParam.relationInformation = relationInformation;
    this.followerLst();
  }

  /**
   * 跳转调节单
   */
  toAdjustOrder() {
    this.router.navigate(['service/newAdjustOrder']);
  }
  /**
   * 导出
   */
  exportOrder() {
    // 
    // console.log(this.OrderAccService.export(this.queryForm));
    // window.open(this.OrderAccService.export_URL + ()).)
    if (!this.exportDate) {
      return this.createMessage("warning", "请选择时间");
    }
    if (this.messageId != null) {
      return;
    }
    this.createBasicMessage();
    this.OrderAccService.export({ dateFormat: this.exportDate, exportCode: this.modalParam.exportCode }).subscribe((res: any) => {
      this.removeBasicMessage();
    }, err => {
      this.removeBasicMessage();
      // this.createMessage("error", err.message);
      if (err.status == 200) {
        window.open(err.url, '_self')
        this.handleCancel();
      }
      // console.log(err);
    });
  }
  /**
   * 批量发货
   */
  goodsDeliver() {
    if (this.messageId != null) {
      return;
    }
    let ids = this.listOfData.records.filter(function (item: any) { return item.status == 5; })
    if (ids.length == 0) {
      return this.createMessage("warning", "当前列表没有需要发货的订单");
    }
    let json = {
      state: 5,
      type: 1
    }
    this.createBasicMessage();
    this.OrderAccService.audit(json).subscribe((res: any) => {
      this.removeBasicMessage();
      if (res.code != 0) {
        this.createMessage("error", res.message);
        return;
      }
      this.createMessage("success", "批量发货成功");
      this.getList();
    }, err => {
      this.removeBasicMessage();
      this.createMessage("error", err.message);
    });
  }
  /**
   * 文件上传完成回调
   * @param files 
   * @param type  1:图片信息 2:视频文件 3:视频封面
   */
  handleFileInput(files: any, type: any) {
    let fileArr = files.target.files;
    for (let index = 0; index < fileArr.length; index++) {
      const element = fileArr[index];
      this.postFile(element, (res: any) => {
        if (res.code != 0) {
          return;
        }
        // 上传类型
        if (type == 2) {
          this.followParam.enclosure.push({
            // 显示地址
            showUrl: element.name,
            // 图片地址
            url: res.data,
          });
        }
        this.inputVal = null;
      });
    }
  }
  /**
   * 跟进查询
   */
  followerLst() {
    if (this.messageId != null) {
      return;
    }
    this.createBasicMessage();
    this.OrderAccService.followerLst(this.followParam).subscribe((res: any) => {
      this.removeBasicMessage();
      if (res.code != 0) {
        this.createMessage("error", res.message);
        return;
      }
      this.followVisible = true;
      this.followList = res.data;
      for (let index = 0; index < this.followList.length; index++) {
        let element = this.followList[index];
        element.enclosure = element.enclosure ? element.enclosure.split(',') : [];
      }
    }, err => {
      this.removeBasicMessage();
      this.createMessage("error", err.message);
    })
  }
  /**
   * 新增跟进
   */
  followerSave() {
    if (this.messageId != null) {
      return;
    }
    if (!this.followParam.content) {
      return this.createMessage("warning", "请输入备注");
    }
    this.createBasicMessage();
    this.OrderAccService.followerSave(this.followParam).subscribe((res: any) => {
      this.removeBasicMessage();
      if (res.code != 0) {
        this.createMessage("error", res.message);
        return;
      }
      this.handleCancel();
      this.createMessage("success", "跟进信息成功");
    }, err => {
      this.removeBasicMessage();
      this.createMessage("error", err.message);
    })
  }
  /**
   * 上传文件
   * @param su 上传完成回调函数
   */
  postFile(file: any, su: any) {
    this.OrderAccService.postFile(file).subscribe(data => {
      if (su) su(data);
    }, error => {

    });
  }
  /**
   * 订单状态转换
   * 0：有效1：无效2：待付款3：待发货4：已发货 5已收货 6已取消 
   * @param s 
   * @returns 
   */
  status_To_Text(s: any) {
    let test = "";
    s = parseInt(s);
    switch (s) {
      case 0:
        test = "有效";
        break;
      case 1:
        test = "无效";
        break;
      case 2:
        test = "待付款";
        break;
      case 3:
        test = "待审核";
        break;
      case 4:
        test = "审核不通过";
        break;
      case 5:
        test = "审核通过";
        break;
      case 6:
        test = "排队发货";
        break;
      case 7:
        test = "待发货";
        break;
      case 8:
        test = "待收货(已发货)";
        break;
      case 9:
        test = "交易完成";
        break;
      case 10:
        test = "支付超时";
        break;
      case 11:
        test = "客服取消";
        break;
      case 12:
        test = "客户取消";
        break;
      case 13:
        test = "售后中";
        break;
      case 14:
        test = "全部退货";
        break;
      default:
        test = "---";
        break;
    }
    return test;
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
