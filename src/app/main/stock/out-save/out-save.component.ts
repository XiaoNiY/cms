import { Component, OnInit } from '@angular/core';
import { NzMessageService } from 'ng-zorro-antd/message';
import { ActivatedRoute, Router } from '@angular/router';
import { forkJoin } from 'rxjs';

import { OutSaveService } from './out-save.service';
import { ConfigDictListService } from '../../config/config-dict-list/config-dict-list.service';

@Component({
  selector: 'app-out-save',
  templateUrl: './out-save.component.html',
  styleUrls: ['./out-save.component.scss']
})
export class OutSaveComponent implements OnInit {

  /**
   * 复选框
   */
  checkedAll = false;
  /**
  * 是否显示骨架屏
  */
  skeletonActive = true;
  /**
   * 路由参数 copy:复制 create:生成订单 number:订单号
   */
  routeParams: any = null;
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
   * 出库单参数
   */
  entityParams: any = {
    id: null,
    // 出库类型(1、销售出库 2直接出库)
    type: "",
    // 出库仓库id
    // whPut: "",
    // 状态(1草稿 2已通知 3已完成 4已撤销)
    state: "1",
    // 收货人
    consignee: null,
    // 买家具体地址
    address: null,
    // 地址库ID
    districtId: [],
    // 备注
    remark: null,
    // 供应商id
    supId: null,
    // 联系方式
    tel: null,
  }
  /**
   * 模态框显示 or 隐藏
   */
  showGoods = false;
  /**
   * 已选择仓库商品(临时存放)
   */
  selectGoodsArr: any = [];
  /**
   * 仓库商品列表
   */
  WhList: any = [];
  /**
   * 供应商列表 数据
   */
  SupplierList: any = [];
  /**
   * 出库列表
   */
  outTable: any = [];
  /**
   * 仓库商品列表
   */
  whgoodsTable?: any = null;
  /**
   * 字典列表
   */
  dict = {
    // 品质列表
    qualityList: [],
    // 出库类型列表
    outTypeList: [],
  }
  /**
   * 全局 loading
   */
  messageId: any = null;
  /**
   * 区域选择
   */
  nzOptions: any = [];
  /**
   * 地区区域数据
   */
  areaData: any = [];
  constructor(
    private router: Router,
    private activatedRoute: ActivatedRoute,
    private ConfigDictListService: ConfigDictListService,
    private OutSaveService: OutSaveService,
    private message: NzMessageService
  ) { }

  ngOnInit(): void {
    this.activatedRoute.params.subscribe((params) => {
      this.entityParams.id = params.id;
    })
    // 并联请求
    let postArr = [];
    postArr.push(this.OutSaveService.getWhList()
      .pipe((data) => {
        return data;
      }));
    postArr.push(this.ConfigDictListService.getDictList({
      // 名称或者编码搜索
      parentKey: "outbound_type",
      // 多少页，默认1
      pageNum: 1,
      // 每页多少条，默认10
      pageSize: 999
    }).pipe((data) => {
      return data;
    }));
    postArr.push(this.OutSaveService.getSupplierList()
      .pipe((data) => {
        return data;
      }));

    postArr.push(this.ConfigDictListService.getDictList({
      // 名称或者编码搜索
      parentKey: "stoke_goods_quality",
      // 多少页，默认1
      pageNum: 1,
      // 每页多少条，默认10
      pageSize: 999
    }).pipe((data) => {
      return data;
    }));


    postArr.push(this.OutSaveService.area()
      .pipe((data) => {
        return data;
      }));

    if (this.entityParams.id != 0) {
      postArr.push(this.OutSaveService.getDetails(this.entityParams.id)
        .pipe((data) => {
          return data;
        }));
    }

    forkJoin(postArr)
      .subscribe((data: any) => {
        // 仓库商品列表
        let WhList = data[0];
        // 出库类型列表
        let outTypeList = data[1];
        // 供应商列表
        let SupplierList = data[2];
        // 出库单仓库商品品质列表详情
        let qualityList = data[3];
        // 地区
        let area = data[4];
        // 出库单详情
        let details = data[5];
        this.areaData = area;
        this.WhList = WhList.data.records.filter(function (item: any) { return item.state == 1 });

        this.dict.outTypeList = outTypeList.data.list.records;
        this.dict.qualityList = qualityList.data.list.records;
        this.entityParams.type = outTypeList.data.list.records[0].content;

        this.SupplierList = SupplierList.data.records.filter(function (item: any) { return item.state == 1; })

        this.nzOptions = [];
        // 省
        for (const key in area.province) {
          let province = area.province[key];
          let obj: any = {
            value: province.id,
            label: province.name,
            children: []
          };
          // 市
          for (const k in area.city[province.id]) {
            let city = area.city[province.id][k];
            let cityObj: any = {
              value: city.id,
              label: city.name,
              children: []
            }
            // 区
            for (const s in area.county[city.id]) {
              let county = area.county[city.id][s];
              cityObj.children.push({
                value: county.id,
                label: county.name,
                isLeaf: true,
              })
            }
            obj.children.push(cityObj);
          }
          this.nzOptions.push(obj);
        }
        if (details) {
          this.setDetails(details);
        }
        this.skeletonActive = false;
      }, err => {
      });

  }

  /**
   * 仓库商品列表
   */
  getWhGoodsList() {
    this.OutSaveService.whGetList(this.queryForm).subscribe((res: any) => {
      res.data.records.forEach((element: any) => {
        element['Checked'] = false;
      });
      this.whgoodsTable = res.data;

      this.checkedAll = false;
      if (this.selectGoodsArr.length != 0) {
        for (let index = 0; index < this.selectGoodsArr.length; index++) {
          const element = this.selectGoodsArr[index];
          for (let k = 0; k < this.whgoodsTable.records.length; k++) {
            const obj = this.whgoodsTable.records[k];
            if (element.whGoodsId == obj.id && element.deleteState == 0) {
              obj.Checked = true;
              continue;
            }
          }
        }
      }
      this.updateCheckAll();
    }, err => {
    });
  }

  /**
   * item单选
   * @param id 
   * @param checked 
   */
  onItemChecked(id: number, checked: boolean): void {
    const index = this.whgoodsTable.records.findIndex((item: { id: number; }) => item.id === id);
    let obj = this.whgoodsTable.records[index];
    obj.Checked = checked;
    if (checked) {
      this.selectGoodsArr.push({
        // 商品名称
        name: obj.name,
        // 商品编号
        whGoodsId: obj.id,
        // 商品69码
        code: obj.code,
        // 标准采购价 (含税)
        attr: obj.standardCostPrice,
        // 出库品质(RW、待返工品 QA、待确认品 DM、不良品 NR、良品)
        quality: "",
        // 出库数量
        number: "",
        // 删除状态(0表示未删除 1表示已删除)
        deleteState: 0,
      });
    } else {
      this.selectGoodsArr = this.selectGoodsArr.filter((item: any) => item.whGoodsId !== id);
    }
    this.updateCheckAll();
  }
  /**
   * 全选
   * @param value 
   */
  onAllChecked(value: boolean): void {
    let goodsData = this.whgoodsTable.records;
    goodsData.forEach((item: { Checked: boolean; }) => item.Checked = value);
    for (let index = 0; index < goodsData.length; index++) {
      const element = goodsData[index];
      this.selectGoodsArr = this.selectGoodsArr.filter((item: any) => item.whGoodsId !== element.id);
    }
    for (let index = 0; index < goodsData.length; index++) {
      const element = goodsData[index];
      if (element.Checked) {
        this.selectGoodsArr.push({
          // 商品名称
          name: element.name,
          // 商品编号
          whGoodsId: element.id,
          // 商品69码
          code: element.code,
          // 标准采购价 (含税)
          attr: element.standardCostPrice,
          // 出库品质(RW、待返工品 QA、待确认品 DM、不良品 NR、良品)
          quality: "",
          // 出库数量
          number: "",
          // 删除状态(0表示未删除 1表示已删除)
          deleteState: 0,
        });
      }
    }

  }
  /**
   * 判断item是否全部选择
   */
  updateCheckAll() {
    const index = this.whgoodsTable.records.findIndex((item: { Checked: boolean; }) => item.Checked == false);
    if (index != -1) {
      this.checkedAll = false;
    } else {
      this.checkedAll = true;
    }
  }
  /**
   * 页码改变
   * @param index 页码数
   */
  onPageIndexChange(index: Number) {
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
  }
  /**
   * 采购单选择回调
   * @param id 
   */
  selectSupplier(id: any) {
    try {
      console.log(id);
      let obj = this.SupplierList.filter(function (item: any) { return item.id == id })[0];
      this.entityParams.consignee = obj.contacts;
      this.entityParams.tel = obj.phoneNumber
    } catch (error) {

    }
  }
  /**
  * 设置详情数据
  */
  setDetails(res: any) {
    let delivery = res.data.delivery;
    let list = res.data.list;

    this.entityParams.supId = parseInt(delivery.supId);
    this.entityParams.deliveryNumber = delivery.deliveryNumber;
    this.entityParams.type = delivery.type + "";
    this.entityParams.remark = delivery.remark;
    this.entityParams.consignee = delivery.consignee;
    this.entityParams.tel = delivery.tel;
    this.entityParams.address = delivery.address;

    for (let index = 0; index < list.length; index++) {
      const element = list[index];
      this.outTable.push({
        id: element.id,
        // 商品名称
        name: element.whGoodsName,
        // 商品编号
        whGoodsId: element.whGoodsId,
        // 商品69码
        code: element.whGoodsCode,
        // 标准采购价 (含税)
        standardCostPrice: element.standardCostPrice,
        // 出库品质(RW、待返工品 QA、待确认品 DM、不良品 NR、良品)
        quality: element.quality,
        // 出库数量
        number: element.number,
        // 删除状态(0表示未删除 1表示已删除)
        deleteState: 0,
      });
    }

    this.entityParams.districtId = [];
    // 省
    for (const key in this.areaData.province) {
      let province = this.areaData.province[key];
      // 市
      for (const k in this.areaData.city[province.id]) {
        let city = this.areaData.city[province.id][k];
        // 区
        for (let index = 0; index < this.areaData.county[city.id].length; index++) {
          const county = this.areaData.county[city.id][index];
          if (county.id == delivery.districtId) {
            this.entityParams.districtId.push(province.id);
            this.entityParams.districtId.push(city.id);
            this.entityParams.districtId.push(county.id);
            break;
          }
        }
      }
    }
  }
  /**
  * 打开模态框 初始化
  * @param id 
  */
  showModal(): void {
    this.showGoods = true;
    let arr = this.outTable.filter((obj: any, i: any) => {
      return obj.deleteState == 0;
    });;
    this.selectGoodsArr = [...arr];
    this.getWhGoodsList();
  }

  /**
   * 模态框关闭触发
   */
  handleCancel(): void {
    this.showGoods = false;
  }
  /**
   * 确认选择仓库商品
   */
  slectGoods() {
    for (let index = 0; index < this.selectGoodsArr.length; index++) {
      const element = this.selectGoodsArr[index];
      let goodsIndex = this.outTable.findIndex((obj: any, i: any) => {
        return obj.whGoodsId == element.whGoodsId;
      });
      if (goodsIndex == -1) {
        this.outTable.push({
          // 商品名称
          name: element.name,
          // 商品编号
          whGoodsId: element.whGoodsId,
          // 商品69码
          code: element.code,
          // 标准采购价 (含税)
          standardCostPrice: element.standardCostPrice,
          // 出库品质(RW、待返工品 QA、待确认品 DM、不良品 NR、良品)
          quality: "",
          // 出库数量
          number: null,
          // 删除状态(0表示未删除 1表示已删除)
          deleteState: 0,
        });
      }
    }
    this.showGoods = false;
  }
  /**
   * 删除
   * @param index 
   */
  delete(item: any) {
    if (!item.id) {
      const index = this.outTable.findIndex((obj: any) => obj == item);
      index > -1 && this.outTable.splice(index, 1)
    } else {
      item.deleteState = 1;
    }

    // this.outTable = this.outTable.filter((obj: any, i: any) => {
    //   return obj.whGoodsId != item.whGoodsId;
    // });
    // this.selectGoodsArr = [...this.outTable];
  }
  /**
   * 保存
   * @param state 
   */
  save(state: any) {

    if (!this.entityParams.consignee) {
      return this.createMessage("warning", "请输入收货人");
    }
    if (!this.entityParams.tel) {
      return this.createMessage("warning", "请输入联系方式");
    }
    if (!this.entityParams.districtId) {
      return this.createMessage("warning", "请选择地区");
    }
    if (!this.entityParams.address) {
      return this.createMessage("warning", "请输入详细地址");
    }
    if (this.outTable.length == 0) {
      return this.createMessage("warning", "请选择出库列表");
    }
    for (let index = 0; index < this.outTable.length; index++) {
      const element = this.outTable[index];
      if (element.deleteState == 1) {
        continue;
      }
      if (!element.number) {
        return this.createMessage("warning", "第" + (index + 1) + "行,请输入出库数量");
      } else if (!element.quality) {
        return this.createMessage("warning", "第" + (index + 1) + "行,请选择品质");
      }
    }

    if (this.messageId != null) {
      return;
    }
    let json = {
      // type: state,
      delivery: this.entityParams,
      list: this.outTable
    }
    this.createBasicMessage();
    if (this.entityParams.id == 0) {
      this.OutSaveService.save(json).subscribe((res: any) => {
        this.removeBasicMessage();
        if (res.code != 0) {
          this.createMessage("error", res.message);
          return;
        }
        this.createMessage("success", res.message);
        this.router.navigate(['stock/out']);
      }, err => {
        this.removeBasicMessage();
        this.createMessage("error", err.message);
      })
    } else {
      this.OutSaveService.update(json).subscribe((res: any) => {
        this.removeBasicMessage();
        if (res.code != 0) {
          this.createMessage("error", res.message);
          return;
        }
        this.createMessage("success", res.message);
        this.router.navigate(['stock/out']);
      }, err => {
        this.removeBasicMessage();
        this.createMessage("error", err.message);
      })
    }
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
