import { Component, OnInit, ViewChild, ElementRef } from '@angular/core';
import { NzMessageService } from 'ng-zorro-antd/message';
import { NzUploadFile } from 'ng-zorro-antd/upload';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { GoodsTabsService } from '../goods-tabs/goods-tabs.service';
import { Global } from '../../../shared/global';
import { forkJoin } from 'rxjs';

function getBase64(file: File): Promise<string | ArrayBuffer | null> {
  return new Promise((resolve, reject) => {
    const reader = new FileReader();
    reader.readAsDataURL(file);
    reader.onload = () => resolve(reader.result);
    reader.onerror = error => reject(error);
  });
}


import { GoodsSpecService } from './goods-spec.service';
@Component({
  selector: 'app-goods-spec',
  templateUrl: './goods-spec.component.html',
  styleUrls: ['./goods-spec.component.scss']
})
export class GoodsSpecComponent implements OnInit {
  /**
   * FTP预览地址( 原图 )
   */
  // FTP_SHOW_URL_ORIGINAL = "";
  /**
   * 商品详情数据(公共)
   */
  detailsData: any = null;
  // 是否多规格
  attrCheck = true;
  // 模态框存储对象
  modalJson: any = {}
  // SKU添加参数 下拉
  attrParamr: any = [];
  // SKU添加参数 是否显示输入框 1：只能选择一个 隐藏输入框 2:多选 显示输入框
  canWrite = 2;
  // 规格模态框 Title
  attrModalTitle: any = ""
  // 模态框显示 or 隐藏
  isVisible = false;
  attrModal = false;
  whgoodsModal = false;
  // 属性分类下拉
  goodsTypesArr: any = []
  // 属性分类下拉(规格)
  goodsAttrArr: any = []
  // 模态框表单
  modalAttrForm!: FormGroup;
  // 库存模态框
  whgoodsForm!: FormGroup;

  saveAllDisabled = true;

  // 手动输入SKU参数值
  inputAttrValue = '';
  // 已选择属性分类
  selectAttr = null;
  // 图片加载失败base64
  fallback =
    'data:image/png;base64,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';
  // 标识表格SKU是否全部是新的 如果是 则删除SKU列表的数据
  newSKU = true;
  // 临时存放规格参数删除的属性
  attrDeleteArr: any = [];

  // 仓库下拉
  whgoodsArr: any = []
  // 全部保存 加载中状态
  saveAllLoading = false;

  /**
   * 规格参数输入框对象
   */
  @ViewChild('inputElement', { static: false }) inputElement?: ElementRef;

  /**
   * 阶梯价格列表
   */
  dataModal: any = [];

  /**
   * SKU
   */
  skuArr: any = [
    // {
    //   key: "机型",
    //   inputVisible: false,
    //   val: ["iphone12", "iphone13"]
    // },
  ];
  /**
   * 表格表头
   */
  tableTh: any = [];
  /**
   * SKU本地列表数据
   */
  tableData: any = [];
  /**
   * 请求SKU列表数据
   */
  resData: any = [];
  /**
   * 合并规格数据
   */
  propertiesArr: any = [];
  /**
   * 模态框存储对象 
   */
  objModal: any = {}
  /**
   * 待删除的阶梯价格
   */
  ladderDeleteArr: any = [];
  /**
   * 批量操作
   */
  bulkData = {
    // 预警值
    warnSkuNum: null,
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
    selectUserTypeB: null,
    // C端用户
    selectUserTypeC: null,
    // 上下架 1:上架 2:未上架
    status: 2,
    // 阶梯价格个数
    bulkData: 0,
  }
  /**
   * 上传完成回调
   * @param info 
   * @param index 
   */
  // handleChange(info: { file: NzUploadFile }, index: any): void {
  //   switch (info.file.status) {
  //     case 'done':
  //       this.tableData[index].icon = info.file.response.data.url;
  //       this.tableData[index].iconShow = this.FTP_SHOW_URL_ORIGINAL + info.file.response.data.url;
  //       break;
  //     case 'error':
  //       this.createMessage("error", "图片上传失败");
  //       break;
  //   }
  // }

  /**
   * 跳转新标签页
   * @param file 
   */
  nzDownloads = async (file: NzUploadFile) => {
    window.open(file.response.data.showUrl);
  }
  constructor(
    private fb: FormBuilder,
    private GoodsSpecService: GoodsSpecService,
    private GoodsTabsService: GoodsTabsService,
    private message: NzMessageService
  ) { }

  ngOnInit(): void {
    // this.FTP_SHOW_URL_ORIGINAL = Global.dictData.filter((item: any) => {
    //   return item.dictKey == "FTP_SHOW_URL_ORIGINAL";
    // })[0].content;

    this.GoodsTabsService.updateFun = () => {
      this.detailsData = this.GoodsTabsService.detailsData;
    }
    this.detailsData = this.GoodsTabsService.detailsData;

    this.forkJoinHtpp();
    this.getWhgoods();
    this.getGoodsTypes();
    this.whgoodsForm = this.fb.group({
      // 当前规格id
      id: [null],
      // 当前分类Id
      number: [null],
    });
    this.modalAttrForm = this.fb.group({
      // 当前规格id
      id: [null],
      // 当前分类Id
      attrId: [null],
      //  已选择下拉
      selectStr: [null],
      attrVal: [null],
    });
  }

  /**
   * 文件上传完成回调
   * @param files 
   * @param index 下标
   */
  handleFileInput(files: any,index:any) {
    let fileArr = files.target.files;
    console.log(files.target.files);

    for (let index = 0; index < fileArr.length; index++) {
      const element = fileArr[index];
      this.postFile(element, (res: any) => {
        if (res.code != 0) {
          this.createMessage("error", res.message);
          return;
        }
        this.tableData[index].icon = res.data;
        this.tableData[index].iconShow = res.data;
      });
    }
  }
  /**
   * 单 多规格切换
   */
  clickAttr() {
    this.resetTbeles();
  }

  /**
   * 重构表格
   */
  resetTbeles() {
    // 多规格情况下
    if (this.attrCheck) {
      let item = this.skuArr.filter((item: any) => { return item.val.length == 0 });
      if (item.length != 0) {
        this.createMessage("warning", "自动生成失败,参数值不能为空");
        return;
      }
      this.tableTh = this.skuArr;
    } else {
      this.tableTh = [];
    }
    this.tableData = [];
    this.propertiesArr = [];
    // 总行数
    let totalRow = 1;
    if (this.tableTh && this.tableTh.length > 0) {
      for (let index = 0; index < this.tableTh.length; index++) {
        const element = this.tableTh[index];
        totalRow *= element.val.length;
      }
    }
    //循环处理表体
    for (let i = 0; i < totalRow; i++) {//总共需要创建多少行
      let rowCount = 1;//记录行数
      let propvalnameArr = []; //记录SKU值 
      let propvalnameStr = []; //记录SKU值 转字符串

      for (let j = 0; j < this.tableTh.length; j++) {//sku列
        let skuItem: any = this.tableTh[j];//SKU值数组
        let skuValueLen = this.tableTh[j].val.length;//sku值长度
        rowCount = (rowCount * skuValueLen);//目前的生成的总行数
        let anInterBankNum = (totalRow / rowCount);//跨行数
        let point: any = ((i / anInterBankNum) % skuValueLen);
        let itemObj: any = {};
        let itemArr: any = {};
        if (0 == (i % anInterBankNum)) { //需要创建td
          itemObj.id = parseInt(skuItem.id) || 0;
          itemObj.name = skuItem.key;
          itemObj.value = skuItem.val[point];

          itemArr[skuItem.key] = skuItem.val[point];
          itemArr['rowspan'] = anInterBankNum;
          propvalnameStr.push(itemObj);
          propvalnameArr.push(itemArr);
        } else {
          itemObj.id = parseInt(skuItem.id) || 0;
          itemObj.name = skuItem.key;
          itemObj.value = skuItem.val[parseInt(point)];

          itemArr[skuItem.key] = skuItem.val[point];
          propvalnameStr.push(itemObj);
          propvalnameArr.push(itemArr);
        }
      }
      this.propertiesArr.push(propvalnameArr);

      let obj = this.setSku({ propertiesStr: JSON.stringify(propvalnameStr) });
      this.tableData.push(obj);
    }
    if (this.resData.length != 0) {
      this.mergeSku();
    }
    this.checkSaveAllBt();
    console.log(this.tableData);
  }
  /**
   * 检测是否还有保存的SKU
   */
  checkSaveAllBt() {
    // 标识还有未保存的SKU
    for (let index = 0; index < this.tableData.length; index++) {
      const element = this.tableData[index];
      if (!element.disabled) {
        this.saveAllDisabled = false;
        return;
      }
    }
    // 标识还有未保存的SKU
    if (this.attrDeleteArr.length != 0) {
      this.saveAllDisabled = false;
      return;
    }
    this.saveAllDisabled = true;
  }
  /**
   * 属性分类下拉 点击
   * @param id 
   */
  typeCall(id: any) {
    this.getAttrTypes(id);
  }
  /**
   * 添加参数下拉 点击
   */
  attrCall(name: any) {
    if (name) {
      this.canWrite = 1;
    } else {
      this.canWrite = 2;
    }
  }
  /**
   * 保存库存
   */
  subWhgoodsForm() {
    // 库存数量
    let number = this.whgoodsForm.get('number')?.value;
    let json = {
      id: this.modalJson.id,
      number: number
    }
    console.log(json);
    // this.modalLoading = true;
    // return;
    this.GoodsSpecService.updateStocknum(json).subscribe((res: any) => {
      if (res.code != 0) {
        this.createMessage("error", res.message);
        // this.modalLoading = false;
        return;
      }
      this.modalJson.number += parseInt(number);
      this.handleCancel();
      this.createMessage("success", "库存修改成功");
    }, err => {
      // this.modalLoading = false;
    });
    console.log(number);
  }
  /**
   * 全局展示操作反馈信息
   * @param type 其他提示类型 success:成功 error:失败 warning：警告
   */
  createMessage(type: any, str: any): void {
    this.message.create(type, str);
  }

  /**
   * 新建参数 or 弹窗新建参数
   */
  showInput(): void {
    this.modalJson.inputVisible = true;
    setTimeout(() => {
      this.inputElement?.nativeElement.focus();
    }, 10);
  }
  /**
   * SKU规格输入框取消焦点
   */
  handleInputConfirm(index: any): void {
    if (this.inputAttrValue && this.skuArr[index].val.indexOf(this.inputAttrValue) === -1) {
      this.skuArr[index].val = [...this.skuArr[index].val, this.inputAttrValue];
      this.resetTbeles();
    }
    this.inputAttrValue = '';
    this.skuArr[index].inputVisible = false;
  }
  /**
   * 列表Item编辑
   */
  edit(index: any) {
    if (this.detailsData.status == 1) {
      this.createMessage("warning", "如需编辑请先把商品下架");
      return;
    }
    let item: any = this.tableData[index];
    item.disabled = item.disabled ? false : true;
    if (item.disabled) {
      this.tableData[index].disabled = false;
      if (item.whGoodsId == 0) {
        this.createMessage("warning", "仓库商品不能为空");
        return;
      } else if (item.selectUserTypeB && !item.shopPriceB) {
        this.createMessage("warning", "B端售价不能为空");
        return;
      } else if (item.selectUserTypeC && !item.shopPriceC) {
        this.createMessage("warning", "C端售价不能为空");
        return;
      } else if (item.selectUserTypeB && item.selectUserTypeC && !item.shopPriceB && !item.shopPriceC) {
        this.createMessage("warning", "SKU上架状态，B,C端售价不能为空");
        return;
      }
      this.tableData[index].disabled = true;
    }
    if (item.disabled && item.selectUserTypeC == false && item.selectUserTypeB == false && this.attrCheck) {
      this.createMessage("warning", "必选一个适用用户");
      this.tableData[index].disabled = false;
      return;
    }
    // 更新SKU or 新增SKU
    if (item.disabled && !item.isLoadingEdit && item.id) {
      item.isLoadingEdit = true;
      item.userType = item.selectUserTypeB == true && item.selectUserTypeC == true ? 0 : item.selectUserTypeB == true ? 1 : 2;
      this.GoodsSpecService.update(this.tableData[index]).subscribe((res: any) => {
        this.tableData[index].isLoadingEdit = false;
        if (res.code != 0) {
          this.createMessage("error", res.message);
          this.tableData[index].disabled = false;
          this.checkSaveAllBt();
          return;
        }
        this.createMessage("success", res.message);
        this.tableData[index].disabled = true;
        this.checkSaveAllBt();
        this.checkSaveAllDisabled()
      }, err => {
        this.createMessage("error", "保存失败");
        this.tableData[index].isLoadingEdit = false;
        this.tableData[index].disabled = false;
        this.checkSaveAllBt();
      });
    } else if (this.tableData[index].disabled && !this.tableData[index].isLoadingEdit && !this.tableData[index].id) {

      this.tableData[index].isLoadingEdit = true;
      item.userType = item.selectUserTypeB == true && item.selectUserTypeC == true ? 0 : item.selectUserTypeB == true ? 1 : 2;

      // 需要删除的SKU id,最后以逗号隔开
      let delIds: any = [];
      // 构建新的SKU || 单规格 
      if (this.newSKU || !this.attrCheck) {
        for (let index = 0; index < this.resData.length; index++) {
          const element = this.resData[index];
          delIds.push(element.id);
        }
      }
      delIds = [...new Set(delIds)];
      this.updateAll(delIds.length != 0 ? delIds.join(",") : "", [], () => {
        if (this.newSKU) {
          this.newSKU = false;
          this.resData = [];
        }
      });

      this.GoodsSpecService.add(this.tableData[index]).subscribe((res: any) => {
        this.tableData[index].isLoadingEdit = false;
        if (res.code != 0) {
          this.createMessage("error", res.message);
          this.tableData[index].disabled = false;
          return;
        }
        this.createMessage("success", res.message);

        this.tableData[index].disabled = true;
        this.tableData[index].id = res.data;
        this.checkSaveAllDisabled()
      }, err => {
        this.createMessage("error", "保存失败");
        this.tableData[index].isLoadingEdit = false;
        this.tableData[index].disabled = false;
      });
    }
    this.checkSaveAllDisabled()
  }
  /**
   * 检查SKU列表是否还有待编辑item
   */
  checkSaveAllDisabled() {
    for (let index = 0; index < this.tableData.length; index++) {
      const element = this.tableData[index];
      if (!element.disabled) {
        this.saveAllDisabled = false;
        return;
      }
    }
    this.saveAllDisabled = true;
    console.log(this.tableData);
  }
  /**
   * 阶梯价格模态框 保存
   */
  submit() {
    let lenObj = this.dataModal[this.dataModal.length - 1];
    // if (this.dataModal.length > 0 && lenObj.min >= lenObj.max) {
    //   return this.createMessage("warning", "起购数量异常");
    // }

    if (this.dataModal.length > 0 && lenObj.count == "") {
      return this.createMessage("warning", "起购数量不能为空");
    }

    // this.modalLoading = true;

    // 没有id的
    let addArr = this.dataModal.filter(function (item: any) { return !item.id; })
    // 有id的 重新保存
    let saveArr = this.dataModal.filter(function (item: any) { return item.id; })

    let htppArr: any = [];
    for (const key in addArr) {
      const element = addArr[key];
      const get = this.GoodsSpecService.addModal(element)
        .pipe((data) => {
          return data;
        });
      htppArr.push(get);
    }
    for (const key in saveArr) {
      const element = saveArr[key];
      const get = this.GoodsSpecService.UpdateModal(element)
        .pipe((data) => {
          return data;
        });
      htppArr.push(get);
    }
    for (const key in this.ladderDeleteArr) {
      const element = this.ladderDeleteArr[key];
      const get = this.GoodsSpecService.deleteModal(element.id)
        .pipe((data) => {
          return data;
        });
      htppArr.push(get);
    }
    forkJoin(htppArr)
      .subscribe((data: any) => {
        if (data[0].code != 0) {
          this.createMessage("error", data[0].message);
          return;
        }
        let item = this.tableData.filter((item: any) => { return item.id == this.objModal.id; })[0];
        item.ladderPriceSum = this.dataModal.length;
        this.handleCancel();
        this.createMessage("success", data[0].message);
        // this.modalLoading = false;
      }, err => {
        this.createMessage("error", "接口出错");
      });
  }
  /**
   * 打开阶梯 模态框
   * @param id 
   */
  showModal(index: any = null): void {
    this.isVisible = true;
    this.objModal = {...this.tableData[index]};
    this.objModal.propertiesStr = JSON.parse(this.objModal.propertiesStr);
    console.log(this.objModal);
    this.getModal();
  }
  /**
   * 模态框关闭触发
   */
  handleCancel(): void {
    this.ladderDeleteArr = [];
    this.modalAttrForm.reset();
    this.whgoodsForm.reset();
    this.objModal = {};

    this.isVisible = false;
    this.attrModal = false;
    this.whgoodsModal = false;

    // this.modalLoading = false;
  }
  /**
   * 删除
   * @param index 
   */
  confirm(index: any) {
    if (this.dataModal[index].id) {
      this.ladderDeleteArr.push(this.dataModal[index]);
    }
    this.dataModal.splice(index, 1);
  }
  /**
   * 价格阶梯启用 禁用
   */
  // stateModal(index: any) {
  //   let statusArr = this.dataModal.filter(function (item: any) { return item.status == 1; })
  //   if (statusArr.length >= 3) {
  //     this.createMessage("warning", "最多启用3个阶梯价格");
  //     return;
  //   }
  //   this.dataModal[index].status = this.dataModal[index].status == 1 ? 2 : 1;
  // }
  /**
   * 添加价格阶梯
   */
  addDataModal() {
    let lenObj = this.dataModal[this.dataModal.length - 1];
    if (this.dataModal.length > 0 && lenObj.count == "") {
      return this.createMessage("warning", "起购数量不能为空");
    }
    const obj = {
      "skuId": this.objModal.id,
      // "min": this.dataModal.length > 0 ? lenObj.max : 1,
      // "max": this.dataModal.length > 0 ? (lenObj.max + 1) : null,
      "count": this.dataModal.length > 0 && lenObj.count ? (lenObj.count + 1) : null,
      "price": null,
    }
    this.dataModal = [...this.dataModal, obj];
  }
  /**
   * 获取阶梯价格 模态框列表数据
   */
  getModal() {
    this.GoodsSpecService.getModal({ skuId: this.objModal.id }).subscribe((res: any) => {
      if (res.code != 0) {
        this.createMessage("error", res.message);
        return;
      }
      this.dataModal = [];
      for (let index = 0; index < res.data.length; index++) {
        const element = res.data[index];
        this.dataModal.push({
          "id": element.id,
          "skuId": element.skuId,
          "count": element.count,
          "price": element.price,
        })
      }
      this.objModal.ladderPriceSum = this.dataModal.length;
    }, err => {

    });
  }
  /**
   * 仓库下拉
   */
  getWhgoods() {
    this.GoodsSpecService.getWhgoods().subscribe((res: any) => {
      if (res.code != 0) {
        this.createMessage("error", res.message);
        return;
      }
      this.whgoodsArr = res.data;
    }, err => {

    });
  }
  /**
   * 删除规格参数
   * @param removedTag 
   */
  handleClose(index: any, tagStr: any, e: any): void {
    this.attrDeleteArr.push('"name":"' + this.skuArr[index].key + '","value":"' + tagStr + '"');
    this.skuArr[index].val = this.skuArr[index].val.filter((iten: any) => iten !== tagStr);
    this.resetTbeles();
  }
  /**
   * 打开规格模态框
   * @param code 1:添加规格 2:添加参数
   * @param id 规格id
   */
  openAttrModal(code: any, index: any = null) {
    this.attrModalTitle = code == 1 ? '添加规格' : '添加参数';
    this.modalJson = index != null ? this.skuArr[index] : {};
    this.attrParamr = [];
    this.canWrite = 2;
    if (!this.modalJson.id && code == 2) {
      this.showInput();
      return;
    }
    if (code == 2 && this.modalJson.id) {
      this.getAttrGoods(this.modalJson.id);
    }
    this.attrModal = true;
  }
  /**
   * 打开调整库存模态框
   */
  openWhgoodsModal(skuObj: any) {
    this.whgoodsModal = true;
    this.modalJson = skuObj;

    this.GoodsSpecService.getWhgoodsInfo(this.modalJson.whGoodsId).subscribe((res: any) => {
      if (res.code != 0) {
        this.createMessage("error", res.message);
        return;
      }
      // 未上架数量
      this.modalJson.notonQuantity = res.data.notonQuantity;
    }, err => {
      this.createMessage("error", "服务器出错");
    });
  }
  /**
   * 删除整个规格
   */
  deleAttr(obj: any) {
    this.skuArr = this.skuArr.filter((tag: any) => tag !== obj);
    this.resetTbeles();
  }
  /**
   * SKU列表上下架
   */
  clickSwitch(obj: any) {
    obj.status = obj.status == 2 ? 1 : 2;
  }
  // 全部保存
  saveAll() {
    if (this.detailsData.status == 1) {
      this.createMessage("warning", "如需编辑请先把商品下架");
      return;
    }
    // 需要删除的SKU id,最后以逗号隔开
    let delIds: any = [];
    let saveAll: any = this.tableData.filter(function (item: { disabled: boolean; }) { return item.disabled == false; });

    for (let index = 0; index < saveAll.length; index++) {
      const element = saveAll[index];
      if (element.whGoodsId == 0) {
        this.createMessage("warning", "参考商品不能为空");
        return;
      } else if (element.selectUserTypeB && !element.shopPriceB) {
        this.createMessage("warning", "B端售价不能为空");
        return;
      } else if (element.selectUserTypeC && !element.shopPriceC) {
        this.createMessage("warning", "C端售价不能为空");
        return;
      } else if (element.selectUserTypeB && element.selectUserTypeC && !element.shopPriceB && !element.shopPriceC) {
        this.createMessage("warning", "B,C端售价不能为空");
        return;
      }
    }

    for (const key in saveAll) {
      const element = saveAll[key];
      element.userType = element.selectUserTypeB == true && element.selectUserTypeC == true ? 0 : element.selectUserTypeB == true ? 1 : 2;
    }
    if (this.newSKU) {
      for (let index = 0; index < this.attrDeleteArr.length; index++) {
        const element = this.attrDeleteArr[index];
        let tableItem = this.resData.filter(function (item: any) { return item.propertiesStr.indexOf(element) > 0 });
        for (const key in tableItem) {
          const skuItem = tableItem[key];
          delIds.push(skuItem.id);
        }
      }
    }

    delIds = [...new Set(delIds)];
    this.updateAll(delIds.length != 0 ? delIds.join(",") : "", saveAll, () => {
      this.forkJoinHtpp();
    });
  }
  /**
   * 全部保存
   * @param delIds 
   * @param list 
   * @param su 
   */
  updateAll(delIds: any = "", list: any = [], su: any = null) {
    let json = {
      //需要删除的SKU id
      delIds: delIds,
      //添加或者修改的对象列表
      list: list
    }
    this.GoodsSpecService.saveAll(json).subscribe((res: any) => {
      if (res.code != 0) {
        this.createMessage("error", res.message);
        return;
      }
      if (su) su();
    }, err => {
    });
  }
  /**
   * 规格模态框提交
   */
  submitForm(): void {
    // 已选择参数
    let selectStr = this.modalAttrForm.get('selectStr')?.value;
    // 输入框参数
    let attrVal = this.modalAttrForm.get('attrVal')?.value;

    let inputVal = selectStr ? selectStr : attrVal;
    if (!inputVal) {
      this.createMessage("warning", "参数值为空");
      return;
    }
    this.attrDeleteArr = this.attrDeleteArr.filter((item: any) => item !== '"name":"' + this.modalJson.key + '","value":"' + inputVal + '"');

    if (this.modalJson.id) {
      if (inputVal && this.modalJson.val.indexOf(inputVal) === -1) {
        this.modalJson.val = [... this.modalJson.val, inputVal];
        this.resetTbeles();
      }
    } else {
      let item = this.skuArr.filter(function (item: any) { return item.key == inputVal; });
      if (item.length == 0) {
        this.skuArr = [...this.skuArr, {
          key: inputVal,
          inputVisible: false,
          val: []
        }];
      } else {
        this.createMessage("warning", "规格值已存在");
        return;
      }
    }
    this.handleCancel();
  }
  /**
   * 属性分类下拉
   */
  getGoodsTypes() {
    this.GoodsSpecService.getGoodsTypes().subscribe((res: any) => {
      if (res.code != 0) {
        this.createMessage("error", res.message);
        return;
      }
      this.goodsTypesArr = res.data;
    }, err => {
    });
  }
  /**
   * 属性分类(获取参数列表)
   */
  getAttrTypes(attrTypeId: any = null) {
    this.GoodsSpecService.getAttrTypes(attrTypeId).subscribe((res: any) => {
      if (res.code != 0) {
        this.createMessage("error", res.message);
        return;
      }
      const sdata = res.data;
      let arr: any = [];
      for (let index = 0; index < sdata.length; index++) {
        const element = sdata[index];
        const objItem = {
          val: element.content != "" ? element.content.split(',') : [],
          key: element.name,
          inputVisible: false,
          canWrite: element.canWrite,
          id: element.id,
        }
        let obj = this.skuArr.filter((item: any) => { return item.key == element.name });
        if (obj.length == 0) {
          arr.push(objItem);
        }
      }
      if (arr.length != 0) {
        this.skuArr = [...this.skuArr, ...arr];
        this.resetTbeles();
      }
    }, err => {
    });
  }
  /**
   * 删除SKU列表图片
   */
  removeSkuImg(index: any) {
    if (!this.tableData[index].disabled) {
      this.tableData[index].icon = "";
    }
  }
  /**
   * 添加参数下拉
   */
  getAttrGoods(attrId: any) {
    const Parameter = {
      // 规格参数ID
      id: attrId,
      // 商品ID
      goodsId:this.detailsData.id
    }
    this.GoodsSpecService.getAttrGoods(Parameter).subscribe((res: any) => {
      if (res.code != 0) {
        this.createMessage("error", res.message);
        return;
      }
      let array = res.data.content != "" ? res.data.content.split(',') : [];
      let objArr = [];
      for (let index = 0; index < array.length; index++) {
        const element = array[index];
        objArr.push({
          name: element
        })
      }
      this.attrParamr = objArr;
    }, err => {
    });
  }
  /**
   * 多个请求，无所谓先后顺序，等到全部请求完成后执行一定的操作时，需要使用并联请求；
   * 可以使用ForkJoin，和promise方法效果一样，好处是：可以减少嵌套，优化代码；
   */
  forkJoinHtpp() {
    // 并联请求
    const post1 = this.getList();
    const post2 = this.getFacet();

    forkJoin([post1, post2])
      .subscribe((data: any) => {
        console.log(data);
        const listData = data[0]; // '/api/post1的返回结果'
        const facetData = data[1]; // '/api/post2的返回结果'

        // SKU列表数据
        this.resData = listData.data;
        // 格式化SKU规格属性
        let arr = [];
        if (facetData.data.length != 0) {
          for (let index = 0; index < facetData.data.length; index++) {
            const element = facetData.data[index];
            arr.push({
              id: element.id,
              key: element.name,
              inputVisible: false,
              val: element.value
            });
          }
          this.skuArr = arr;
        } else {
          this.attrCheck = false;
        }
        this.resetTbeles();
      }, err => {
      });
  }
  /**
   * SKU属性聚合
   */
  getFacet() {
    return this.GoodsSpecService.getFacet(this.detailsData.id)
      .pipe((data) => {
        return data;
      });
  }

  /**
   * 上传文件
   * @param su 上传完成回调函数
   */
  postFile(file: any, su: any) {
    this.GoodsSpecService.postFile(file).subscribe(data => {
      if (su) su(data);
    }, error => {

    });
  }

  /**
   * 获取列表
   */
  getList() {
    const Parameter = {
      // 商品ID
      goodsId: this.detailsData.id
    }
    return this.GoodsSpecService.get(Parameter)
      .pipe((data) => {
        return data;
      });
  }
  /**
   * 请求SKU列表数据 和 本地SKU列表数据 合并
   */
  mergeSku() {
    this.newSKU = true;
    for (let index = 0; index < this.tableData.length; index++) {
      let element = this.tableData[index];
      let item = this.resData.filter((iten: any) => {
        return iten.propertiesStr.replace(/\s+/g, "") == element.propertiesStr.replace(/\s+/g, "")
      });
      if (item.length != 0) {
        let obj = this.setSku(item[0]);
        this.tableData[index] = obj;
        this.newSKU = false;
      }
    }
  }
  /**
   * 批量填写
   */
  batchWrite() {
    for (let index = 0; index < this.tableData.length; index++) {
      const element = this.tableData[index];
      if (!element.disabled) {
        if (!element.warnSkuNum) {
          element.warnSkuNum = this.bulkData.warnSkuNum;
        }
        if (!element.buyMinB) {
          element.buyMinB = this.bulkData.buyMinB;
        }
        if (!element.buyMaxB) {
          element.buyMaxB = this.bulkData.buyMaxB;
        }
        if (!element.retailPriceB) {
          element.retailPriceB = this.bulkData.retailPriceB;
        }
        if (!element.shopPriceB) {
          element.shopPriceB = this.bulkData.shopPriceB;
        }
        if (!element.originalPriceB) {
          element.originalPriceB = this.bulkData.originalPriceB;
        }
        if (!element.buyMinC) {
          element.buyMinC = this.bulkData.buyMinC;
        }
        if (!element.buyMaxC) {
          element.buyMaxC = this.bulkData.buyMaxC;
        }
        if (!element.shopPriceC) {
          element.shopPriceC = this.bulkData.shopPriceC;
        }
        if (!element.originalPriceC) {
          element.originalPriceC = this.bulkData.originalPriceC;
        }
        if (!element.selectUserTypeB) {
          element.selectUserTypeB = this.bulkData.selectUserTypeB;
        }
        if (!element.selectUserTypeC) {
          element.selectUserTypeC = this.bulkData.selectUserTypeC;
        }
        element.status = this.bulkData.status;
      }
    }
    console.log(this.bulkData);
    console.log(this.tableData);
  }
  /**
   * 设置SKU对象结构
   */
  setSku(item?: any) {
    let obj: any = {};
    try {
      if (item.id) {
        obj.id = item.id;
      }
    } catch (error) {

    }
    // 商品ID
    obj.goodsId = this.detailsData.id;
    // SKU规格值
    obj.propertiesStr = item.propertiesStr || "";
    // 仓库商品
    obj.whGoodsId = item.whGoodsId ? item.whGoodsId + "" : 0;
    // 库存
    obj.number = item.number || 0;
    // 预警值
    obj.warnSkuNum = item.warnSkuNum || null;

    // B端设置 最大购买
    obj.buyMaxB = item.buyMaxB || null;
    // B端设置 最小购买
    obj.buyMinB = item.buyMinB || null;
    // B端设置 建议零售价
    obj.retailPriceB = item.retailPriceB || null;
    // B端设置 单个划线价
    obj.originalPriceB = item.originalPriceB || null;
    // B端设置 单个售价
    obj.shopPriceB = item.shopPriceB || null;

    // C端设置 最大购买
    obj.buyMaxC = item.buyMaxC || null;
    // C端设置 最小购买
    obj.buyMinC = item.buyMinC || null;
    // C端设置 单个划线价
    obj.originalPriceC = item.originalPriceC || null;
    // C端设置 单个售价
    obj.shopPriceC = item.shopPriceC || null;

    // 图片地址 
    obj.icon = item.icon || "";
    // 适用用户
    obj.userType = item.userType || 0;

    let status = 2;
    if (item.status) {
      status = item.status;
    } else {
      status = this.attrCheck == true ? 2 : 1;
    }
    // 上下架 1:上架 2:未上架
    obj.status = status;

    // 不知道是啥字段
    obj.defSelected = item.defSelected || 0;
    obj.createUser = item.createUser || 0;
    obj.propertiesName = item.propertiesName || "";

    // 自定义字段 ==========
    // 图片显示地址
    obj.iconShow = item.icon ?  item.icon : "error";

    if (this.attrCheck) {
      // B端商户
      obj.selectUserTypeB = item.userType == 1 ? true : item.userType == 0 ? true : false;
      // C端用户
      obj.selectUserTypeC = item.userType == 2 ? true : item.userType == 0 ? true : false;
    } else {
      // B端商户
      obj.selectUserTypeB = this.detailsData.userType == 1 ? true : this.detailsData.userType == 0 ? true : false;
      // C端用户
      obj.selectUserTypeC = this.detailsData.userType == 2 ? true : this.detailsData.userType == 0 ? true : false;
    }

    // 阶梯价格个数
    obj.ladderPriceSum = item.ladderPrice ? item.ladderPrice.length : 0;
    // 是否可以编辑
    obj.disabled = item.id ? true : false;
    // 保存按钮状态
    obj.isLoadingEdit = false;

    return obj;
  }

}
