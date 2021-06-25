import { Component, OnInit } from '@angular/core';
import { NzMessageService } from 'ng-zorro-antd/message';
import { ActivatedRoute, Router } from '@angular/router';
import { forkJoin, Observable } from 'rxjs';
import { NzModalService } from 'ng-zorro-antd/modal';

import { SaleDetailsService } from './sale-details.service';
import { ConfigDictListService } from '../../config/config-dict-list/config-dict-list.service';
import { map } from 'rxjs/operators';

@Component({
  selector: 'app-sale-details',
  templateUrl: './sale-details.component.html',
  styleUrls: ['./sale-details.component.scss']
})
export class SaleDetailsComponent implements OnInit {
  /**
   * 售后单id
   */
  id: number = 0;
  /**
   * 跟进模态框
   */
  followVisible: boolean = false;
  /**
   * 物流信息模态框
   */
  flowVisible: boolean = false;
  /**
   * 物流公司模态框
   */
  logisticsVisible: boolean = false;
  /**
   * 售后处理模态框
   */
  saleVisible: boolean = false;
  /**
   * 详情数据
   */
  detailsData: any = null;
  /**
   * 上传val
   */
  inputVal: any = null;
  /**
   * 跟进参数
   */
  followParam: any = {
    // 关联信息(订单号 售后单号 客户id 出库单号)
    relationInformation: "",
    // 1、订单 2、售后 3、客户 4、出库
    type: 2,
    // 文件列表
    enclosure: [],
    // 备注
    content: "",
  }
  /**
   * 物流数据
   */
  logisticDetails: Array<{ station: string, time: string }> = [];
  /**
   * 跟进内容
   */
  followList: any = [];
  /**
   * 查询收货地址参数
   */
  siteParam = {
    // 简称
    name: "",
    // 多少页，默认1
    page: 1,
    // 每页多少条，默认10
    pageSize: 10
  }
  /**
   * 查询物流参数
   */
  companyParam = {
    // 名称或者编码搜索
    parentKey: "logistics_company",
    // 多少页，默认1
    pageNum: 1,
    // 每页多少条，默认10
    pageSize: 10
  }
  /**
   * 查询售后拒绝原因参数
   */
  refuseReasonParam = {
    // 名称或者编码搜索
    parentKey: "after_sales_service_refuse_reason",
    // 多少页，默认1
    pageNum: 1,
    // 每页多少条，默认10
    pageSize: 10
  }
  /**
   * 查询售后原因参数
   */
  reasonParam = {
    // 名称或者编码搜索
    parentKey: "after_sales_service_reason",
    // 多少页，默认1
    pageNum: 1,
    // 每页多少条，默认10
    pageSize: 10
  }

  /**
   * 修改物流公司参数
   */
  logisticsParam = {
    // 售后单id
    refundId: 0,
    // 物流公司
    expressType: "",
    // 物流单号
    expressNum: "",
  }
  /**
   * 售后处理参数
   */
  saleParam: any = {
    // 售后处理类型：1-第一次售后处理、2-第二次售后处理
    updateType: 1,
    // 售后单id
    refundId: 0,
    // 处理意见：0-同意、1-不同意
    agreeType: "0",
    // 跟进备注
    followText: "",
    // 退货地址ID
    addrId: 0,
    // 审核备注
    auditNote: "",
    // 拒绝原因
    refuseReason: "",
    // 售后不通过时退还客户商品物流单类型
    refundExpressType: "",
    // 售后不通过时退还客户商品物流单号
    refundExpressNum: "",
    // 审核不通过时，由客服上传的图片信息：["url1", "url2"]
    imgs2: [],
  }

  /**
   * 收货地址列表
   */
  addressOption: {
    addressList: Array<{ id: Number, name: string, region: string, address: string }>,
    isLoading: boolean
  } = {
      addressList: [],
      isLoading: false,
    }
  /**
   * 物流公司列表
   */
  expressOption: {
    expressList: Array<{ name: string, content: string }>,
    isLoading: boolean
  } = {
      expressList: [],
      isLoading: false,
    }
  /**
   * 售后原因 售后拒绝原因列表
   */
  noteOption: {
    noteList: Array<{ content: string }>,
    isLoading: boolean
  } = {
      noteList: [],
      isLoading: false,
    }

  /**
   * 加载失败显示图像占位符
   */
  fallback =
    'data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAAMIAAADDCAYAAADQvc6UAAABRWlDQ1BJQ0MgUHJvZmlsZQAAKJFjYGASSSwoyGFhYGDIzSspCnJ3UoiIjFJgf8LAwSDCIMogwMCcmFxc4BgQ4ANUwgCjUcG3awyMIPqyLsis7PPOq3QdDFcvjV3jOD1boQVTPQrgSkktTgbSf4A4LbmgqISBgTEFyFYuLykAsTuAbJEioKOA7DkgdjqEvQHEToKwj4DVhAQ5A9k3gGyB5IxEoBmML4BsnSQk8XQkNtReEOBxcfXxUQg1Mjc0dyHgXNJBSWpFCYh2zi+oLMpMzyhRcASGUqqCZ16yno6CkYGRAQMDKMwhqj/fAIcloxgHQqxAjIHBEugw5sUIsSQpBobtQPdLciLEVJYzMPBHMDBsayhILEqEO4DxG0txmrERhM29nYGBddr//5/DGRjYNRkY/l7////39v///y4Dmn+LgeHANwDrkl1AuO+pmgAAADhlWElmTU0AKgAAAAgAAYdpAAQAAAABAAAAGgAAAAAAAqACAAQAAAABAAAAwqADAAQAAAABAAAAwwAAAAD9b/HnAAAHlklEQVR4Ae3dP3PTWBSGcbGzM6GCKqlIBRV0dHRJFarQ0eUT8LH4BnRU0NHR0UEFVdIlFRV7TzRksomPY8uykTk/zewQfKw/9znv4yvJynLv4uLiV2dBoDiBf4qP3/ARuCRABEFAoBEgghggQAQZQKAnYEaQBAQaASKIAQJEkAEEegJmBElAoBEgghggQAQZQKAnYEaQBAQaASKIAQJEkAEEegJmBElAoBEgghggQAQZQKAnYEaQBAQaASKIAQJEkAEEegJmBElAoBEgghggQAQZQKAnYEaQBAQaASKIAQJEkAEEegJmBElAoBEgghggQAQZQKAnYEaQBAQaASKIAQJEkAEEegJmBElAoBEgghggQAQZQKAnYEaQBAQaASKIAQJEkAEEegJmBElAoBEgghggQAQZQKAnYEaQBAQaASKIAQJEkAEEegJmBElAoBEgghggQAQZQKAnYEaQBAQaASKIAQJEkAEEegJmBElAoBEgghggQAQZQKAnYEaQBAQaASKIAQJEkAEEegJmBElAoBEgghggQAQZQKAnYEaQBAQaASKIAQJEkAEEegJmBElAoBEgghggQAQZQKAnYEaQBAQaASKIAQJEkAEEegJmBElAoBEgghggQAQZQKAnYEaQBAQaASKIAQJEkAEEegJmBElAoBEgghgg0Aj8i0JO4OzsrPv69Wv+hi2qPHr0qNvf39+iI97soRIh4f3z58/u7du3SXX7Xt7Z2enevHmzfQe+oSN2apSAPj09TSrb+XKI/f379+08+A0cNRE2ANkupk+ACNPvkSPcAAEibACyXUyfABGm3yNHuAECRNgAZLuYPgEirKlHu7u7XdyytGwHAd8jjNyng4OD7vnz51dbPT8/7z58+NB9+/bt6jU/TI+AGWHEnrx48eJ/EsSmHzx40L18+fLyzxF3ZVMjEyDCiEDjMYZZS5wiPXnyZFbJaxMhQIQRGzHvWR7XCyOCXsOmiDAi1HmPMMQjDpbpEiDCiL358eNHurW/5SnWdIBbXiDCiA38/Pnzrce2YyZ4//59F3ePLNMl4PbpiL2J0L979+7yDtHDhw8vtzzvdGnEXdvUigSIsCLAWavHp/+qM0BcXMd/q25n1vF57TYBp0a3mUzilePj4+7k5KSLb6gt6ydAhPUzXnoPR0dHl79WGTNCfBnn1uvSCJdegQhLI1vvCk+fPu2ePXt2tZOYEV6/fn31dz+shwAR1sP1cqvLntbEN9MxA9xcYjsxS1jWR4AIa2Ibzx0tc44fYX/16lV6NDFLXH+YL32jwiACRBiEbf5KcXoTIsQSpzXx4N28Ja4BQoK7rgXiydbHjx/P25TaQAJEGAguWy0+2Q8PD6/Ki4R8EVl+bzBOnZY95fq9rj9zAkTI2SxdidBHqG9+skdw43borCXO/ZcJdraPWdv22uIEiLA4q7nvvCug8WTqzQveOH26fodo7g6uFe/a17W3+nFBAkRYENRdb1vkkz1CH9cPsVy/jrhr27PqMYvENYNlHAIesRiBYwRy0V+8iXP8+/fvX11Mr7L7ECueb/r48eMqm7FuI2BGWDEG8cm+7G3NEOfmdcTQw4h9/55lhm7DekRYKQPZF2ArbXTAyu4kDYB2YxUzwg0gi/41ztHnfQG26HbGel/crVrm7tNY+/1btkOEAZ2M05r4FB7r9GbAIdxaZYrHdOsgJ/wCEQY0J74TmOKnbxxT9n3FgGGWWsVdowHtjt9Nnvf7yQM2aZU/TIAIAxrw6dOnAWtZZcoEnBpNuTuObWMEiLAx1HY0ZQJEmHJ3HNvGCBBhY6jtaMoEiJB0Z29vL6ls58vxPcO8/zfrdo5qvKO+d3Fx8Wu8zf1dW4p/cPzLly/dtv9Ts/EbcvGAHhHyfBIhZ6NSiIBTo0LNNtScABFyNiqFCBChULMNNSdAhJyNSiECRCjUbEPNCRAhZ6NSiAARCjXbUHMCRMjZqBQiQIRCzTbUnAARcjYqhQgQoVCzDTUnQIScjUohAkQo1GxDzQkQIWejUogAEQo121BzAkTI2agUIkCEQs021JwAEXI2KoUIEKFQsw01J0CEnI1KIQJEKNRsQ80JECFno1KIABEKNdtQcwJEyNmoFCJAhELNNtScABFyNiqFCBChULMNNSdAhJyNSiECRCjUbEPNCRAhZ6NSiAARCjXbUHMCRMjZqBQiQIRCzTbUnAARcjYqhQgQoVCzDTUnQIScjUohAkQo1GxDzQkQIWejUogAEQo121BzAkTI2agUIkCEQs021JwAEXI2KoUIEKFQsw01J0CEnI1KIQJEKNRsQ80JECFno1KIABEKNdtQcwJEyNmoFCJAhELNNtScABFyNiqFCBChULMNNSdAhJyNSiECRCjUbEPNCRAhZ6NSiAARCjXbUHMCRMjZqBQiQIRCzTbUnAARcjYqhQgQoVCzDTUnQIScjUohAkQo1GxDzQkQIWejUogAEQo121BzAkTI2agUIkCEQs021JwAEXI2KoUIEKFQsw01J0CEnI1KIQJEKNRsQ80JECFno1KIABEKNdtQcwJEyNmoFCJAhELNNtScABFyNiqFCBChULMNNSdAhJyNSiEC/wGgKKC4YMA4TAAAAABJRU5ErkJggg==';

  /**
   * 全局 loading
   */
  messageId: string = "";
  constructor(
    private router: Router,
    private activatedRoute: ActivatedRoute,
    private SaleDetailsService: SaleDetailsService,
    private ConfigDictListService: ConfigDictListService,
    private message: NzMessageService,
    private modal: NzModalService,
  ) { }

  ngOnInit(): void {
    this.activatedRoute.params.subscribe((params) => {
      this.id = params.id;
    })
    this.initHttp();
    this.loadMore();
  }

  /**
   * 初始化http请求
   */
  initHttp() {
    // 并联请求
    let postArr = [];
    // 获取详情
    postArr.push(this.SaleDetailsService.getDetails(this.id).pipe((data) => {
      return data;
    }));
    forkJoin(postArr)
      .subscribe((data: any) => {
        // 售后详情
        let details = data[0];

        if (details) {
          this.detailsData = details.data;
          this.detailsData.imgs = this.detailsData.imgs ? JSON.parse(this.detailsData.imgs) : [];
          this.detailsData.imgs2 = this.detailsData.imgs2 ? JSON.parse(this.detailsData.imgs2) : [];
          this.logisticsParam.expressType = this.detailsData.express ? this.detailsData.express.expressCode : "";
          this.logisticsParam.expressNum = this.detailsData.express ? this.detailsData.express.expressNum : "";
        }

        // this.detailsData.status = 4;
        // this.saleParam.updateType = 2;
      }, err => {
        this.removeBasicMessage();
        this.createMessage("error", err.message);
      });
  }
  /**
   * 跳转商品详情
   */
  toGoodsInfo(goodsId: any) {
    this.router.navigate(['goods/goodsTabs', goodsId]);
  }
  /**
   * 打开模态框(跟进) 初始化
   * @param id 
   */
  followModal(relationInformation: any): void {
    this.followParam.relationInformation = relationInformation;
    this.followerLst();
  }

  /**
   * 打开模态框(修改物流公司) 初始化
   * @param id 
   */
  logisticsModal(): void {
    this.logisticsVisible = true;
    this.companyParam.pageNum = 1;
    this.companyParam.pageSize = 10;
    this.expressOption.expressList = [];
    this.loadCompanyMore();
  }
  /**
   * 打开模态框(售后处理) 初始化
   * @param id 
  */
  saleModal(): void {
    this.saleVisible = true;
    this.saleParam.refundId = this.id;
    this.saleParam.updateType = this.detailsData.status == 0 ? 1 : this.detailsData.status == 4 ? 2 : 1;
    this.companyParam.pageNum = 1;
    this.companyParam.pageSize = 10;
    this.expressOption.expressList = [];

    this.refuseReasonParam.pageNum = 1;
    this.refuseReasonParam.pageSize = 10;
    this.reasonParam.pageNum = 1;
    this.reasonParam.pageSize = 10;
    this.noteOption.noteList = [];

    this.loadCompanyMore();
    this.loadNoteMore();

  }

  /**
   * 模态框关闭触发
   */
  handleCancel(): void {

    this.flowVisible = false;
    this.logisticsVisible = false;
    this.saleVisible = false;
    this.followVisible = false;

    this.followParam.content = "";
    this.followParam.enclosure = [];
    this.inputVal = null;
  }
  /**
   * 文件上传完成回调
   * @param files 
   * @param type  1:售后附件 2:跟进附件
   */
  handleFileInput(files: any, type: Number) {
    let fileArr = files.target.files;
    for (let index = 0; index < fileArr.length; index++) {
      const element = fileArr[index];
      this.postFile(element, (res: any) => {
        if (res.code != 0) {
          return;
        }
        if (type == 1) {
          this.saleParam.imgs2.push(res.data);
        }
        // 上传类型
        if (type == 2) {
          this.followParam.enclosure.push({
            // 显示地址
            showUrl: element.name,
            // 图片地址
            url: res.data,
          });
        }
        this.inputVal = null;
      });
    }
  }
  /**
   * 删除跟进图片
   */
  deleteFollowImg(index: any) {
    this.inputVal = null;
    this.followParam.enclosure = this.followParam.enclosure.filter((item: any, i: any) => {
      return i != index;
    });
  }

  /**
   * 确认修改物流公司
   */
  confirmLogistics() {
    if (this.messageId != "") {
      return;
    }
    if (!this.logisticsParam.expressType) {
      return this.createMessage("warning", "请输入物流公司");
    }
    if (!this.logisticsParam.expressNum) {
      return this.createMessage("warning", "请输入物流单号");
    }
    this.logisticsParam.refundId = this.id;
    this.createBasicMessage();
    this.SaleDetailsService.updateExpress(this.logisticsParam).subscribe((res: any) => {
      this.removeBasicMessage();
      if (res.code != 0) {
        this.createMessage("error", res.message);
        return;
      }
      this.createMessage("success", "修改物流公司成功");
      this.handleCancel();
      this.initHttp();
      // this.getDetails();
    }, err => {
      this.removeBasicMessage();
      this.createMessage("error", err.message);
    })
  }
  /**
   * 确认修改 售后处理
   */
  saleConfirm() {
    if (this.messageId != "") {
      return;
    }
    // this.detailsData.type = 2;
    if (!this.saleParam.addrId && this.detailsData.status == 0 && this.saleParam.agreeType == "0" && this.detailsData.type <= 2) {
      return this.createMessage("warning", "请选择换货地址");
    }
    if (!this.saleParam.refuseReason && this.saleParam.agreeType == "1") {
      return this.createMessage("warning", "请选择拒绝原因");
    }
    if (!this.saleParam.auditNote && this.saleParam.agreeType == "1") {
      return this.createMessage("warning", "请输入备注");
    }

    // 处理意见:不同意 
    if (this.saleParam.agreeType == "1") {
      return this.showConfirm("确定拒绝吗？用户可以看到原因和备注，请注意言辞哦");
    }

    // 售后方式:退货/换货 售后状态:用户申请(第一次处理) 处理意见:同意 
    if (this.detailsData.type <= 2 && this.detailsData.status == 0 && this.saleParam.agreeType == "0") {
      return this.showConfirm("确定同意？");
    }

    // 售后方式:退款 售后状态:用户申请(第一次处理) 处理意见:同意 
    if (this.detailsData.type >= 4 && this.detailsData.status == 0 && this.saleParam.agreeType == "0") {
      return this.showConfirm("确定同意？订单将直接退款【" + this.detailsData.refundPrice + "】元到客户");
    }


    // 售后方式:退货/换货 售后状态:待平台审核(第二次处理) 处理意见:同意 
    if (this.detailsData.type <= 2 && this.detailsData.status == 4 && this.saleParam.agreeType == "0") {
      return this.showConfirm("确定同意？订单将直接退款【" + this.detailsData.refundPrice + "】元到客户");
    }

    // this.createBasicMessage();
  }
  /**
   * 收货地址,下拉加载更多
   */
  loadMore(): void {
    this.addressOption.isLoading = true;
    this.SaleDetailsService.getSiteList(this.siteParam).subscribe(res => {
      this.addressOption.isLoading = false;
      this.addressOption.addressList = ([...this.addressOption.addressList, ...res.data.records] as []);

      if (res.data.records.length != 0) {
        this.siteParam.page++;
      }
    });
  }
  /**
   * 物流公司,下拉加载更多
   */
  loadCompanyMore(): void {
    this.expressOption.isLoading = true;
    this.ConfigDictListService.getDictList(this.companyParam).subscribe(res => {
      this.expressOption.isLoading = false;
      this.expressOption.expressList = ([...this.expressOption.expressList, ...res.data.list.records] as []);
      if (res.data.list.records.length != 0) {
        this.companyParam.pageNum++;
      }
    });
  }
  /**
   * 售后原因 售后拒绝原因,下拉加载更多
   */
  loadNoteMore(): void {
    this.noteOption.isLoading = true;
    // if (this.detailsData.status == 0) {
    this.ConfigDictListService.getDictList(this.refuseReasonParam).subscribe(res => {
      this.noteOption.isLoading = false;
      this.noteOption.noteList = ([...this.noteOption.noteList, ...res.data.list.records] as []);
      if (res.data.list.records.length != 0) {
        this.refuseReasonParam.pageNum++;
      }
    });
    // } else {
    //   this.ConfigDictListService.getDictList(this.reasonParam).subscribe(res => {
    //     this.noteOption.isLoading = false;
    //     this.noteOption.noteList = ([...this.noteOption.noteList, ...res.data.list.records] as []);
    //     if (res.data.list.records.length != 0) {
    //       this.reasonParam.pageNum++;
    //     }
    //   });
    // }
  }
  /**
   * 售后处理修改
   */
  updateOrder(): Promise<unknown> {
    this.createBasicMessage();
    return new Promise((resolve, reject) => {
      this.SaleDetailsService.updateOrder(this.saleParam).subscribe((res: any) => {
        this.removeBasicMessage();
        if (res.code != 0) {
          this.createMessage("error", res.message);
          return;
        }
        resolve(res);
      }, err => {
        this.removeBasicMessage();
        this.createMessage("error", err.message);
      })
    });
  }
  /**
   * 物流查询
   */
  findOrderExpress(expressObj: { expressNum: String, expressCode: String }) {
    if (this.messageId != "" || !expressObj) {
      return;
    }
    // expressObj.expressNum = "YT5496012376639"
    // expressObj.expressCode = "YTO"
    this.createBasicMessage();
    this.SaleDetailsService.findOrderExpress({ expressNum: expressObj.expressNum, expressCode: expressObj.expressCode }).subscribe((res: any) => {
      this.removeBasicMessage();
      if (res.code != 0) {
        this.createMessage("error", res.message);
        return;
      }
      if (!res.data.expressTraces) {
        return this.createMessage("warning", "没有物流信息");
      }

      this.logisticDetails = JSON.parse(res.data.expressTraces).map((item: any) => {
        return {
          station: item.station,
          time: item.time,
        }
      });
      this.flowVisible = true;
    }, err => {
      this.removeBasicMessage();
      this.createMessage("error", err.message);
    })
  }
  /**
   * 新增跟进
   */
  followerSave() {
    if (this.messageId != "") {
      return;
    }
    if (!this.followParam.content) {
      return this.createMessage("warning", "请输入备注");
    }
    this.createBasicMessage();
    this.SaleDetailsService.followerSave(this.followParam).subscribe((res: any) => {
      this.removeBasicMessage();
      if (res.code != 0) {
        this.createMessage("error", res.message);
        return;
      }
      this.handleCancel();
      this.createMessage("success", "跟进信息成功");
      this.initHttp();
    }, err => {
      this.removeBasicMessage();
      this.createMessage("error", err.message);
    })
  }
  /**
   * 跟进查询
   */
  followerLst() {
    if (this.messageId != "") {
      return;
    }
    this.createBasicMessage();
    this.SaleDetailsService.followerLst(this.followParam).subscribe((res: any) => {
      this.removeBasicMessage();
      if (res.code != 0) {
        this.createMessage("error", res.message);
        return;
      }
      this.followVisible = true;
      this.followList = res.data;
      for (let index = 0; index < this.followList.length; index++) {
        let element = this.followList[index];
        element.enclosure = element.enclosure ? element.enclosure.split(',') : [];
      }
    }, err => {
      this.removeBasicMessage();
      this.createMessage("error", err.message);
    })
  }
  /**
   * 只保留文件名加后缀
   */
  formUrl(url: String) {
    return url.substr(url.lastIndexOf('/') + 1);
  }
  /**
   * 上传文件
   * @param su 上传完成回调函数
   */
  postFile(file: any, su: any) {
    this.SaleDetailsService.postFile(file).subscribe(data => {
      if (su) su(data);
    }, error => {

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
    this.messageId = "";
  }
  /**
   * 全局展示操作反馈信息
   * @param type 其他提示类型 success:成功 error:失败 warning：警告
   */
  createMessage(type: any, str: any): void {
    this.message.create(type, str);
  }
  /**
   * 确认提示框
   * @param c 提示内容
   */
  showConfirm(c: string): void {
    this.modal.confirm({
      nzTitle: '提示',
      nzContent: c,
      nzOnOk: () => {
        this.updateOrder().then((res) => {
          // 处理意见:不同意 
          if (this.saleParam.agreeType == "1") {
            return this.success("操作成功！");
          }
          // 售后方式:退货/换货 售后状态:已申请 处理意见:同意 
          if (this.detailsData.type <= 2 && this.detailsData.status == 0 && this.saleParam.agreeType == "0") {
            return this.success("操作成功！");
          }
          // 售后方式:退款 售后状态:已申请 处理意见:同意 
          if (this.detailsData.type >= 4 && this.detailsData.status == 0 && this.saleParam.agreeType == "0") {
            return this.success("退款成功！");
          }
          // 售后方式:退货/换货 售后状态:待平台审核 处理意见:同意 
          if (this.detailsData.type <= 2 && this.detailsData.status == 4 && this.saleParam.agreeType == "0") {
            return this.success("退款成功！");
          }
        });;
      }
    });
  }
  /**
   * 成功提示框
   */
  success(c: string): void {
    this.modal.success({
      nzTitle: '提示',
      nzContent: c,
      nzOnOk: () => {
        this.handleCancel();
        this.initHttp();
      }
    });
  }


}
