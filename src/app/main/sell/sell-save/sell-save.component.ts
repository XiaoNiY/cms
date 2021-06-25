import { Component, OnInit } from '@angular/core';
import { FormBuilder } from '@angular/forms';
import { Router, ActivatedRoute } from '@angular/router';
import { NzMessageService } from 'ng-zorro-antd/message';
import { forkJoin } from 'rxjs';

import { SellSaveService } from './sell-save.service';
import { GoodsAllService } from '../../goods/goods-all/goods-all.service';
@Component({
  selector: 'app-sell-save',
  templateUrl: './sell-save.component.html',
  styleUrls: ['./sell-save.component.scss']
})
export class SellSaveComponent implements OnInit {
  /**
   * 详情数据
   */
  detail: any = null;
  /**
   * 是否复制优惠券
   */
  funCopy = null;
  /**
   * 是否显示骨架屏
   */
  skeletonActive = true;
  /**
   * 已选商品查询参数
   */
  selectGoodsParam = {
    "idList": [],
    "pageNum": 1,
    "pageSize": 10,
  }
  /**
   * 已选商品列表数据
   */
  selectGoodsTable: any = [];
  /**
   * 商品列表查询参数
   */
  queryForm: any = {
    // 商品名称
    name: '',
    // 商品类型  -1 全部
    typeId: '-1',
    // 状态 -1 全部  0无效 1 有效 2下架
    status: '-1',
    current: '1',
    nzFormat: [],
    size: '10',
  }

  /**
   * 接口参数
   */
  entityParam: any = {
    id: 0,

    //  -- Str 基本信息
    // 优惠券名称 
    name: '',
    // 备注
    remark: '',
    // 发放总量
    total: '1',
    // 优惠券类型 1、满减卷  2、折扣卷 3、随机卷
    type: '1',
    // 使用门槛默认选择
    orderLimitMoneyGroup: '1',
    // 使用门槛
    orderLimitMoney: '',
    // 是否知晓无门槛优惠券可能带来的风险 
    orderLimitMoneyCheck: false,
    // 最小优惠金额，折扣劵的话就是折扣值
    limitSmall: 1,
    // 最大优惠金额(减免额度)，0为无限制
    limitBig: '',
    // -- End 基本信息


    // -- Str 领取设置
    // 前端展示 0不展示，1展示
    isShowWeb: '1',
    // 可领取时间
    getTime: [],
    // 领取人限制
    userType: '0',
    // 每人限领次数默认选择
    userLimitNumGroup: '1',
    // 每人限领次数
    userLimitNum: '1',
    // -- End 领取设置

    // -- Str 使用设置
    // 限制使用时间默认选择
    limitTimeNumGroup: '1',
    // 限制使用时间
    limitTimeNum: '0',
    // 可使用时间
    useTime: [],
    // 使用说明
    useDesc: null,
    // -- End 使用设置


    // -- Str 适用商品
    // 指定分类 全选
    classSelect: false,
    // 指定分类 不选
    classNoSelect: false,
    // 适用分类列表
    goodsTypesList: [],

    // 指定品牌 全选
    brandSelect: false,
    // 指定品牌 不选
    brandNoSelect: false,
    // 适用品牌列表
    brandList: [],

    // -- End 适用商品


    // 可领取 开始时间
    getBeginTime: null,
    // 可领取 结束时间
    getEndTime: null,

    // 可使用 开始时间
    useBeginTime: null,
    // 可使用 结束时间
    useEndTime: null,


    // 过期提醒默认选择
    remindGroup: '0',
    // 过期N天提醒
    remind: '0',

    // 自动发放默认选择
    autoReverseGroup: '0',
    // 每N天首次进店自动发放
    autoReverse: '0',

    // 状态 1:发布 5:保存
    status: 1,

    allCheckedA: null,
    allCheckedB: null,
  }
  /**
   * 商品列表 模态框显示 or 隐藏
   */
  selectGoods = false;

  showGoods = false;
  /**
   * 选择商品全选
   */
  checked = false;

  /**
   * 商品列表
   */
  listOfData?: any;
  /**
   * 模态框参数
   */
  modalParam: any = {
    // 0:追加可用商品 1:排除可用商品
    code: -1,
    // 追加可用商品
    assignGoodsArr: [],
    // 排除可用商品
    excludeGoodsArr: [],
    // 已选择商品
    selectGoodsArr: [],
  }

  /**
   * 全局 loading
   */
  messageId: any = null;
  constructor(
    private message: NzMessageService,
    private router: Router,
    private activatedRoute: ActivatedRoute,
    private SellSaveService: SellSaveService,
    private GoodsAllService: GoodsAllService,
    private fb: FormBuilder
  ) { }

  ngOnInit(): void {
    // this.getType();

    // this.getDetails();
    this.activatedRoute.params.subscribe(params => {
      this.funCopy = params.type;
      this.entityParam.id = params.id;
      if (this.entityParam.id == 0) {
        this.skeletonActive = false;
      }
    });
    this.forkJoinHttp();
  }
  /**
   * 并联请求
   */
  forkJoinHttp() {
    // 并联请求
    let postArr = [];
    postArr.push(this.getType());
    if (this.entityParam.id != 0) {
      postArr.push(this.getDetails());
    }
    forkJoin(postArr)
      .subscribe((data: any) => {
        // 品牌 和 分类列表
        let TypeList = data[0];
        // 详情数据
        let detailsData = data[1];

        this.entityParam.goodsTypesList = [];
        this.entityParam.brandList = [];

        for (let index = 0; index < TypeList.data.goodsTypesList.length; index++) {
          const element = TypeList.data.goodsTypesList[index];
          this.entityParam.goodsTypesList.push({ label: element.name, value: element.id, checked: false })
        }
        for (let index = 0; index < TypeList.data.brandList.length; index++) {
          const element = TypeList.data.brandList[index];
          this.entityParam.brandList.push({ label: element.name, value: element.id, checked: false })
        }
        if (this.entityParam.id != 0) {
          this.detail = detailsData.data;
          this.setValue(detailsData.data);
          this.skeletonActive = false;
        }

      }, err => {
      });
  }
  setValue(obj: any) {

    this.entityParam.getTime = [
      new Date(obj.getBeginTime),
      new Date(obj.getEndTime),
    ];
    this.entityParam.id = obj.id;
    this.entityParam.name = obj.name;
    this.entityParam.remark = obj.remark;
    this.entityParam.total = obj.total;
    this.entityParam.limitSmall = obj.limitSmall;
    this.entityParam.limitBig = obj.limitBig + "";
    this.entityParam.userType = obj.userType + "";
    this.entityParam.useDesc = obj.useDesc;
    // 优惠券类型
    this.entityParam.type = obj.type + "";
    // 前端展示
    this.entityParam.isShowWeb = obj.isShowWeb + "";

    // 使用门槛
    // if (obj.orderLimitMoney > 0) {
    this.entityParam.orderLimitMoneyGroup = "1";
    this.entityParam.orderLimitMoney = obj.orderLimitMoney;
    // } else {
    //   this.validateForm.get('orderLimitMoneyGroup')!.setValue("0");
    // }
    // 每人限领次数
    if (obj.userLimitNum > 0) {
      this.entityParam.userLimitNumGroup = "1";
      this.entityParam.userLimitNum = obj.userLimitNum;
    } else {
      this.entityParam.userLimitNumGroup = "0";
    }
    // 限制使用时间
    if (obj.limitTimeNum != -1) {
      this.entityParam.limitTimeNumGroup = "1";
      this.entityParam.limitTimeNum = obj.limitTimeNum;
    } else {
      this.entityParam.limitTimeNumGroup = "0";

      this.entityParam.useTime = [
        new Date(obj.useBeginTime),
        new Date(obj.useEndTime),
      ];
    }
    //  过期提醒
    if (obj.remind > 0) {
      this.entityParam.remindGroup = "1";
      this.entityParam.remind = obj.remind;
    } else {
      this.entityParam.remindGroup = "0";
    }
    // 自动发放
    if (obj.autoReverse > 0) {
      this.entityParam.autoReverseGroup = "1";
      this.entityParam.autoReverse = obj.autoReverse;
    } else if (obj.autoReverse == 0) {
      this.entityParam.autoReverseGroup = "0";
    } else if (obj.autoReverse == -1) {
      this.entityParam.autoReverseGroup = "-1";
    }
    // 状态
    this.entityParam.status = obj.status;
    // 指定分类
    if (obj.goodsFilter['1']) {
      // 全不选
      let noSelect = obj.goodsFilter['1']['-1'];
      // 全选
      let allSelect = obj.goodsFilter['1']['0'];
      // 选择列表
      let idArr = obj.goodsFilter['1']['1'];
      idArr = idArr ? idArr : [];
      if (noSelect) {
        this.entityParam.classNoSelect = true;
      }
      if (allSelect) {
        this.entityParam.classSelect = true;
        for (let k = 0; k < this.entityParam.goodsTypesList.length; k++) {
          const goodsObj = this.entityParam.goodsTypesList[k];
          goodsObj.checked = true;
        }
      }
      for (let index = 0; index < idArr.length; index++) {
        const element = idArr[index];
        for (let k = 0; k < this.entityParam.goodsTypesList.length; k++) {
          const goodsObj = this.entityParam.goodsTypesList[k];
          if (goodsObj.value == element) {
            goodsObj.checked = true;
            break;
          }
        }
      }
    }
    // 指定品牌
    if (obj.goodsFilter['2']) {

      // 全不选
      let noSelect = obj.goodsFilter['2']['-1'];
      // 全选
      let allSelect = obj.goodsFilter['2']['0'];

      let idArr = obj.goodsFilter['2']['1'];
      idArr = idArr ? idArr : [];

      if (noSelect) {
        this.entityParam.brandNoSelect = true;
      }
      if (allSelect) {
        this.entityParam.brandSelect = true;
        for (let k = 0; k < this.entityParam.brandList.length; k++) {
          const goodsObj = this.entityParam.brandList[k];
          goodsObj.checked = true;
        }
      }
      for (let index = 0; index < idArr.length; index++) {
        const element = idArr[index];
        for (let k = 0; k < this.entityParam.brandList.length; k++) {
          const goodsObj = this.entityParam.brandList[k];
          if (goodsObj.value == element) {
            goodsObj.checked = true;
            break;
          }
        }
      }
    }
    // 追加可用商品
    if (obj.goodsFilter['3']) {
      let idArr = obj.goodsFilter['3']['1'];
      idArr = idArr ? idArr : [];
      for (let index = 0; index < idArr.length; index++) {
        const element = idArr[index];
        this.modalParam.assignGoodsArr.push({
          id: element
        });
      }
    }
    // 排除可用商品
    if (obj.goodsFilter['4']) {
      let idArr = obj.goodsFilter['4']['1'];
      idArr = idArr ? idArr : [];
      for (let index = 0; index < idArr.length; index++) {
        const element = idArr[index];
        this.modalParam.excludeGoodsArr.push({
          id: element
        });
      }
    }
  }
  /**
   * 获取详情
   */
  getDetails() {
    return this.SellSaveService.get(this.entityParam.id).pipe((data) => {
      return data;
    })
    this.SellSaveService.get(this.entityParam.id).subscribe((res: any) => {
      this.detail = res.data;
      this.setValue(res.data);
      this.skeletonActive = false;
    }, err => {
    });
  }
  /**
   * 指定分类 全选 or 不全选
   * @param code 0:全选 -1:不全选
   */
  classSelect(code: Number) {
    if (code == 0 && this.entityParam.classNoSelect) {
      this.entityParam.classNoSelect = false;
    } else if (code == -1 && this.entityParam.classSelect) {
      this.entityParam.classSelect = false;
    }
    if (this.entityParam.classSelect && !this.entityParam.brandNoSelect) {
      this.entityParam.goodsTypesList = this.entityParam.goodsTypesList.map((item: any) => {
        return {
          ...item,
          checked: true
        };
      });
    } else {
      if (this.entityParam.classSelect || !this.entityParam.brandNoSelect && this.entityParam.classNoSelect) {
        this.entityParam.brandNoSelect = true;
      }
      this.entityParam.brandSelect = false;

      this.entityParam.goodsTypesList = this.entityParam.goodsTypesList.map((item: any) => {
        return {
          ...item,
          checked: false
        };
      });
      this.entityParam.brandList = this.entityParam.brandList.map((item: any) => {
        return {
          ...item,
          checked: false
        };
      });
    }
  }
  /**
   * 指定品牌 全选
   * @param code 0:全选 -1:不全选
   */
  brandSelect(code: Number) {
    if (code == 0 && this.entityParam.brandNoSelect) {
      this.entityParam.brandNoSelect = false;
    } else if (code == -1 && this.entityParam.brandSelect) {
      this.entityParam.brandSelect = false;
    }
    if (this.entityParam.brandSelect && !this.entityParam.classNoSelect) {
      this.entityParam.brandList = this.entityParam.brandList.map((item: any) => {
        return {
          ...item,
          checked: true
        };
      });
    } else {
      if (this.entityParam.brandSelect || !this.entityParam.classNoSelect && this.entityParam.brandNoSelect) {
        this.entityParam.classNoSelect = true;
      }
      this.entityParam.classSelect = false;
      this.entityParam.brandList = this.entityParam.brandList.map((item: any) => {
        return {
          ...item,
          checked: false
        };
      });
      this.entityParam.goodsTypesList = this.entityParam.goodsTypesList.map((item: any) => {
        return {
          ...item,
          checked: false
        };
      });
    }
  }
  /**
   * 删除已选择商品
   * @param id 
   */
  confirm(id: any) {
    this.modalParam.selectGoodsArr = this.modalParam.selectGoodsArr.filter((item: any) => item.id !== id);
    if (this.modalParam.code == 0) {
      this.modalParam.assignGoodsArr = [...this.modalParam.selectGoodsArr];
    } else {
      this.modalParam.excludeGoodsArr = [...this.modalParam.selectGoodsArr];
    }
    this.selectGoodsList();
  }
  /**
   * 确认选择商品
   */
  slectGoods() {
    if (this.modalParam.code == 0) {
      this.modalParam.assignGoodsArr = [...this.modalParam.selectGoodsArr];
    } else {
      this.modalParam.excludeGoodsArr = [...this.modalParam.selectGoodsArr];
    }
    if (this.modalParam.selectGoodsArr.length == 0) {
      return this.createMessage("warning", "请选择关联商品");
    }
    this.selectGoods = false;
  }
  submitForm(status: any): void {

    if (this.messageId != null) {
      return;
    }

    if (this.verifyObj()) {
      return;
    }

    this.entityParam.modalParam = this.modalParam;

    this.entityParam.status = status;
    this.createBasicMessage();
    if (this.entityParam.id == 0 || this.funCopy) {
      this.SellSaveService.add(this.entityParam).subscribe((res: any) => {
        this.removeBasicMessage();
        if (res.code != 0) {
          this.createMessage("error", res.message);
          return;
        }
        this.createMessage("success", "优惠券添加成功");
        this.router.navigate(['sell/coupon']);
      }, err => {
        this.removeBasicMessage();
        this.createMessage("error", err.message);
      });
    } else {
      this.SellSaveService.update(this.entityParam.id, this.entityParam).subscribe((res: any) => {
        this.removeBasicMessage();
        if (res.code != 0) {
          this.createMessage("error", res.message);
          return;
        }
        this.createMessage("success", "优惠券修改成功");
        this.router.navigate(['/sell/coupon']);
      }, err => {
        this.removeBasicMessage();
        this.createMessage("error", err.message);
      });
    }
  }
  /**
   * 指定分类复选
   */
  onGoodsTypes() {
    if (this.entityParam.goodsTypesList.every((item: any) => item.checked)) {
      this.entityParam.classSelect = true;
    } else {
      this.entityParam.classSelect = false;

    }
  }
  /**
   * 指定品牌复选
   */
  onbrandList() {
    if (this.entityParam.brandList.every((item: any) => item.checked)) {
      this.entityParam.brandSelect = true;
    } else {
      this.entityParam.brandSelect = false;
    }
  }
  /**
   * 全选
   * @param value 
   */
  onAllChecked(value: boolean): void {
    let goodsData = this.listOfData.records;
    goodsData.forEach((item: any) => {
      if (!item.disabled) {
        item.Checked = value
      }
    });

    for (let index = 0; index < goodsData.length; index++) {
      const element = goodsData[index];
      this.modalParam.selectGoodsArr = this.modalParam.selectGoodsArr.filter((item: any) => item.id !== element.id);
    }
    for (let index = 0; index < goodsData.length; index++) {
      const element = goodsData[index];
      if (element.Checked) {
        this.modalParam.selectGoodsArr.push(element);
      }
    }
  }
  /**
   * item单选
   * @param id 
   * @param checked 
   */
  onItemChecked(id: number, checked: boolean): void {
    const index = this.listOfData.records.findIndex((item: { id: number; }) => item.id === id);
    this.listOfData.records[index].Checked = checked;
    if (checked) {
      this.modalParam.selectGoodsArr.push(this.listOfData.records[index]);
    } else {
      this.modalParam.selectGoodsArr = this.modalParam.selectGoodsArr.filter((item: any) => item.id !== id);
    }
    this.updataCheckAll();
  }
  /**
   * 优惠券类型切换
   */
  typeCall() {
    this.entityParam.limitSmall = 1;
    this.entityParam.limitBig = 0;
  }
  /**
   * 判断item是否全部选择
   */
  updataCheckAll() {
    const index = this.listOfData.records.findIndex((item: { Checked: boolean; }) => item.Checked == false);
    if (index != -1) {
      this.checked = false;
    } else {
      this.checked = true;
    }
  }
  /**
   * 可领取时间
   * @param result 
   */
  onChange(result: any | Date[]): void {
    this.entityParam.getTime = result;
  }
  /**
   * 可使用时间
   * @param result 
   */
  onUseChange(result: any | Date[]): void {
    this.entityParam.useTime = result;
  }
  /**
   * 页码改变
   * @param index 
   */
  onPageIndexChange(index: number) {
    this.queryForm.current = index;
    this.getList();
  }
  /**
   * 每页条数改变的回调
   * @param index 
   */
  onPageSizeChange(index: number) {
    this.queryForm.size = index;
    this.getList();
  }


  /**
   * 页码改变
   * @param index 
   */
  onPageIndexChange_Select(index: number) {
    this.selectGoodsParam.pageNum = index;
    this.selectGoodsList();
  }
  /**
   * 每页条数改变的回调
   * @param index 
   */
  onPageSizeChange_Select(index: number) {
    this.selectGoodsParam.pageSize = index;
    this.selectGoodsList();
  }

  /**
   * 打开模态框 已选择商品
   */
  showGoodsModal(code: any = null) {
    this.modalParam.code = code;
    if (code == 0) {
      this.modalParam.selectGoodsArr = [...this.modalParam.assignGoodsArr];
    } else {
      this.modalParam.selectGoodsArr = [...this.modalParam.excludeGoodsArr];
    }
    if (this.modalParam.selectGoodsArr.length == 0) {
      return this.createMessage("warning", "没有已选商品");
    }
    this.selectGoodsList();
  }
  /**
  * 打开模态框 初始化
  * @param id 
  */
  showModal(code: any = null): void {
    this.modalParam.code = code;
    if (code == 0) {
      this.modalParam.selectGoodsArr = [...this.modalParam.assignGoodsArr];
    } else {
      this.modalParam.selectGoodsArr = [...this.modalParam.excludeGoodsArr];
    }
    this.selectGoods = true;
    this.getList();
  }
  /**
   * 模态框关闭触发
   */
  handleCancel(): void {
    this.selectGoods = false;
    this.showGoods = false;
    this.modalParam.selectGoodsArr = [];
    this.selectGoodsParam = {
      "idList": [],
      "pageNum": 1,
      "pageSize": 10,
    }
  }
  /**
   * 商品列表查询
   */
  query(): void {
    this.getList();
  }
  /**
   * 已选商品列表
   */
  selectGoodsList() {
    if (this.messageId != null) {
      return;
    }
    this.createBasicMessage();
    this.selectGoodsParam.idList = this.modalParam.selectGoodsArr.map((ele: any) => {
      return ele.id
    });
    this.SellSaveService.selectGoodsList(this.selectGoodsParam).subscribe((res: any) => {
      this.removeBasicMessage();
      if (res.code != 0) {
        this.createMessage("error", res.message);
        return;
      }
      this.selectGoodsTable = res.data;
      this.showGoods = true;
    }, err => {
      this.removeBasicMessage();
      this.createMessage("error", err.message);
    });
  }
  getType() {
    return this.SellSaveService.getType().pipe((data) => {
      return data;
    });

    this.SellSaveService.getType().subscribe((res: any) => {
      this.entityParam.goodsTypesList = [];
      this.entityParam.brandList = [];

      for (let index = 0; index < res.data.goodsTypesList.length; index++) {
        const element = res.data.goodsTypesList[index];
        this.entityParam.goodsTypesList.push({ label: element.name, value: element.id, checked: false })
      }
      for (let index = 0; index < res.data.brandList.length; index++) {
        const element = res.data.brandList[index];
        this.entityParam.brandList.push({ label: element.name, value: element.id, checked: false })
      }
    }, err => {
    });
  }
  /**
   * 商品列表
   */
  getList(su: any = null) {
    this.GoodsAllService.get(this.queryForm).subscribe((res: any) => {
      res.data.records.forEach((element: any) => {
        element['Checked'] = false;
      });
      this.listOfData = res.data;
      this.checked = false;

      // 过滤已选择过商品
      if (this.modalParam.code == 0) {
        for (let index = 0; index < this.modalParam.excludeGoodsArr.length; index++) {
          const element = this.modalParam.excludeGoodsArr[index];
          for (let k = 0; k < this.listOfData.records.length; k++) {
            const obj = this.listOfData.records[k];
            if (element.id == obj.id) {
              obj.disabled = true;
              continue;
            }
          }
        }
      } else {
        for (let index = 0; index < this.modalParam.assignGoodsArr.length; index++) {
          const element = this.modalParam.assignGoodsArr[index];
          for (let k = 0; k < this.listOfData.records.length; k++) {
            const obj = this.listOfData.records[k];
            if (element.id == obj.id) {
              obj.disabled = true;
              continue;
            }
          }
        }
      }
      // 默认已选择商品
      for (let index = 0; index < this.modalParam.selectGoodsArr.length; index++) {
        let element = this.modalParam.selectGoodsArr[index];
        for (let k = 0; k < this.listOfData.records.length; k++) {
          let obj = this.listOfData.records[k];
          if (element.id == obj.id) {
            obj.Checked = true;
            continue;
          }
        }
      }

      this.updataCheckAll();
      if (su) su();
    }, err => {
    });
  }
  verifyObj() {
    let ret = false;
    let obj = this.entityParam;
    let goodsTypesList = this.entityParam.goodsTypesList.filter((item: any) => item.checked == true);
    let brandList = this.entityParam.brandList.filter((item: any) => item.checked == true);
    if (!obj.name) {
      this.createMessage("warning", "优惠券名称不能为空");
      ret = true;
    } else if (!obj.total && obj.total > 0) {
      this.createMessage("warning", "发放总量不能为空 or 发放总量必须大于0");
      ret = true;
    } else if (goodsTypesList.length == 0 && !this.entityParam.classSelect && !this.entityParam.classNoSelect) {
      this.createMessage("warning", "指定分类不能为空");
      ret = true;
    } else if (brandList.length == 0 && !this.entityParam.brandSelect && !this.entityParam.brandNoSelect) {
      this.createMessage("warning", "指定品牌不能为空");
      ret = true;
    } else if (obj.orderLimitMoney === null || obj.orderLimitMoney === "") {
      this.createMessage("warning", "使用门槛不能为空");
      ret = true;
    } else if (!obj.limitSmall && obj.type == 1) {
      this.createMessage("warning", "减免额度不能为空");
      ret = true;
    } else if (!obj.limitSmall && obj.type == 2) {
      this.createMessage("warning", "折扣力度不能为空");
      ret = true;
    } else if (!obj.limitBig && obj.type == 2) {
      this.createMessage("warning", "最高减免金额不能为空");
      ret = true;
    } else if (!obj.limitSmall && !obj.limitBig && obj.type == 3) {
      this.createMessage("warning", "优惠金额金额不能为空");
      ret = true;
    } else if (obj.getTime.length == 0) {
      this.createMessage("warning", "可领取时间不能为空");
      ret = true;
    } else if (obj.useTime.length == 0 && obj.limitTimeNumGroup == 0) {
      this.createMessage("warning", "限制使用时间不能为空");
      ret = true;
    } else if (!obj.useDesc) {
      this.createMessage("warning", "使用说明不能为空");
      ret = true;
    } else if (obj.orderLimitMoney == '0' && !obj.orderLimitMoneyCheck) {
      this.createMessage("warning", "无门槛优惠券可能带来风险,请勾选确认");
      ret = true;
    }
    return ret;
  }
  /**
   * 状态转文字
   * @param status 
   */
  status_To_text(status: any) {
    let text = "";
    switch (status) {
      case 1:
        text = "未开始";
        break;
      case 2:
        text = "进行中";
        break;
      case 3:
        text = "已结束";
        break;
      case 4:
        text = "已停止";
        break;
      case 5:
        text = "草稿";
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
   * @param type 其他提示类型 success:成功 error:失败 warning:警告
   */
  createMessage(type: any, str: any): void {
    this.message.create(type, str);
  }
}
