import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { FormBuilder } from '@angular/forms';

import { NzMessageService } from 'ng-zorro-antd/message';
import { GoodsAllService } from './goods-all.service';

@Component({
  selector: 'app-goods-all',
  templateUrl: './goods-all.component.html',
  styleUrls: ['./goods-all.component.scss'],
})
export class GoodsAllComponent implements OnInit {

  isVisible = false;

  validateForm!: any;
  // // 查询表格初始化
  // queryForm!: any;


  listOfData?: any;

  checked = false;
  /**
   * 列表查询条件
   */
  queryForm: any = {
    // 商品编号或名称
    name: '',
    // 商品类型id
    typeId: '',
    // 状态 -1 全部  0无效 1 有效 2下架
    status: '-1',
    // 创建日期-起始时间  
    createTimeStart: "",
    // 创建日期-结束时间
    createTimeEnd: "",
    // 时间区间(控件使用)
    nzFormat: "",
    // 当前页码
    current: '1',
    // 分页大小
    size: '20',
  }
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
   * 全局 loading
   */
  messageId: any = null;
  /**
   * 类型下拉
   */
  GoodsTypeList: any = [];
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
    private GoodsAllService: GoodsAllService,
    private fb: FormBuilder,
    private message: NzMessageService,
  ) {

  }
  ngOnInit(): void {
    this.validateForm = this.fb.group({
      formLayout: ['horizontal'],
    });

    GoodsAllComponent.updateCache = () => {
      this.tableLoading = false;
      this.getList();
    }
    this.getList();
    this.getGoodsTypeList();
  }
  /**
   * 查询
   */
  query(): void {
    if (this.queryForm.name != "" || this.queryForm.typeId != "" || this.queryForm.status != "-1" || this.queryForm.nzFormat != "") {
      this.searchHint = true;
    } else {
      this.searchHint = false;
    }
    this.getList();
  }
  /**
   * 分类下拉
   */
  getGoodsTypeList() {
    this.GoodsAllService.getGoodsTypeList().subscribe((res: any) => {
      if (res.code != 0) {
        this.createMessage("error", res.message);
        return;
      }
      this.GoodsTypeList = res.data;
    }, err => {
    });
  }
  /**
   * 跳转详情页
   * @param id 
   */
  toEdit(id: any = 0) {
    this.router.navigate(['goods/goodsTabs', id]);
  }
  /**
   * 搜索返回原列表
   */
  backList() {
    this.queryForm.name = "";
    this.queryForm.current = 1;
    this.queryForm.nzFormat = "";
    this.queryForm.status = "-1";
    this.queryForm.typeId = "";
    this.searchHint = false;
    this.checked = false;
    this.getList();
  }

  /**
   * item单选
   * @param id 
   * @param checked 
   */
  onItemChecked(id: number, checked: boolean): void {
    console.log("id:" + id + ",checked:" + checked);
    const index = this.listOfData.records.findIndex((item: { id: number; }) => item.id === id);
    this.listOfData.records[index].Checked = checked;
    this.updataCheckAll();
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
   * 判断item是否全部选择
   */
  updataCheckAll() {
    const index = this.listOfData.records.findIndex((item: { Checked: boolean; }) => item.Checked == false);
    console.log(index);

    if (index != -1) {
      this.checked = false;
    } else {
      this.checked = true;
    }
  }
  /**
   * 全部删除
   */
  onAllDel() {
    var outMealServicelist = this.listOfData.records.filter(function (item: { Checked: boolean; }) { return item.Checked == true; });
    for (let index = 0; index < outMealServicelist.length; index++) {
      const element = outMealServicelist[index];
    }
  }
  /**
   * 页码改变
   * @param index 
   */
  onPageIndexChange(index: number) {
    console.log(index);
    this.queryForm.current = index;
    this.checked = false;
    this.getList();
  }
  /**
   * 每页条数改变的回调
   * @param index 
   */
  onPageSizeChange(index: number) {
    console.log(index);
    this.queryForm.size = index;
    this.getList();
  }
  /**
   * 删除
   * @param item 
   */
  confirm(item: any) {
    if (item.skuGroupName) {
      return this.createMessage("warning", "该商品已经关联规格组，请解绑后重试");;
    }
    if (this.messageId != null) {
      return;
    }
    this.createBasicMessage();
    this.GoodsAllService.delete(item.id).subscribe((res: any) => {
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
   * 复制商品
   */
  copyGoods(id: any) {
    if (this.messageId != null) {
      return;
    }
    this.createBasicMessage();
    this.GoodsAllService.copy(id).subscribe((res: any) => {
      this.removeBasicMessage();
      if (res.code != 0) {
        this.createMessage("error", res.message);
        return;
      }
      this.createMessage("success", "复制成功");
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
   * 查询列表
   * @returns 
   */
  getList() {
    if (this.tableLoading) { return; }
    this.listOfData = [];
    this.tableLoading = true;

    this.checked = false;
    this.GoodsAllService.get(this.queryForm).subscribe((res: any) => {
      if (res.code != 0) {
        this.createMessage("error", res.message);
        return;
      }

      res.data.records.forEach((element: any) => {
        element['Checked'] = false;
      });
      let textArr = [];
      if (this.queryForm.name) {
        textArr.push(this.queryForm.name);
      }
      if (this.queryForm.typeId) {
        textArr.push(this.queryForm.typeId);
      }
      if (this.queryForm.status) {
        textArr.push(this.queryForm.status);
      }
      if (this.queryForm.nzFormat) {
        textArr.push(this.queryForm.nzFormat);
      }
      this.searcName = textArr.join(' | ');

      this.listOfData = res.data;
      this.tableLoading = false;
    }, err => {
      this.tableLoading = false;
      this.createMessage("error", err.message);
    });
  }
  /**
   * 批量下架
   */
  onlineStatusBatch(status: any) {
    if (this.messageId != null) {
      return;
    }
    let ids = this.listOfData.records.filter(function (item: any) { return item.Checked == true; }).map((ele: any) => {
      return ele.id
    }).join(',');
    if (!ids) {
      return this.createMessage("warning", "请选择要上/下架的商品");
    }
    this.createBasicMessage();
    let json = {
      ids: ids,
      // 0 无效  1有效 2 下架（未上架）
      status: status
    }
    this.GoodsAllService.onlineStatusBatch(json).subscribe((res: any) => {
      this.removeBasicMessage();
      if (res.code != 0) {
        this.createMessage("error", res.message);
        return;
      }
      this.getList();
      this.createMessage("success", status == 2 ? "批量下架成功" : "批量上架成功");
    }, err => {
      this.removeBasicMessage();
      this.createMessage("error", err.message);
    });
  }

  /**
   * 下架
   * @returns 
   */
  clickSwitch(id: any, status: any): void {
    if (this.messageId != null) {
      return;
    }
    this.createBasicMessage();
    this.GoodsAllService.onlineStatusBatch({ ids: id, status: status }).subscribe((res: any) => {
      this.removeBasicMessage();
      if (res.code != 0) {
        this.createMessage("error", res.message);
        return;
      }
      this.getList();
      this.createMessage("success", "下架成功");
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
  * @param type 其他提示类型 success:成功 error:失败 warning:警告
  */
  createMessage(type: any, str: any): void {
    this.message.create(type, str);
  }
}
