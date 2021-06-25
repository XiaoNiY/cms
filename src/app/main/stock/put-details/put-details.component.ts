import { Component, OnInit } from '@angular/core';
import { NzMessageService } from 'ng-zorro-antd/message';
import { ActivatedRoute, Router } from '@angular/router';

import { PutDetailsService } from './put-details.service';
@Component({
  selector: 'app-put-details',
  templateUrl: './put-details.component.html',
  styleUrls: ['./put-details.component.scss']
})
export class PutDetailsComponent implements OnInit {
  id: any = null;
  /**
   * 商品详情数据(公共)
   */
  detailsData: any = null;
  /**
   * 全局 loading
   */
  messageId: any = null;
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
    private PutDetailsService: PutDetailsService,
    private message: NzMessageService
  ) { }

  ngOnInit(): void {
    this.activatedRoute.params.subscribe((params) => {
      this.id = params.id;
      if (this.id != 0) {
        this.getDetails();
      }
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
      this.detailsData.warehousing.closeRemark = this.closeParams.content;
      this.detailsData.warehousing.state = 4;
      this.update();
    }
  }
  /**
   * 修改
   */
  update() {
    if (this.messageId != null) {
      return;
    }
    this.createBasicMessage();
    this.PutDetailsService.update(this.detailsData).subscribe((res: any) => {
      this.removeBasicMessage();
      if (res.code != 0) {
        this.createMessage("error", res.message);
        return;
      }
      this.createMessage("success", res.message);
      this.router.navigate(['stock/put']);
    }, err => {
      this.removeBasicMessage();
      this.createMessage("error", err.message);
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
    this.PutDetailsService.closeList({
      id: id,
      state: 0,
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
    this.closeVisible = false
    this.closeParams.content = "";
  }
  getDetails() {
    this.PutDetailsService.getDetails(this.id).subscribe((res: any) => {
      this.detailsData = res.data;
      this.detailsData.warehousing.stateText = this.status_To_text(this.detailsData.warehousing.state);
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
      case 2:
        text = "已通知";
        break;
      case 3:
        text = "已完成";
        break;
      case 4:
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
