import { Component, OnInit } from '@angular/core';
import { NzMessageService } from 'ng-zorro-antd/message';
import { OutService } from './out.service';
import { ConfigDictListService } from '../../config/config-dict-list/config-dict-list.service';
@Component({
  selector: 'app-out',
  templateUrl: './out.component.html',
  styleUrls: ['./out.component.scss']
})
export class OutComponent implements OnInit {

  /**
   * 列表数据源
   */
  listOfData?: any;
  /**
   * 查询参数格式
   */
  queryForm: any = {
    // 出库单号
    deliveryNumber: '',
    // 关联单号
    orderNum: '',
    // 包含商品
    goods: '',
    //状态(1草稿 2已通知 3已完成 4已撤销)
    state: '',
    // 开始时间
    createTime: '',
    // 结束时间
    endTime: '',
    // 时间区间
    dateFormat: '',
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
  /**
   * 字典列表
   */
  dict = {
    // 出库类型列表
    outTypeList: [],
  }
  constructor(
    private ConfigDictListService: ConfigDictListService,
    private message: NzMessageService,
    private OutService: OutService,
  ) { }

  ngOnInit(): void {
    OutComponent.updateCache = () => {
      this.tableLoading = false;
      this.getList();
    }
    this.getList();


    // 获取字典的 供应商类型
    this.ConfigDictListService.getDictList({
      // 名称或者编码搜索
      parentKey: "outbound_type",
      // 多少页，默认1
      pageNum: 1,
      // 每页多少条，默认10
      pageSize: 999
    }).subscribe((res: any) => {
      this.dict.outTypeList = res.data.list.records;
    }, err => {
    });

  }


  /**
   * 出库类型转文字
   * @returns 
   */
   outType_to_Text(outType: String) {
    let text: any = this.dict.outTypeList.filter(function (item: any) { return item.content == outType });
    text = text[0] ? text[0].name : '-'
    return text;
  }

  query() {
    if (
      this.queryForm.deliveryNumber != "" ||
      this.queryForm.goods != "" ||
      this.queryForm.state != "" ||
      this.queryForm.orderNum != "" ||
      this.queryForm.dateFormat != ""
    ) {
      this.searchHint = true;
    } else {
      this.searchHint = false;
    }
    this.getList();
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
    this.queryForm.deliveryNumber = "";
    this.queryForm.orderNum = "";
    this.queryForm.goods = "";
    this.queryForm.state = "";
    this.queryForm.dateFormat = "";

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
    this.OutService.synchronize(id).subscribe((res: any) => {
      this.removeBasicMessage();
      if (res.code != 0) {
        this.createMessage("error", res.message);
        return;
      }
      this.createMessage("success", "已通知出库");
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
    this.OutService.delete(id).subscribe((res: any) => {
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
  getList() {
    if (this.tableLoading) { return; }
    this.listOfData = [];
    this.tableLoading = true;
    this.OutService.getList(this.queryForm).subscribe((res: any) => {
      if (res.code != 0) {
        this.createMessage("error", res.message);
        return;
      }
      let textArr = [];
      if (this.queryForm.deliveryNumber) {
        textArr.push(this.queryForm.deliveryNumber);
      }
      if (this.queryForm.orderNum) {
        textArr.push(this.queryForm.orderNum);
      }
      if (this.queryForm.goods) {
        textArr.push(this.queryForm.goods);
      }
      if (this.queryForm.whGood) {
        textArr.push(this.queryForm.whGood);
      }
      if (this.queryForm.dateFormat) {
        let strTime = this.OutService.shiftDate(this.queryForm.dateFormat[0]);
        let endTime = this.OutService.shiftDate(this.queryForm.dateFormat[1]);
        let time = strTime + " - " + endTime;
        textArr.push(time);
      }
      if (this.queryForm.state) {
        textArr.push(this.status_To_text(this.queryForm.state));
      }
      this.searcName = textArr.join(' | ');

      this.listOfData = res.data;
      this.tableLoading = false;
    }, err => {
      this.tableLoading = false;
      this.createMessage("error", err.message);
    })
  }
  onPageIndexChange(index: number) {
    this.queryForm.page = index;
    this.getList();
  }

  onPageSizeChange(index: number) {
    this.queryForm.pageSize = index;
    this.getList();
  }

  /**
  * 状态转文字
  * @param status 
  */
  status_To_text(status: any) {
    let text = "";
    switch (parseInt(status)) {
      case 1:
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
