import { Component, OnInit } from '@angular/core';
import { NzMessageService } from 'ng-zorro-antd/message';
import { ActivatedRoute, Router } from '@angular/router';

import { PurchaseOrderDetailsService } from './purchase-order-details.service';
@Component({
  selector: 'app-purchase-order-details',
  templateUrl: './purchase-order-details.component.html',
  styleUrls: ['./purchase-order-details.component.scss']
})
export class PurchaseOrderDetailsComponent implements OnInit {
  id: any = null;
  /**
   * 商品详情数据(公共)
   */
  detailsData: any = null;
  /**
   * 全局 loading
   */
  messageId: any = null;
  isVisible = false;
  closeVisible = false;
  /**
   * 手动关闭
   */
  closeParams = {
    // 0:表格内关闭 1:订单关闭
    code: 0,
    // 关闭原因
    content: "",
    // 表格内id
    itemId: 0
  };
  constructor(
    private router: Router,
    private activatedRoute: ActivatedRoute,
    private PurchaseOrderDetailsService: PurchaseOrderDetailsService,
    private message: NzMessageService,
  ) { }

  ngOnInit() {
    this.activatedRoute.params.subscribe((params) => {
      this.id = params.id;
      if (this.id != 0) {
        this.getDetails();
      }
    })
  }
  /**
   * 手动关闭接口(表格内)
   * @param id 
   * @returns 
   */
  closeList(id: any) {
    if (this.messageId != null) {
      return;
    }
    this.createBasicMessage();
    this.PurchaseOrderDetailsService.closeList({
      id: id,
      state: 1,
      closeRemark: this.closeParams.content
    }).subscribe((res: any) => {
      this.removeBasicMessage();
      if (res.code != 0) {
        this.createMessage("error", res.message);
        return;
      }
      this.createMessage("success", res.message);
      this.getDetails();
      this.handleCancel();
    }, err => {
      this.removeBasicMessage();
      this.createMessage("error", err.message);
    })
  }
  /**
   * 手动关闭
   */
  closeFun() {
    if (!this.closeParams.content) {
      return this.createMessage("warning", "请输入关闭原因");
    }
    // 表格内关闭
    if (this.closeParams.code == 0) {
      this.closeList(this.closeParams.itemId);
    } else {
      this.detailsData.purchase.closeRemark = this.closeParams.content;
      this.detailsData.purchase.state = 6;
      this.update();
    }
  }
  /**
   * 打开模态框(审核)
   */
  showModal() {
    this.isVisible = true;
  }
  /**
   * 打开模态框(手动关闭)
   * @param c 0:表格内手动关闭 1:订单关闭
   * @param index 表格id
   */
  showCloseModal(c: any, id: any = null) {
    this.closeVisible = true;
    this.closeParams.code = c;
    if (id) {
      this.closeParams.itemId = id;
    }
  }
  /**
   * 关闭模态框
   */
  handleCancel() {
    this.isVisible = false;
    this.closeVisible = false
    this.closeParams.content = "";
  }
  /**
   * 保存
   */
  save(state: any) {
    if (this.messageId != null) {
      return;
    }
    if (state == 3 && !this.detailsData.purchase.auditDesc) {
      return this.createMessage("warning", "请输入审核意见");
    }
    this.detailsData.purchase.state = state;
    this.update();
  }
  /**
   * 修改
   */
  update() {
    this.createBasicMessage();
    this.PurchaseOrderDetailsService.update(this.detailsData).subscribe((res: any) => {
      this.removeBasicMessage();
      if (res.code != 0) {
        this.createMessage("error", res.message);
        return;
      }
      this.createMessage("success", res.message);
      this.router.navigate(['stock/purchaseOrder']);
    }, err => {
      this.removeBasicMessage();
      this.createMessage("error", err.message);
    })
  }
  /**
   * 获取采购单详情
   */
  getDetails() {
    this.PurchaseOrderDetailsService.details(this.id).subscribe((res: any) => {
      this.detailsData = res.data;
      this.detailsData.purchase.stateText = this.status_To_text(this.detailsData.purchase.state);
      for (let index = 0; index < this.detailsData.list.length; index++) {
        const element = this.detailsData.list[index];
        element.stateText = this.list_status_To_text(element.state);
      }
    }, err => {

    })
  }
  /**
  * 状态转文字
  * @param status 
  */
  status_To_text(status: any) {
    let text = "";
    switch (status) {
      case 0:
        text = "草稿";
        break;
      case 1:
        text = "待审核";
        break;
      case 2:
        text = "审核通过";
        break;
      case 3:
        text = "审核不通过";
        break;
      case 4:
        text = "入库中";
        break;
      case 5:
        text = "已完成";
        break;
      case 6:
        text = "已关闭";
        break;
      default:
        text = "---";
        break;
    }
    return text;
  }
  /**
  * 表格状态转文字
  * @param status 
  */
  list_status_To_text(status: any) {
    let text = "";
    switch (status) {
      case 0:
        text = "未关闭";
        break;
      case 1:
        text = "已关闭";
        break;
      case 2:
        text = "已完成";
        break;
      case 3:
        text = "待入库";
        break;
      case 4:
        text = "入库异常";
        break;
      case 5:
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
   * @param type 其他提示类型 success:成功 error:失败 warning：警告
   */
  createMessage(type: any, str: any): void {
    this.message.create(type, str);
  }

}
