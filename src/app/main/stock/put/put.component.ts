import { Component, OnInit } from '@angular/core';
import { NzMessageService } from 'ng-zorro-antd/message';
import { PutService } from './put.service';
@Component({
  selector: 'app-put',
  templateUrl: './put.component.html',
  styleUrls: ['./put.component.scss']
})
export class PutComponent implements OnInit {

  /**
   * 列表数据源
   */
  listOfData?: any;
  /**
   * 查询参数格式
   */
  queryForm: any = {
    // 入库单号
    warehousingNumber: '',
    // 采购单号
    purchaseNumber: '',
    //状态  0 草稿 1 全部 2 已通知 3 已完成 4 已关闭
    state: '',
    // 开始时间
    beginTime: '',
    // 结束时间
    endTime: '',
    // 时间区间
    dateFormat: '',
    // 包含商品
    whGood: '',
    page: '1',
    pageSize: '20',
  }
  /**
   * 全局 loading
   */
  messageId: any = null;
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
   * 路由缓存恢复时
   */
  static updateCache: any = null;

  constructor(
    private message: NzMessageService,
    private PutService: PutService,
  ) { }

  ngOnInit(): void {
    PutComponent.updateCache = () => {
      this.tableLoading = false;
      this.getList();
    }
    this.getList();
  }

  query() {
    this.getList();
  }

  onPageIndexChange(index: number) {
    console.log(index);
    this.queryForm.page = index;
    this.getList();
  }

  onPageSizeChange(index: number) {
    console.log(index);
    this.queryForm.pageSize = index;
    this.getList();
  }
  getList() {
    if (this.tableLoading) { return; }
    this.listOfData = [];
    this.tableLoading = true;
    this.PutService.getList(this.queryForm).subscribe((res: any) => {
      if (res.code != 0) {
        this.createMessage("error", res.message);
        return;
      }
      let textArr = [];
      if (this.queryForm.warehousingNumber) {
        textArr.push(this.queryForm.warehousingNumber);
      }
      if (this.queryForm.purchaseNumber) {
        textArr.push(this.queryForm.purchaseNumber);
      }
      if (this.queryForm.whGood) {
        textArr.push(this.queryForm.whGood);
      }
      if (this.queryForm.dateFormat) {
        textArr.push(this.queryForm.dateFormat);
      }
      if (this.queryForm.state) {
        textArr.push(this.queryForm.state);
      }
      this.searcName = textArr.join(' | ');

      this.listOfData = res.data;
      for (let index = 0; index < this.listOfData.records.length; index++) {
        const element = this.listOfData.records[index];
        element.stateText = this.status_To_text(element.state);
      }
      this.tableLoading = false;
    }, err => {
      this.tableLoading = false;
      this.createMessage("error", err.message);
    })
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
    this.queryForm.warehousingNumber = "";
    this.queryForm.purchaseNumber = "";
    this.queryForm.state = "";
    this.queryForm.beginTime = "";
    this.queryForm.endTime = "";
    this.queryForm.dateFormat = "";
    this.queryForm.whGood = "";

    this.queryForm.page = 1;
    this.searchHint = false;
    this.getList();
  }
  /**
   * 通知入库
   */
  synchronize(id: any) {
    if (this.messageId != null) {
      return;
    }
    this.createBasicMessage();
    this.PutService.synchronize(id).subscribe((res: any) => {
      this.removeBasicMessage();
      if (res.code != 0) {
        this.createMessage("error", res.message);
        return;
      }
      this.createMessage("success", "已通知入库");
      this.getList();
    }, err => {
      this.removeBasicMessage();
      this.createMessage("error", err.message);
    })
  }
  /**
   * 删除
   * @param id 
   */
  confirm(id: any) {
    if (this.messageId != null) {
      return;
    }
    this.createBasicMessage();
    this.PutService.delete(id).subscribe((res: any) => {
      this.removeBasicMessage();
      if (res.code != 0) {
        this.createMessage("error", res.message);
        return;
      }
      this.createMessage("success", "删除成功");
      this.getList();
    }, err => {
      this.removeBasicMessage();
      this.createMessage("error", err.message);
    });
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
  * 状态转文字
  * @param status 
  */
  type_To_text(type: any) {
    const text: any = { 1: '采购入库', 2: '售后入库', 3: '不良品返厂', 4: '坏件入库', 5: '代售入库' }
    return text[type] || '-'
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
