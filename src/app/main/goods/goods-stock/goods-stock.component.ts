import { Component, ElementRef, ViewChild, OnInit } from '@angular/core';
import { NzMessageService } from 'ng-zorro-antd/message';
import { CdkDragDrop, moveItemInArray } from '@angular/cdk/drag-drop';

import { GoodsTabsService } from '../goods-tabs/goods-tabs.service';
import { GoodsStockService } from './goods-stock.service';
@Component({
  selector: 'app-goods-stock',
  templateUrl: './goods-stock.component.html',
  styleUrls: ['./goods-stock.component.scss']
})
export class GoodsStockComponent implements OnInit {

  /**
   * 商品详情数据(公共)
   */
  detailsData: any = null;
  /**
   * 模态框显示 or 隐藏
   */
  showGoods = false;
  /**
   * 选择全部
   */
  checkedAll = false;
  /**
 * 查询参数
 */
  queryForm: any = {
    // 商品名称
    whGood: '',
    // 排队数量
    lineupNumber: '',
    // 库存
    stock: '',
    // 超卖数量
    oversoldNumber: '',
    page: '1',
    pageSize: '10',
  }
  /**
  * 接口参数
  */
  entityParam: any = {
    id: null,
    updateType: "3",
    // 库存数量
    stockNum: "",
    // 需要解除关联的仓库商品id，多个用英文逗号分隔	
    delIds: "",
    // 需要关联的仓库商品集合
    whGoodsList: [],
  }
  /**
   * 已选择仓库商品(临时存放)
   */
  selectGoodsArr: any = [];
  /**
   * 已删除仓库商品(临时存放)
   */
  delGoodsArr: any = [];
  /**
   * 仓库商品列表数据
   */
  goodsListData: any = [];
  /**
   * 全局 loading
   */
  messageId: any = null;

  constructor(
    private GoodsTabsService: GoodsTabsService,
    private message: NzMessageService,
    private GoodsStockService: GoodsStockService,
  ) { }

  ngOnInit(): void {
    this.GoodsTabsService.updateFun = () => {
      this.initData();
    }
    this.initData();
  }
  initData() {
    this.detailsData = this.GoodsTabsService.detailsData;
    this.entityParam.id = this.detailsData.id;
    this.entityParam.stockNum = this.detailsData.stockNum;
    this.getGoodsIdList();
  }
  /**
   * 统计库存
   */
  statistics() {
    let sum = 0;
    for (let index = 0; index < this.entityParam.whGoodsList.length; index++) {
      const element = this.entityParam.whGoodsList[index];
      sum +=element.count;
    }
    console.log(sum);
    this.entityParam.stockNum = Math.floor(this.entityParam.stockNum / sum);
  }
  /**
  * 页码改变
  * @param index 页码数
  */
  onPageIndexChange(index: Number) {
    console.log(index);
    this.queryForm.page = index;
    this.getGoodsList();
  }
  /**
   * 每页条数改变的回调
   * @param index 页码数
   */
  onPageSizeChange(index: Number) {
    this.queryForm.pageSize = index;
    this.getGoodsList();
    console.log(index);
  }
  /**
   * 保存
   */
  submitForm() {
    if(this.entityParam.whGoodsList.length == 0){
      return this.createMessage("warning", "仓库商品至少要选择1个，否则无法保存");
    }
    if (this.messageId != null) {
      return;
    }
    this.entityParam.delIds = this.delGoodsArr.toString();
    this.createBasicMessage();
    this.GoodsStockService.update(this.entityParam).subscribe((res: any) => {
      this.removeBasicMessage();
      if (res.code != 0) {
        this.createMessage("error", res.message);
        return;
      }
      this.createMessage("success", "保存成功");
      this.GoodsTabsService.updateDetails();
    }, err => {
      this.createMessage("error", err.message);
      this.removeBasicMessage();
    });
  }
  /**
   * 删除
   * @param index 
   */
  delete(item: any) {
    if (item.id) {
      this.delGoodsArr.push(item.id);
    }
    this.entityParam.whGoodsList = this.entityParam.whGoodsList.filter((obj: any, i: any) => {
      return obj.whGoodsId != item.whGoodsId;
    });
    this.selectGoodsArr = [...this.entityParam.whGoodsList];
  }
  /**
   * 确认选择仓库商品
   */
  slectGoods() {
    for (let index = 0; index < this.selectGoodsArr.length; index++) {
      const element = this.selectGoodsArr[index];
      let goodsIndex = this.entityParam.whGoodsList.findIndex((obj: any, i: any) => {
        return obj.whGoodsId == element.whGoodsId;
      });
      console.log(goodsIndex);
      if (goodsIndex == -1) {
        this.entityParam.whGoodsList.push({
          id: element.id,
          whGoodsId: element.whGoodsId,
          code: element.code,
          attr: element.attr,
          name: element.name,
          count: 1,
        });
      }
    }
    this.showGoods = false;
  }
  /**
  * 打开模态框 初始化
  * @param id 
  */
  showModal(): void {
    this.showGoods = true;
    this.selectGoodsArr = [... this.entityParam.whGoodsList];
    this.getGoodsList();
  }

  /**
   * 模态框关闭触发
   */
  handleCancel(): void {
    this.showGoods = false;
    this.selectGoodsArr = [];
  }

  /**
   * 全选
   * @param value 
   */
  onAllChecked(value: boolean): void {
    let goodsData = this.goodsListData.records;
    goodsData.forEach((item: { Checked: boolean; }) => item.Checked = value);
    for (let index = 0; index < goodsData.length; index++) {
      const element = goodsData[index];
      this.selectGoodsArr = this.selectGoodsArr.filter((item: any) => item.whGoodsId !== element.id);
    }
    for (let index = 0; index < goodsData.length; index++) {
      const element = goodsData[index];
      if (element.Checked) {
        this.selectGoodsArr.push({
          whGoodsId: element.id,
          code: element.code,
          attr: element.attr,
          name: element.name,
          count: "",
        });
      }
    }
  }
  /**
   * item单选
   * @param id 
   * @param checked 
   */
  onItemChecked(id: number, checked: boolean): void {
    const index = this.goodsListData.records.findIndex((item: { id: number; }) => item.id === id);
    let obj = this.goodsListData.records[index];
    obj.Checked = checked;
    if (checked) {
      this.selectGoodsArr.push({
        whGoodsId: obj.id,
        code: obj.code,
        attr: obj.attr,
        name: obj.name,
        count: "",
      });
    } else {
      this.selectGoodsArr = this.selectGoodsArr.filter((item: any) => item.whGoodsId !== id);
    }
    this.updataCheckAll();
  }
  /**
   * 判断item是否全部选择
   */
  updataCheckAll() {
    const index = this.goodsListData.records.findIndex((item: { Checked: boolean; }) => item.Checked == false);
    if (index != -1) {
      this.checkedAll = false;
    } else {
      this.checkedAll = true;
    }
  }

  /**
   * 获取仓库商品列表数据
   */
  getGoodsList() {
    this.GoodsStockService.getGoodsList(this.queryForm).subscribe((res: any) => {
      res.data.records.forEach((element: any) => {
        element['Checked'] = false;
      });
      this.goodsListData = res.data;
      this.checkedAll = false;

      if (this.selectGoodsArr.length != 0) {
        for (let index = 0; index < this.selectGoodsArr.length; index++) {
          const element = this.selectGoodsArr[index];
          for (let k = 0; k < this.goodsListData.records.length; k++) {
            const obj = this.goodsListData.records[k];
            if (element.whGoodsId == obj.id) {
              obj.Checked = true;
              continue;
            }
          }
        }
      }
      this.updataCheckAll();
    }, err => {
    })
  }
  /**
   * 根据商品id返回已关联的仓库商品列表
   */
  getGoodsIdList() {
    this.GoodsStockService.getGoodsId(this.entityParam.id).subscribe((res: any) => {
      this.entityParam.whGoodsList = [];
      for (let index = 0; index < res.data.length; index++) {
        const element = res.data[index];
        this.entityParam.whGoodsList.push({
          id: element.id,
          whGoodsId: element.whGoodsId,
          code: element.code,
          attr: element.attr,
          name: element.name,
          count: element.count,
        });
        this.selectGoodsArr = [... this.entityParam.whGoodsList];
      }
    }, err => {
    })
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
