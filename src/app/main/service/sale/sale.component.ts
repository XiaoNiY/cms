import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { FormBuilder } from '@angular/forms';

import { NzMessageService } from 'ng-zorro-antd/message';

import { SaleService } from './sale.service';
@Component({
  selector: 'app-sale',
  templateUrl: './sale.component.html',
  styleUrls: ['./sale.component.scss']
})
export class SaleComponent implements OnInit {
  /**
   * 列表数据源
   */
  listOfData: any = {
    list: []
  };
  /**
   * 查询参数格式
   */
  queryForm: any = {
    //  售后单号
    returnNum: '',
    // 订单编号
    orderNum: '',
    // 客户手机或姓名
    customerName: '',

    // 售后状态：0-用户提交申请（待审核）、1-审核通过（待买家退货）、2-退货超时、3-商品已寄出、4-待平台审核、6-售后成功、7-售后失败、8-已取消
    status: '',
    // 售后方式，1-退货，2-换货，3-取消订单、4-退款、5-补货
    type: '',

    // 申请时间-起始查询时间
    createTimeStart: '',
    // 申请时间-结束查询时间
    createTimeEnd: '',
    // 时间区间(控件使用)
    createFormat: '',

    // 超时时间-起始查询时间
    timeoutTimeStart: '',
    // 超时时间-结束查询时间
    timeoutTimeEnd: '',
    // 时间区间(控件使用)
    timeoutFormat: '',

    // 当前页码
    current: '1',
    // 分页大小
    size: '20',
  }
  /**
   * 上传val
   */
  inputVal: any = null;
  /**
   * 跟进模态框
   */
  followVisible: boolean = false;
  /**
   * 表单load加载
   */
  tableLoading: any = false;
  /**
   * 当前是否在搜索
   */
  searchHint = false;
  /**
   * 当前搜索name
   */
  searcName = "";
  /**
   * 全局 loading
   */
  messageId: any = null;
  /**
   * 跟进内容
   */
  followList: any = [];
  /**
   * 跟进参数
   */
  followParam: any = {
    // 关联信息(订单号 售后单号 客户id 出库单号)
    relationInformation: "",
    // 1、订单 2、售后 3、客户 4、出库
    type: 2,
    // 文件列表
    enclosure: [],
    // 备注
    content: "",
  }
  /**
   * 路由缓存恢复时
   */
  static updateCache: any = null;
  constructor(
    private SaleService: SaleService,
    private message: NzMessageService,
  ) { }

  ngOnInit(): void {
    SaleComponent.updateCache = () => {
      this.tableLoading = false;
      this.getList();
    }
    this.getList()
  }

  /**
   * 上传文件
   * @param su 上传完成回调函数
   */
  postFile(file: any, su: any) {
    this.SaleService.postFile(file).subscribe(data => {
      if (su) su(data);
    }, error => {

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
   * 删除跟进图片
   */
  deleteFollowImg(index: any) {
    this.inputVal = null;
    this.followParam.enclosure = this.followParam.enclosure.filter((item: any, i: any) => {
      return i != index;
    });
  }
  /**
   * 跟进查询
   */
  followerLst() {
    if (this.messageId != null) {
      return;
    }
    this.createBasicMessage();
    this.SaleService.followerLst(this.followParam).subscribe((res: any) => {
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
   * 只保留文件名加后缀
   */
  formUrl(url: String) {
    return url.substr(url.lastIndexOf('/') + 1);
  }
  /**
   * 查询列表
   * @returns 
   */
  getList() {
    if (this.tableLoading) { return; }
    this.listOfData = [];
    this.tableLoading = true;

    this.SaleService.get(this.queryForm).subscribe((res: any) => {
      if (res.code != 0) {
        this.createMessage("error", res.message);
        return;
      }
      res.data.records.forEach((element: any) => {
        element['Checked'] = false;
      });
      let textArr = [];
      if (this.queryForm.returnNum) {
        textArr.push(this.queryForm.returnNum);
      }
      if (this.queryForm.orderNum) {
        textArr.push(this.queryForm.orderNum);
      }
      if (this.queryForm.customerName) {
        textArr.push(this.queryForm.customerName);
      }
      if (this.queryForm.status) {
        textArr.push(this.queryForm.status);
      }
      if (this.queryForm.type) {
        textArr.push(this.queryForm.type);
      }
      if (this.queryForm.createFormat) {
        textArr.push(this.queryForm.createFormat);
      }
      if (this.queryForm.timeoutFormat) {
        textArr.push(this.queryForm.timeoutFormat);
      }
      this.searcName = textArr.join(' | ');

      this.listOfData = res.data;
      this.tableLoading = false;
    }, err => {
      this.tableLoading = false;
      this.createMessage("error", err.message);
    });
  }
  query() {
    if (
      this.queryForm.returnNum != "" ||
      this.queryForm.orderNum != "" ||
      this.queryForm.customerName != "" ||
      this.queryForm.status != "" ||
      this.queryForm.type != "" ||
      this.queryForm.timeoutFormat != "" ||
      this.queryForm.createFormat != ""
    ) {
      this.searchHint = true;
    } else {
      return;
    }
    this.getList()
  }


  /**
   * 搜索返回原列表
   */
  backList() {
    this.queryForm.returnNum = "";
    this.queryForm.orderNum = "";
    this.queryForm.customerName = "";
    this.queryForm.status = "";
    this.queryForm.type = "";
    this.queryForm.timeoutFormat = "";
    this.queryForm.createFormat = "";
    this.queryForm.current = 1;

    this.searchHint = false;
    this.getList()
  }
  /**
   * 刷新列表
   */
  refresh() {
    this.listOfData.list = [];
    this.getList()
  }
  /**
   * 页码改变
   * @param index 页码数
   */
  onPageIndexChange(index: Number) {
    this.queryForm.current = index;
    this.getList()
  }
  /**
   * 每页条数改变的回调
   * @param index 页码数
   */
  onPageSizeChange(index: Number) {
    this.queryForm.size = index;
    this.getList()
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
    this.SaleService.followerSave(this.followParam).subscribe((res: any) => {
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
   * 模态框关闭触发
   */
  handleCancel(): void {

    this.followVisible = false;

    this.followParam.content = "";
    this.followParam.enclosure = [];
    this.inputVal = null;
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
