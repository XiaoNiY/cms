import { Component, OnInit, ViewChild, ElementRef } from '@angular/core';
import { CdkDragDrop, moveItemInArray } from '@angular/cdk/drag-drop';
import { NzMessageService } from 'ng-zorro-antd/message';
import { ActivatedRoute, Router } from '@angular/router';
import { forkJoin } from 'rxjs';

import { GoodsSpecarrSaveService } from './goods-specarr-save.service';
@Component({
  selector: 'app-goods-specarr-save',
  templateUrl: './goods-specarr-save.component.html',
  styleUrls: ['./goods-specarr-save.component.scss']
})
export class GoodsSpecarrSaveComponent implements OnInit {
  /**
   * 选择商品模态框
   */
  goodsVisible = false;
  /**
   * 商品列表
   */
  goodsList: any = [];
  /**
   * 商品类型下拉
   */
  GoodsTypeList: any = [];
  /**
   * 商品详情数据(公共)
   */
  detailsData: any = null;
  /**
   * SKU表格数据
   */
  tableData: any = [];
  /**
   * 规格
   */
  specArr: any = [
    {
      name: "",
      inputVisible: false,
      value: [{
        key: "",
      }]
    },
    // {
    //   name: "机型2",
    //   inputVisible: false,
    //   value: [{
    //     key: "iphone12"
    //   }, {
    //     key: "iphone13"
    //   }, {
    //     key: "iphone17"
    //   }]
    // },
  ];
  /**
   * 规格表头
   */
  tableTh: any = [];
  /**
   * 规格td绘制数据
   */
  propertiesArr: any = [];
  /**
   * 商品列表查询条件
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
   * 路由参数 
   */
  routeParams: any = null;
  /**
   * 批量操作
   */
  bulkData = {
    // 库存
    stockNum: null,
    // B端设置 最小购买
    buyMinB: null,
    // B端设置 最大购买
    buyMaxB: null,
    // B端设置 建议零售价
    retailPriceB: null,
    // B端设置 单个售价
    shopPriceB: null,
    // B端设置 单个划线价
    originalPriceB: null,
    // C端设置 最小购买
    buyMinC: null,
    // C端设置 最大购买
    buyMaxC: null,
    // C端设置 单个售价
    shopPriceC: null,
    // C端设置 单个划线价
    originalPriceC: null,
    // B端商户
    selectUserTypeB: true,
    // C端用户
    selectUserTypeC: true,
  }
  /**
   * Input type=file Val
   */
  fileVal = "";
  /**
   * 接口参数
   */
  entityParam: any = {
    id: 0,
    // 规格组名称
    name: '',
    // 备注信息
    note: '',
    // 规格属性，JSON串：[{"name":"机型","value":["iphone12","iphone11"]}]
    properties: '',
    // 在购物车及订单展示的商品主图
    icon: '',
    // 需要解绑的商品id，多个用英文逗号分隔
    delIds: [],
    // 需要关联的商品集合
    list: [],
  }
  // 标识表格SKU是否全部是新的 如果是 则删除SKU列表的数据
  newSKU = true;
  /**
   * 打开模态框索引值
   */
  modaIndex: any = null;
  /**
   * 规格参数输入框对象
   */
  @ViewChild('inputElement', { static: false }) inputElement?: ElementRef;
  /**
   * SKU规格输入框
   */
  inputAttrValue = '';
  /**
   * 全局 loading
   */
  messageId: any = null;
  /**
   * 重置表格定时器
   */
  resetTableTime: any = null;
  /**
   * 加载失败显示图像占位符
   */
  fallback =
    'data:image/png;base64,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';
  constructor(
    private router: Router,
    private activatedRoute: ActivatedRoute,
    private GoodsSpecarrSaveService: GoodsSpecarrSaveService,
    private message: NzMessageService,
  ) { }

  ngOnInit(): void {
    this.activatedRoute.params.subscribe((params) => {
      this.routeParams = params;
      this.entityParam.id = this.routeParams.id;
    })

    if (this.entityParam.id != 0) {
      this.GoodsSpecarrSaveService.details(this.entityParam.id).subscribe((res: any) => {
        this.setDetails(res);
      }, err => {

      });
    }
    this.getGoodsList();
    this.getGoodsTypeList();
    // this.resetTable();
  }
  /**
   * 填充详情
   */
  setDetails(res: any) {
    this.detailsData = res.data;
    // 采购单详情
    let details = res.data;
    let properties = JSON.parse(res.data.properties);


    for (let index = 0; index < this.detailsData.goodsList.length; index++) {
      const element = this.detailsData.goodsList[index];
      element['properties'] = element.skuProperties;
    }
    this.specArr = [];
    this.tableData = [];

    for (let index = 0; index < properties.length; index++) {
      const element = properties[index];
      let value = element.value.split(',');
      let obj: any = {
        name: element.name,
        inputVisible: false,
        value: []
      };
      for (let k = 0; k < value.length; k++) {
        const element = value[k];
        obj.value.push({
          key: element,
        })
      }
      this.specArr.push(obj);
    }
    this.entityParam.id = details.id;
    this.entityParam.name = details.name;
    this.entityParam.note = details.note;
    this.entityParam.icon = details.icon;
    this.resetTable();
  }
  /**
   * 商品保存
   */
  saveGoods(item: any) {
    if (this.messageId != null) {
      return;
    }
    if (item.goods.selectUserTypeB && !item.goods.shopPriceB) {
      return this.createMessage("warning", "请完善B端单个售价");
    } else if (item.goods.selectUserTypeC && !item.goods.shopPriceC) {
      return this.createMessage("warning", "请完善C端单个售价");
    }
    if (!item.disabled) {
      this.createBasicMessage();
      this.GoodsSpecarrSaveService.goodsUpdate(item.goods).subscribe((res: any) => {
        this.removeBasicMessage();
        if (res.code != 0) {
          this.createMessage("error", res.message);
          return;
        }
        this.createMessage("success", res.message);
        item.disabled = true;
      }, err => {
        this.removeBasicMessage();
        this.createMessage("error", err.message);
      });
    } else {
      item.disabled = false;
    }
  }
  /**
   * 商品一键上架
   */
  goodsTop() {
    let goodsUploading = this.tableData.filter((item: any) => { return !item.disabled });
    if (goodsUploading.length == 0) {
      return this.createMessage("warning", "请编辑SKU商品");
    }
    if (this.messageId != null) {
      return;
    }
    // 并联请求
    let postArr = [];

    for (let index = 0; index < this.tableData.length; index++) {
      const element = this.tableData[index];
      if (!element.disabled) {
        postArr.push(this.GoodsSpecarrSaveService.updateStatus({ ids: element.goods.id, status: 1 }).pipe((data) => { return data; }));
      }
    }

    this.createBasicMessage();
    forkJoin(postArr)
      .subscribe((goodsArr: any) => {
        this.removeBasicMessage();
        for (let index = 0; index < this.tableData.length; index++) {
          const element = this.tableData[index];
          element.goods.status = 1;
        }
        if (goodsUploading.length != goodsArr.length) {
          return this.createMessage("warning", (goodsUploading.length - goodsArr.length) + "条上架失败");
        }
        this.createMessage("success", "批量上架成功");
      }, err => {
        this.removeBasicMessage();
        this.createMessage("error", err.message);
      });

    // for (let index = 0; index < this.tableData.length; index++) {
    //   const element = this.tableData[index];
    //   this.goodsSwitch(element, 1);
    // }
  }
  /**
   * 商品一键下架
   */
  boodsBt() {

    let goodsUploading = this.tableData.filter((item: any) => { return !item.disabled });
    if (goodsUploading.length == 0) {
      return this.createMessage("warning", "请编辑SKU商品");
    }
    if (this.messageId != null) {
      return;
    }
    // 并联请求
    let postArr = [];

    for (let index = 0; index < this.tableData.length; index++) {
      const element = this.tableData[index];
      if (!element.disabled) {
        postArr.push(this.GoodsSpecarrSaveService.updateStatus({ ids: element.goods.id, status: 2 }).pipe((data) => { return data; }));
      }
    }

    this.createBasicMessage();
    forkJoin(postArr)
      .subscribe((goodsArr: any) => {
        this.removeBasicMessage();
        for (let index = 0; index < this.tableData.length; index++) {
          const element = this.tableData[index];
          element.goods.status = 2;
        }
        if (goodsUploading.length != goodsArr.length) {
          return this.createMessage("warning", (goodsUploading.length - goodsArr.length) + "条下架失败");
        }
        this.createMessage("success", "批量下架成功");
      }, err => {
        this.removeBasicMessage();
        this.createMessage("error", err.message);
      });

  }
  /**
   * 上下架商品
   */
  goodsSwitch(item: any) {
    if (this.messageId != null) {
      return;
    }
    let stat = item.goods.status == 2 ? 1 : 2;
    this.createBasicMessage();
    this.GoodsSpecarrSaveService.updateStatus({ ids: item.goods.id, status: stat }).subscribe((res: any) => {
      this.removeBasicMessage();
      if (res.code != 0) {
        this.createMessage("error", res.message);
        return;
      }
      if (stat == 1) {
        this.createMessage("success", "商品已成功上架");
      } else {
        this.createMessage("success", "商品已成功下架");
      }
      item.goods.status = stat;
    }, err => {
      this.removeBasicMessage();
      this.createMessage("error", err.message);
    });
  }
  /**
   * 批量保存
   */
  saveAll() {
    let goodsUploading = this.tableData.filter((item: any) => { return !item.disabled });
    if (goodsUploading.length == 0) {
      return this.createMessage("warning", "请编辑SKU商品");
    }
    if (this.messageId != null) {
      return;
    }
    // 并联请求
    let postArr = [];

    for (let index = 0; index < this.tableData.length; index++) {
      const element = this.tableData[index];
      if (element.goods.selectUserTypeB && !element.goods.shopPriceB && !element.disabled) {
        return this.createMessage("warning", "请完善 第" + (index + 1) + "行 B端单个售价");
      } else if (element.goods.selectUserTypeC && !element.goods.shopPriceC && !element.disabled) {
        return this.createMessage("warning", "请完善 第" + (index + 1) + "行 C端单个售价");
      }
      if (!element.disabled) {
        postArr.push(this.GoodsSpecarrSaveService.goodsUpdate(element.goods).pipe((data) => { return data; }));
      }
    }
    this.createBasicMessage();
    forkJoin(postArr)
      .subscribe((goodsArr: any) => {
        this.removeBasicMessage();
        for (let index = 0; index < this.tableData.length; index++) {
          const element = this.tableData[index];
          element.disabled = true;
        }
        if (goodsUploading.length != goodsArr.length) {
          return this.createMessage("warning", (goodsUploading.length - goodsArr.length) + "条保存失败");
        }
        this.createMessage("success", "批量保存成功");
      }, err => {
        this.removeBasicMessage();
        this.createMessage("error", err.message);
      });

  }
  /**
   * 保存
   */
  submitForm() {
    if (this.messageId != null) {
      return;
    }

    if (!this.entityParam.name) {
      return this.createMessage("warning", "标题不能为空");
    }
    let specName = this.specArr.filter((item: any) => { return item.name == "" });
    let specVal = null;

    for (let index = 0; index < this.specArr.length; index++) {
      const element = this.specArr[index];
      specVal = element.value.filter((item: any) => item.key == "");
      if (specVal.length != 0) {
        break
      }
    }
    if (specName.length != 0 || specVal.length != 0) {
      return this.createMessage("warning", "规格值不能为空");
    }
    if (this.tableData.length == 0) {
      return this.createMessage("warning", "请生成SKU表格");
    }
    for (let index = 0; index < this.specArr[0].value.length; index++) {
      const element = this.specArr[0].value[index];
      let tableObj = this.tableData.filter((item: any) => {
        return item.properties.indexOf('{"name":"' + this.specArr[0].name + '","value":"' + element.key + '"}') > -1
      });
      let noGoodsArr = tableObj.filter((item: any) => { return item.goodsId == 0 });
      if (tableObj.length == noGoodsArr.length) {
        return this.createMessage("warning", this.specArr[0].name + "：" + element.key + " 必须绑定一个商品");
      }
    }
    // for (let index = 0; index < this.tableData.length; index++) {
    //   const element = this.tableData[index].goods;
    //   if (element.selectUserTypeB && !element.shopPriceB) {
    //     return this.createMessage("warning", "请完善第 " + (index + 1) + " 行B端单个售价");
    //   } else if (element.selectUserTypeC && !element.shopPriceC) {
    //     return this.createMessage("warning", "请完善第 " + (index + 1) + " 行C端单个售价");
    //   }
    // }
    this.entityParam.delIds = [];
    if (this.detailsData) {
      // 解绑关联商品
      for (let index = 0; index < this.detailsData.goodsList.length; index++) {
        const element = this.detailsData.goodsList[index];
        let tableObj = this.tableData.filter((item: any) => item.goodsId != element.id && item.properties == element.properties);
        let detailsObj = this.tableData.filter((item: any) => element.id && item.properties == element.properties);
        if (tableObj.length != 0) {
          this.entityParam.delIds.push(tableObj[0].id);
        } else if (detailsObj.length == 0) {
          this.entityParam.delIds.push(element.id);
        }
      }
    }

    this.entityParam.list = this.tableData;
    this.entityParam.properties = this.tableTh;

    this.createBasicMessage();
    this.GoodsSpecarrSaveService.save(this.entityParam).subscribe((res: any) => {
      this.removeBasicMessage();
      if (res.code != 0) {
        this.createMessage("error", res.message);
        return;
      }
      this.createMessage("success", "保存成功");
      this.router.navigate(['goods/goodsSpenarr']);
    }, err => {
      this.removeBasicMessage();
      this.createMessage("error", err.message);
    });
  }
  /**
  * 生成SKU表格
  */
  resetTable() {

    for (let index = 0; index < this.specArr.length; index++) {
      const element = this.specArr[index];
      const keyName = element.value.map((item: any) => item.key);
      const keyNameSet = [...new Set(keyName)];
      if (keyNameSet.length != keyName.length) {
        return this.createMessage("warning", "规格参数存在重复");
      }
    }

    this.tableTh = JSON.parse(JSON.stringify(this.specArr));
    let testTable = JSON.parse(JSON.stringify(this.tableData));

    this.propertiesArr = []
    this.tableData = []
    // 总行数
    let totalRow = 1;
    if (this.tableTh && this.tableTh.length > 0) {
      for (let index = 0; index < this.tableTh.length; index++) {
        const element = this.tableTh[index];
        totalRow *= element.value.length;
      }
    }
    //循环处理表体
    for (let i = 0; i < totalRow; i++) {//总共需要创建多少行
      let rowCount = 1;//记录行数
      let propvalnameArr = []; //记录SKU值 
      let propvalnameStr = []; //记录SKU值 转字符串

      for (let j = 0; j < this.tableTh.length; j++) {//sku列
        let skuItem: any = this.tableTh[j];//SKU值数组
        let skuValueLen = this.tableTh[j].value.length;//sku值长度
        rowCount = (rowCount * skuValueLen);//目前的生成的总行数
        let anInterBankNum = (totalRow / rowCount);//跨行数
        let point: any = ((i / anInterBankNum) % skuValueLen);
        let itemObj: any = {};
        let itemArr: any = {};
        if (0 == (i % anInterBankNum)) { //需要创建td
          // itemObj.id = parseInt(skuItem.id) || 0;
          itemObj.name = skuItem.name;
          itemObj.value = skuItem.value[point].key;

          itemArr['name'] = skuItem.value[point];
          itemArr['rowspan'] = anInterBankNum;
          propvalnameStr.push(itemObj);
          propvalnameArr.push(itemArr);
        } else {
          // itemObj.id = parseInt(skuItem.id) || 0;
          itemObj.name = skuItem.name;
          itemObj.value = skuItem.value[parseInt(point)].key;

          itemArr['name'] = skuItem.value[point];
          propvalnameStr.push(itemObj);
          propvalnameArr.push(itemArr);
        }
      }
      this.propertiesArr.push(propvalnameArr);
      let obj = this.setSku();
      obj.properties = JSON.stringify(propvalnameStr);
      // 判断是否有相同的SKU 有就合并数据
      if (this.detailsData) {
        obj = this.setSku(this.mergeSku(this.detailsData.goodsList, obj));
      }

      obj.properties = JSON.stringify(propvalnameStr);
      this.tableData.push(obj);
    }
    testTable = testTable.filter((item: any) => item.goodsId != 0);
    // console.log(testTable);
    for (let index = 0; index < this.tableData.length; index++) {
      let element = this.tableData[index];
      let obj = this.mergeSku(testTable, element);
      if (obj) {
        this.tableData[index] = obj;
      }
    }
    console.log(this.tableData);
  }
  /**
   * 规格参数输入回调
   */
  paramChang() {
    clearTimeout(this.resetTableTime);
    this.resetTableTime = setTimeout(() => {
      this.resetTable();
    }, 200);
  }
  /**
   * 请求SKU列表数据 和 本地SKU列表数据 合并
   */
  mergeSku(skuList: any, item: any) {
    for (let index = 0; index < skuList.length; index++) {
      const element = skuList[index];
      if (element.properties == item.properties) {
        return element;
      }
    }
  }
  /**
   * 文件上传完成回调
   * @param files 
   */
  handleFileInput(files: any) {
    let fileArr = files.target.files;
    console.log(files.target.files);
    for (let index = 0; index < fileArr.length; index++) {
      const element = fileArr[index];
      this.postFile(element, (res: any) => {
        if (res.code != 0) {
          return;
        }
        this.entityParam.icon = res.data;
      });
    }
  }
  /**
   * 显示参数输入框
   */
  showInput(item: any): void {
    item.inputVisible = true;
    setTimeout(() => {
      this.inputElement?.nativeElement.focus();
    }, 10);
  }
  /**
   * 删除图片
   */

  deleteImg() {
    this.entityParam.icon = "";
    this.fileVal = "";
  }

  /**
   * 批量填写
   */
  batchWrite() {
    let goodsUploading = this.tableData.filter((item: any) => { return !item.disabled });
    if (goodsUploading.length == 0) {
      return this.createMessage("warning", "请编辑SKU商品");
    }

    for (let index = 0; index < this.tableData.length; index++) {
      const element = this.tableData[index].goods;
      if (!this.tableData[index].disabled) {
        if (this.bulkData.stockNum) {
          element.stockNum = this.bulkData.stockNum;
        }
        if (this.bulkData.buyMinB) {
          element.buyMinB = this.bulkData.buyMinB;
        }
        if (this.bulkData.buyMaxB) {
          element.buyMaxB = this.bulkData.buyMaxB;
        }
        if (this.bulkData.retailPriceB) {
          element.retailPriceB = this.bulkData.retailPriceB;
        }
        if (this.bulkData.shopPriceB) {
          element.shopPriceB = this.bulkData.shopPriceB;
        }
        if (this.bulkData.originalPriceB) {
          element.originalPriceB = this.bulkData.originalPriceB;
        }
        if (this.bulkData.buyMinC) {
          element.buyMinC = this.bulkData.buyMinC;
        }
        if (this.bulkData.buyMaxC) {
          element.buyMaxC = this.bulkData.buyMaxC;
        }
        if (this.bulkData.shopPriceC) {
          element.shopPriceC = this.bulkData.shopPriceC;
        }
        if (this.bulkData.originalPriceC) {
          element.originalPriceC = this.bulkData.originalPriceC;
        }
        element.selectUserTypeB = this.bulkData.selectUserTypeB;
        element.selectUserTypeC = this.bulkData.selectUserTypeC;
      }
    }
  }
  /**
   * 打开模态框
   */
  showModal(index: any) {
    this.modaIndex = index;
    if (this.tableData[index].goodsId == 0) {
      this.goodsVisible = true;
      this.getGoodsList();
    } else {
      // 解绑
      // let i = this.goodsList.records.findIndex((item: any) => item.id == this.tableData[index].goodsId);
      // if (i > -1) {
      //   this.goodsList.records[i].skuGroupId = 0;
      // }

      this.tableData[index].goodsId = 0;
      this.tableData[index].goods = {};
    }
  }
  /**
   * 关闭模态框
   */
  handleCancel() {
    this.goodsVisible = false;
  }
  /**
   * 规格拖拽
   * @param event 
   */
  dropSpec(event: CdkDragDrop<string[]>) {
    moveItemInArray(this.specArr, event.previousIndex, event.currentIndex);
  }
  /**
   * 参数拖拽
   * @param event 
   */
  dropSpecItem(fid: any, event: CdkDragDrop<string[]>) {
    moveItemInArray(this.specArr[fid].value, event.previousIndex, event.currentIndex);
  }
  /**
   * 添加规格
   */
  addSpec() {
    this.specArr.push(
      {
        name: "",
        inputVisible: false,
        value: [{
          key: ""
        }]
      });
  }
  /**
   * 删除规格 
   */
  delSpec(index: any) {
    this.specArr = this.specArr.filter((item: any, key: any) => {
      return key != index;
    });
  }
  /**
   * 添加规格参数
   */
  addSpecItem(index: any) {
    this.newSKU = true;
    this.specArr[index].value.push({ key: "" });
  }
  /**
   * 删除规格参数
   */
  specItemDelete(index: any, tagStr: any) {
    this.specArr[index].value = this.specArr[index].value.filter((item: any) => item.key !== tagStr);
    this.resetTable();
  }
  /**
   * SKU规格输入框取消焦点
   */
  handleInputConfirm(index: any): void {
    if (this.inputAttrValue && this.specArr[index].value.indexOf(this.inputAttrValue) === -1) {
      this.specArr[index].value = [...this.specArr[index].value, this.inputAttrValue];
    }
    this.inputAttrValue = '';
    this.specArr[index].inputVisible = false;
  }
  /**
   * 绑定商品
   */
  bindGoods(item: any) {
    let tableItem = this.tableData[this.modaIndex];
    tableItem.goodsId = item.id;
    tableItem.goods = this.setSku(item).goods;

    if (tableItem.goods.userType == 0) {
      tableItem.goods.selectUserTypeB = true;
      tableItem.goods.selectUserTypeC = true;
    } else if (item.userType == 1) {
      tableItem.goods.selectUserTypeB = true;
    } else if (item.userType == 2) {
      tableItem.goods.selectUserTypeC = true;
    }

    // 本地标识已绑商品
    item.skuGroupId = 1;
    console.log(this.tableData);
    this.handleCancel()
  }
  /**
   * 页码改变
   * @param index 
   */
  onPageIndexChange(index: number) {
    console.log(index);
    this.queryForm.current = index;
    this.getGoodsList();
  }
  /**
   * 每页条数改变的回调
   * @param index 
   */
  onPageSizeChange(index: number) {
    this.queryForm.size = index;
    this.getGoodsList();
  }
  /**
   * 上传文件
   * @param su 上传完成回调函数
   */
  postFile(file: any, su: any) {
    this.GoodsSpecarrSaveService.postFile(file).subscribe(data => {
      if (su) su(data);
    }, error => {

    });
  }
  /**
   * 商品列表
   */
  getGoodsList() {
    this.GoodsSpecarrSaveService.getGoodsList(this.queryForm).subscribe(res => {
      let nullArr = this.tableData.filter((item: any) => item.id == null);

      // 表格是否全部重置
      if (nullArr.length == this.tableData.length && this.detailsData) {
        for (let index = 0; index < this.detailsData.goodsList.length; index++) {
          const element = this.detailsData.goodsList[index];
          let i = res.data.records.findIndex((item: any) => item.id == element.id);
          if (i > -1) {
            res.data.records[i].skuGroupId = 0;
          }
        }
      }
      // 解绑商品
      for (let index = 0; index < this.tableData.length; index++) {
        const element = this.tableData[index];
        let k = res.data.records.findIndex((item: any) => item.id == element.id);
        if (k > -1) {
          res.data.records[k].skuGroupId = 0;
        }
      }
      if(this.detailsData){
        for (let index = 0; index < this.detailsData.goodsList.length; index++) {
          const element = this.detailsData.goodsList[index];
          let i = res.data.records.findIndex((item: any) => item.id == element.id);
          let bindObj = this.tableData.findIndex((item: any) => item.id && item.id == element.id);
          if (bindObj > -1) {
            continue;
          }
          if (i > -1) {
            res.data.records[i].skuGroupId = 0;
          }
        }
      }
      // 已绑定商品
      let bindArr = this.tableData.filter((item: any) => item.goodsId);
      console.log(bindArr);
      for (let index = 0; index < bindArr.length; index++) {
        const element = bindArr[index];
        // 列表已有绑定商品
        let i = res.data.records.findIndex((item: any) => item.id == element.goodsId);
        if (i > -1) {
          res.data.records[i].skuGroupId = 1;
        }
      }
      this.goodsList = res.data;
    }, error => {

    });
  }
  /**
   * 商品分类下拉
   */
  getGoodsTypeList() {
    this.GoodsSpecarrSaveService.getGoodsTypeList().subscribe((res: any) => {
      this.GoodsTypeList = res.data;
    }, err => {
    });
  }
  /**
   * 设置SKU对象结构
   */
  setSku(item: any = {}) {
    let obj: any = {};

    obj.id = item.id || null;
    // 仓库商品
    obj.goodsId = item.goodsId ? item.goodsId : item.id ? item.id : 0;
    // 关联商品
    obj.goods = {
      id: item.id || null,
      // 商品图片
      icon: item.icon || null,
      // 商品名称
      name: item.name || null,

      // 库存
      stockNum: item.stockNum || null,
      // B端设置 最大购买
      buyMaxB: item.buyMaxB || null,
      // B端设置 最小购买
      buyMinB: item.buyMinB || null,
      // B端设置 建议零售价
      retailPriceB: item.retailPriceB || null,
      // B端设置 单个划线价
      originalPriceB: item.originalPriceB || null,
      // B端设置 单个售价
      shopPriceB: item.shopPriceB || null,

      // C端设置 最大购买
      buyMaxC: item.buyMaxC || null,
      // C端设置 最小购买
      buyMinC: item.buyMinC || null,
      // C端设置 单个划线价
      originalPriceC: item.originalPriceC || null,
      // C端设置 单个售价
      shopPriceC: item.shopPriceC || null,
      // C端设置 适用用户
      userType: item.userType || 0,

      // B端商户
      selectUserTypeB: false,
      // C端用户
      selectUserTypeC: false,

      // 上下架 1:上架 2:未上架
      status: item.status ? item.status : 2,
    }

    if (item.userType == 0) {
      obj.goods.selectUserTypeB = true;
      obj.goods.selectUserTypeC = true;
    } else if (item.userType == 1) {
      obj.goods.selectUserTypeB = true;
    } else if (item.userType == 2) {
      obj.goods.selectUserTypeC = true;
    }
    // 是否可以编辑
    obj.disabled = item ? false : true;
    return obj;
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
