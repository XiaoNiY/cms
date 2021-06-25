import { Component, OnInit } from '@angular/core';
import { NzMessageService } from 'ng-zorro-antd/message';
import { ActivatedRoute, Router } from '@angular/router';
import { forkJoin } from 'rxjs';
import { OutDetailsService } from './out-details.service';
import { ConfigDictListService } from '../../config/config-dict-list/config-dict-list.service';
@Component({
  selector: 'app-out-details',
  templateUrl: './out-details.component.html',
  styleUrls: ['./out-details.component.scss']
})
export class OutDetailsComponent implements OnInit {
  /**
   * 商品详情数据(公共)
   */
  detailsData: any = {
    id: null
  };
  /**
   * 字典列表
   */
  dict :any= {
    // 品质列表
    qualityList: [],
    // 出库类型列表
    outTypeList: [],
    // 物流公司列表
    companyList: [],
  }

  /**
   * 全局 loading
   */
  messageId: any = null;
  constructor(
    private router: Router,
    private message: NzMessageService,
    private activatedRoute: ActivatedRoute,
    private OutDetailsService: OutDetailsService,
    private ConfigDictListService: ConfigDictListService,
  ) { }

  ngOnInit(): void {
    this.activatedRoute.params.subscribe((params) => {
      this.detailsData.id = params.id;
    })

    // 并联请求
    let postArr = [];
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

    postArr.push(this.ConfigDictListService.getDictList({
      // 名称或者编码搜索
      parentKey: "logistics_company",
      // 多少页，默认1
      pageNum: 1,
      // 每页多少条，默认10
      pageSize: 999
    }).pipe((data) => {
      return data;
    }));

    if (this.detailsData.id != 0) {
      postArr.push(this.OutDetailsService.getDetails(this.detailsData.id)
        .pipe((data) => {
          return data;
        }));
    }

    forkJoin(postArr)
      .subscribe((data: any) => {
        // 出库类型列表
        let outTypeList = data[0];
        // 仓库商品品质列表
        let qualityList = data[1];
        // 物流公司列表
        let companyList = data[2];
        // 采购单详情
        let details = data[3];

        this.dict.outTypeList = outTypeList.data.list.records;
        this.dict.qualityList = qualityList.data.list.records;
        this.dict.companyList = companyList.data.list.records;

        if (details) {
          this.detailsData = details.data;
        }
      }, err => {
        this.removeBasicMessage();
        this.createMessage("error", err.message);
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
  /**
   * 物流公司转文字
   * @returns 
   */
  express_to_Text(express: String) {
    let text: any = this.dict.companyList.filter(function (item: any) { return item.content == express });
    text = text[0] ? text[0].name : '-'
    return text;
  }
  /**
   * 品质转文字
   * @returns 
   */
  quality_to_Text(quality: String) {
    let text: any = this.dict.qualityList.filter(function (item: any) { return item.content == quality });
    text = text[0] ? text[0].name : '-'
    return text;
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
