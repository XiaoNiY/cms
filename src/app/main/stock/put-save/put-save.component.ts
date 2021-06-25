import { Component, OnInit } from '@angular/core';
import { NzMessageService } from 'ng-zorro-antd/message';
import { ActivatedRoute, Router } from '@angular/router';
import { forkJoin, from } from 'rxjs';

import { PutSaveService } from './put-save.service';
import { PurchasePlanApplyService } from '../purchase-plan-apply/purchase-plan-apply.service'
import { PurchaseOrderAddService } from '../purchase-order-add/purchase-order-add.service'

@Component({
  selector: 'app-put-save',
  templateUrl: './put-save.component.html',
  styleUrls: ['./put-save.component.scss']
})

export class PutSaveComponent implements OnInit {
  /**
  * 是否显示骨架屏
  */
  skeletonActive = true;
  /**
   * 路由参数 copy:复制 create:生成订单 number:订单号
   */
  routeParams: any = null;
  // 路由参数支持多参数
  routeQueryParams: any = {}
  /**
   * 采购申请单 列表数据
   */
  PurchaseTable: any = null;
  /**
   * 申请采购列表数据
   */
  addPurchaseTable: any = [];
  /**
   * 采购单参数
   */
  warehousing: any = {
    id: 0,
    // 入库单号
    warehousingNumber: "",
    // 采购单号
    purchaseNumber: "",
    // 仓库id
    whPutId: "",
    // 备注
    remark: "",
    // 状态(0 草稿 1 全部 2 已通知 3 已完成 4 已关闭)
    state: 0,
    // 入库类型(1、采购入库 2、售后入库  3、不良品返厂 4、坏件入库 5、代售入库)
    type: 1,
    // 入库合计
    storageTotal: ''
  }
  /**
   * 采购单查询
   */
  PurchaseList: any = [];
  /**
   * 采购单查询(获取id专用)
   */
  PurchaseListFilter: any = [];
  /**
   * 仓库商品列表
   */
  WhList: any = [];

  // 弹窗展示变量
  isVisible: boolean = false;
  /**
  * 已选择仓库商品(临时存放)
  */
  selectGoodsArr: any = [];
  /**
  * 供应商列表 数据
  */
  supplierList: any = [];
  /**
    * 查询load动画
  */
  isLoadingOne = false;
  /**
  * 表格是否加载中
  */
  tableLoading: any = false;
  /**
  * 查询参数
  */
  queryForm: any = {
    // 商品
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
  * 当前是否在搜索
  */
  searchHint = false;
  /**
  * 弹窗列表数据源
  */
  listOfData?: any;
  /**
  * 当前搜索name
  */
  searchName = "";
  /**
  * 复选框
  */
  checked = false;
  messageId: any = null;
  // 定时器
  time: any = null
  // 入库类型集合
  storageTypeList: any = [
    { value: 3, text: '不良品返厂' },
    { value: 4, text: '坏件入库' },
    { value: 5, text: '代售入库' }
  ]
  // 入库品质
  qualityList: any = [
    { value: 'RW', text: '待返工品' },
    { value: 'QA', text: '待确认品' },
    { value: 'DM', text: '不良品' },
    { value: 'NR', text: '良品' },
  ]

  constructor(
    private router: Router,
    private activatedRoute: ActivatedRoute,
    private PutSaveService: PutSaveService,
    private PurchasePlanApplyService: PurchasePlanApplyService,
    private PurchaseOrderAddService: PurchaseOrderAddService,
    private message: NzMessageService
  ) { }


  ngOnInit(): void {

    this.activatedRoute.params.subscribe((params) => {
      this.routeParams = params;
      this.warehousing.id = params.id;
    })
    this.activatedRoute.queryParams.subscribe((params) => {
      this.routeQueryParams = params || {};
    })
    // 并联请求
    let postArr = [];
    postArr.push(this.PutSaveService.getPurchaseList()
      .pipe((data) => {
        return data;
      }));
    postArr.push(this.PutSaveService.getWhList()
      .pipe((data) => {
        return data;
      }));
    if (this.warehousing.id != 0) {
      postArr.push(this.PutSaveService.details(this.warehousing.id)
        .pipe((data) => {
          return data;
        }));
    }
    forkJoin(postArr)
      .subscribe((data: any) => {
        // 采购单查询
        let PurchaseList = data[0];
        // 仓库商品列表
        let WhList = data[1];
        // 入库单详情
        let details = data[2];
        this.PurchaseList = PurchaseList.data.records.filter(function (item: any) { return item.state == 2 || item.state == 4; });
        this.PurchaseListFilter = PurchaseList.data.records;

        this.WhList = WhList.data.records.filter(function (item: any) { return item.state == 1 });

        if (details) {
          this.setDetails(details);
        }
        if (this.routeQueryParams.entrance === 'edit') {
          this.setStorageTotal()
        }
        if (this.routeParams.type == "create") {
          this.warehousing.purchaseNumber = this.routeParams.number;
          this.selectPurchase(this.routeParams.number);
        }
        this.skeletonActive = false;
      }, err => {
      });
    if (this.routeQueryParams.entrance) { // 直接入库 请求甲乙方列表数据
      this.PurchaseOrderAddService.getSupplierList().subscribe((res: any) => {
        const { data } = res
        const { records = [] } = data || {}
        if (records) {
          this.supplierList = records.filter(function (item: any) { return item.state == 1; })
        }
      })
    }

  }
  /**
    * 设置详情数据
    */
  setDetails(res: any) {
    const { entrance } = this.routeQueryParams
    const { data } = res
    const { list = [], warehousing = {} } = data || {}
    const { warehousingNumber = "", purchaseNumber = "", whPutId, remark, state, type } = warehousing || {}
    this.warehousing.warehousingNumber = warehousingNumber;
    this.warehousing.purchaseNumber = purchaseNumber;
    this.warehousing.whPutId = whPutId;
    this.warehousing.remark = remark;
    this.warehousing.state = state;
    this.warehousing.type = type;
    this.selectPurchase(this.warehousing.purchaseNumber);
    if (entrance !== 'save') { // 不等于1说明不是从直接入库按钮入口进来table不需要初始化数据
      this.addPurchaseTable = list;
    }
    for (let index = 0; index < this.addPurchaseTable.length; index++) {
      const element = this.addPurchaseTable[index];
      element.isDelete = 0;
    }
  }

  /**
   * 添加采购
   * @param item 
   */
  addBuyer(item: any) {
    const index = this.addPurchaseTable.findIndex((obj: any) => obj.planDetailsId === item.id);
    if (item.isShow) {
      item.isShow = 0;

      if (index > -1 && !this.addPurchaseTable[index].id) {
        this.addPurchaseTable.splice(index, 1)
      } else {
        this.addPurchaseTable[index].isDelete = 1;
      }
    } else {
      item.isShow = 1;
      if (this.addPurchaseTable.length == 0 || index == -1) {
        let obj = { ...item };
        obj.planDetailsId = obj.id;
        obj.isDelete = 0;
        // 新建入库单 默认待入库
        obj.state = 0;
        obj.number = obj.maxStockNumber
        delete obj.id;
        this.addPurchaseTable.push(obj);
      } else {
        this.addPurchaseTable[index].isDelete = 0;
      }
    }
  }
  /**
   * 取消采购
   * @param item 
   */
  delBuyer(item: any) {
    if (!item.id) {
      const index = this.addPurchaseTable.findIndex((obj: any) => obj.id === item.id);
      index > -1 && this.addPurchaseTable.splice(index, 1)
    } else {
      item.isDelete = 1;
    }
    let obj: any = this.PurchaseTable.list.filter(function (items: any) { return items.id === item.planDetailsId });
    if (obj.length >= 1) { obj[0].isShow = 0 }
  }
  /**
   * 全部入库
   */
  selectAll() {
    for (let index = 0; index < this.PurchaseTable.list.length; index++) {
      const element = this.PurchaseTable.list[index];
      if (element.isShow == 0) {
        this.addBuyer(element);
      }

    }
  }
  /**
   * 清空已选
   */
  clearAll() {
    for (let index = 0; index < this.addPurchaseTable.length; index++) {
      const element = this.addPurchaseTable[index];
      this.delBuyer(element);
    }
  }
  /**
   * 保存
   * @param state  (0 草稿 1待审核 2审核通过 3审核不通过 4入库中 5已完成 6已关闭)
   */
  save(state: any) {
    const { id, type } = this.warehousing
    const { entrance } = this.routeQueryParams
    if (id == 0 && !this.warehousing.purchaseNumber) {
      return this.createMessage("warning", "请选择采购单号");
    }
    if (!this.warehousing.whPutId) {
      return this.createMessage("warning", "请选择仓库");
    }
    if (id == 1 && !type) {
      return this.createMessage("warning", "请选择入库类型");
    }
    if (this.addPurchaseTable.length == 0) {
      return this.createMessage("warning", "请选择入库内容");
    }
    for (let index = 0; index < this.addPurchaseTable.length; index++) {
      const element = this.addPurchaseTable[index];
      if (!element.number) {
        this.createMessage("warning", "入库数量不能为空");
        return;
      }
    }
    const isQualityBlank = this.addPurchaseTable.every((item: any) => { return item.quality })
    if (entrance && !isQualityBlank) {
      return this.createMessage("warning", "品质不能为空");
    }
    if (this.messageId != null) {
      return;
    }
    this.warehousing.state = state;
    const copyList = JSON.parse(JSON.stringify(this.addPurchaseTable))
    copyList && copyList.forEach((element: any) => {// 清除冻结数量防止后端入库出现bug
      element.frozenNumber = ''
      element.planFrozenNumber = ''
    });
    let json = {
      warehousing: this.warehousing,
      list: copyList
    }
    this.createBasicMessage();
    if (id == 0 || (id == 1 && entrance === 'save')) {
      delete this.warehousing.id;
      delete json.warehousing.warehousingNumber;

      this.PutSaveService.save(json).subscribe((res: any) => {
        this.removeBasicMessage();
        if (res.code != 0) {
          this.createMessage("error", res.message);
          return;
        }
        this.createMessage("success", res.message);
        this.toPage()
      }, err => {
        this.removeBasicMessage();
        this.createMessage("error", err.message);
      })
    } else {
      this.PutSaveService.update(json).subscribe((res: any) => {
        this.removeBasicMessage();
        if (res.code != 0) {
          this.createMessage("error", res.message);
          return;
        }
        this.createMessage("success", res.message);
        this.toPage()
      }, err => {
        this.removeBasicMessage();
        this.createMessage("error", err.message);
      })
    }
  }
  // 防止跳页面后，后端数据没有及时更新，
  toPage() {
   this.time = setTimeout(() => {
      this.router.navigate(['stock/put']);
      clearTimeout(this.time)
    }, 500);
  }
  /**
   * 采购单选择回调
   * @param id 
   */
  selectPurchase(purchaseNumber: any) {
    try {
      let id = this.PurchaseListFilter.filter(function (item: any) { return item.purchaseNumber == purchaseNumber })[0].id
      this.getPurchaseDetails(id);
    } catch (error) {

    }
  }
  /**
   * 入库单详情
   * @param id 
   */
  getPurchaseDetails(id: any) {
    this.PutSaveService.getPurchaseDetails(id).subscribe((res: any) => {
      this.PurchaseTable = res.data;
      this.PurchaseTable.list = this.PurchaseTable.list.filter(function (item: any) { return item.state != -1 });
      // 
      for (let index = 0; index < this.PurchaseTable.list.length; index++) {
        const element = this.PurchaseTable.list[index];
        element.isShow = 0;
      }
      if (this.addPurchaseTable.length >= 0) {
        for (let index = 0; index < this.addPurchaseTable.length; index++) {
          const element = this.addPurchaseTable[index];
          let obj: any = this.PurchaseTable.list.filter(function (items: any) { return items.id === element.planDetailsId })[0];
          if (obj) {
            obj.isShow = 1;
          }
        }
      }
    }, err => {
    })
  }
  /**
   * 状态转文字
   */
  state_to_text(s: any) {
    let test = "";
    switch (s) {
      case 0:
        test = "入库";
        break;
      case 1:
        test = "已手动关闭";
        break;
      case 2:
        test = "已完成入库";
        break;
      case 3:
        test = "入库";
        break;
      default:
        test = "-";
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
  showModal() {
    this.checked = false;
    this.isVisible = true;
    this.selectGoodsArr = JSON.parse(JSON.stringify(this.addPurchaseTable))
    this.getWhGoodsList();
  }
  handleCancel() {
    this.isVisible = false;
  }
  // 申请已选商品
  sendRequest() {
    if (this.selectGoodsArr.length == 0) {
      return this.createMessage('warning', '请至少选择1件商品');
    }
    let sumNum = 0;
    let addNum = 0;
    this.addPurchaseTable = [];
    for (let index = 0; index < this.selectGoodsArr.length; index++) {
      const element = this.selectGoodsArr[index];
      sumNum++;
      let goodsIndex = this.addPurchaseTable.findIndex((obj: any, i: any) => {
        return obj.whGoodsId == element.whGoodsId;
      });
      if (goodsIndex == -1) {
        addNum++;
        this.addPurchaseTable.push(element);
      }
    }
    this.setStorageTotal()
    return this.createMessage('success', '勾选' + sumNum + "件商品，成功添加" + addNum + "件商品");
  }
  query() {
    this.isLoadingOne = true;

    let reg = /^[+]{0,1}(\d+)$/;
    if (!reg.test(this.queryForm.lineupNumber) == null && !reg.test(this.queryForm.lineupNumber)) {
      this.createMessage('warning', '请输入排队数量且为整数');
      return;
    }
    if (!reg.test(this.queryForm.stock) == null && !reg.test(this.queryForm.stock)) {
      this.createMessage('warning', '请输入实际库存且为整数');
      return;
    }
    if (!reg.test(this.queryForm.oversoldNumber) == null && !reg.test(this.queryForm.oversoldNumber)) {
      this.createMessage('warning', '请输入超卖数量且为整数');
      return;
    }
    this.searchHint = true;
    this.getWhGoodsList();
  }
  getWhGoodsList() {
    this.PurchasePlanApplyService.whGetList(this.queryForm).subscribe((res: any) => {
      res.data.records.forEach((element: any) => {
        element['checked'] = false;
      });
      this.listOfData = res.data;
      this.searchName = this.queryForm.whGood;

      this.checked = false;
      if (this.selectGoodsArr.length != 0) {
        for (let index = 0; index < this.selectGoodsArr.length; index++) {
          const element = this.selectGoodsArr[index];
          for (let k = 0; k < this.listOfData.records.length; k++) {
            const obj = this.listOfData.records[k];
            if (element.whGoodsId == obj.id) {
              obj.checked = true;
              continue;
            }
          }
        }
      }
      this.tableLoading = false;
      this.updateCheckAll();
    }, err => {
      this.tableLoading = false;
    });
  }
  // 判断item是否全部选择
  updateCheckAll() {
    const index = this.listOfData.records.findIndex((item: { checked: boolean; }) => item.checked == false);
    console.log(index);
    if (index != -1) {
      this.checked = false;
    } else {
      this.checked = true;
    }
  }
  // 全选
  onAllChecked(value: boolean): void {
    let listsData = this.listOfData.records;
    listsData.forEach((item: { checked: boolean; }) => item.checked = value);
    for (let index = 0; index < listsData.length; index++) {
      const element = listsData[index];
      this.selectGoodsArr = this.selectGoodsArr.filter((item: any) => item.whGoodsId !== element.id)
    }
    for (let index = 0; index < listsData.length; index++) {
      const element = listsData[index];
      if (element.checked) {
        this.selectGoodsArr.push({
          // 计划数量
          planNumber: element.planNumber,
          // 状态 (0 部分采购 1 已关闭 2 采购完成 3 采购中)
          state: 3,
          // 期望交货日期
          deliveryTime: element.deliveryTime,
          // 最迟交货日志
          endDeliveryTime: element.endDeliveryTime,
          // 仓库商品id
          whGoodsId: element.id,
          // 完成或关闭时间
          endTime: element.endTime,
          // 审核意见
          auditDesc: element.auditDesc,
          // 商品名称
          name: element.name,
          // 69码
          code: element.code,
          // 商品规格
          attr: element.attr,
          //标准采购价 (含税)
          standardCostPrice: element.standardCostPrice,
          // 临时
          temp: 0,
          // 是否删除删除(0表示不删除 1表示删除)
          isDelete: 0,
        });
      }
    }
    console.log(value);
  }
  // item单选
  onItemChecked(id: number, checked: boolean): void {
    console.log("id:" + id + ",checked:" + checked);
    const index = this.listOfData.records.findIndex((item: { id: number; }) => item.id === id);
    // this.listOfData.records[index].checked = checked;
    let element = this.listOfData.records[index];
    element.checked = checked;
    if (checked) {
      this.selectGoodsArr.push({
        // id: element.id,
        // 采购计划id
        // 计划数量
        planNumber: element.planNumber,
        // 状态 (0 部分采购 1 已关闭 2 采购完成 3 采购中)
        state: 0,
        // 期望交货日期
        deliveryTime: element.deliveryTime,
        // 最迟交货日志
        endDeliveryTime: element.endDeliveryTime,
        // 仓库商品id
        whGoodsId: element.id,
        // 完成或关闭时间
        endTime: element.endTime,
        // 审核意见
        auditDesc: element.auditDesc,
        // 商品名称
        name: element.name,
        // 69码
        code: element.code,
        // 商品规格
        attr: element.attr,
        //标准采购价 (含税)
        standardCostPrice: element.standardCostPrice,
        // 临时
        temp: 0,
        // 是否删除删除(0表示不删除 1表示删除)
        isDelete: 0,
      })
    } else {
      this.selectGoodsArr = this.selectGoodsArr.filter((item: any) => item.whGoodsId !== id);
    }
    this.updateCheckAll();
  }
  /**
     * 搜索返回原列表
     */
  backList() {
    this.queryForm.whGood = "";
    this.queryForm.lineupNumber = "";
    this.queryForm.stock = "";
    this.queryForm.oversoldNumber = "";
    this.queryForm.page = 1;
    this.searchHint = false;
    this.getWhGoodsList();
  }
  // 在这里做入库数量总合计算
  onBlurStoragenNum() {
    this.setStorageTotal()
  }
  // 入库数量累加
  setStorageTotal() {
    this.warehousing.storageTotal = 0
    this.addPurchaseTable && this.addPurchaseTable.forEach((item: any) => {
      const { number } = item
      if (number) {
        this.warehousing.storageTotal += ~~number
      }
    });
  }
  // 删除当前表格item数据
  onDelete(index: number, item: any) {
    item.isDelete = 1
    const { entrance } = this.routeQueryParams
    if (entrance === 'edit') { // 从查看入口进来只需要大标记即可
      return
    }
    this.addPurchaseTable.splice(index, 1)
  }
  /**
     * 页码改变
     * @param index 页码数
     */
  onPageIndexChange(index: Number) {
    console.log(index);
    this.queryForm.page = index;
    this.getWhGoodsList();
  }
  /**
   * 每页条数改变的回调
   * @param index 页码数
   */
  onPageSizeChange(index: Number) {
    this.queryForm.pageSize = index;
    this.getWhGoodsList();
    console.log(index);
  }
}
