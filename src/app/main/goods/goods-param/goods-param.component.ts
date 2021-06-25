import { Component, ElementRef, ViewChild, OnInit } from '@angular/core';
import { NzMessageService } from 'ng-zorro-antd/message';
import { CdkDragDrop, moveItemInArray } from '@angular/cdk/drag-drop';

import { GoodsParamService } from './goods-param.service';
import { GoodsTabsService } from '../goods-tabs/goods-tabs.service';
@Component({
  selector: 'app-goods-param',
  templateUrl: './goods-param.component.html',
  styleUrls: ['./goods-param.component.scss']
})
export class GoodsParamComponent implements OnInit {
  // 商品详情数据(公共)
  detailsData: any = null;

  // // 当前分类
  // selectAttr = null;
  // // 属性分类下拉
  // goodsTypesArr: any = []
  // listOfOption: any = [];
  // listOfSelectedValue: any = [];
  // isLoadingOne = false;
  // listOfData: any = [];

  /**
  * 接口参数
  */
  entityParam: any = {
    id: null,
    updateType: "5",
    // 格式按照自己所需定好
    goodsParam: [
      // {
      //   "name": "颜色",
      //   "list": [
      //     {
      //       key: "1",
      //       val: "2"
      //     }
      //   ],
      // },
    ],
    refId: ""
  }

  inputVisible = false;
  inputValue = '';
  @ViewChild('inputElement', { static: false }) inputElement?: ElementRef;

  /**
   * 全局 loading
   */
  messageId: any = null;

  constructor(
    private GoodsTabsService: GoodsTabsService,
    private GoodsParamService: GoodsParamService,
    private message: NzMessageService
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
    this.entityParam.goodsParam = this.detailsData.goodsParam ? JSON.parse(this.detailsData.goodsParam) : [];
    this.entityParam.refId = this.detailsData.refId;
  }
  /**
   * 保存
   */
  save() {
    this.createBasicMessage();
    this.GoodsParamService.update(this.entityParam).subscribe((res: any) => {
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
   * 参数大类删除
   * @param fid 
   */
  fDelete(fid:any){
    this.entityParam.goodsParam = this.entityParam.goodsParam.filter((item: any, key: any) => {
      return key != fid;
    });
  }
  /**
   * 参数详情删除
   * @param cid 子索引
   * @param fid 父索引
   */
  delete(cid: any, fid: any) {
    this.entityParam.goodsParam[fid].list = this.entityParam.goodsParam[fid].list.filter((item: any, key: any) => {
      return key != cid;
    });
  }
  /**
   * 添加参数详情
   * @param index 
   */
  addItem(index: any) {
    this.entityParam.goodsParam[index].list.push({
      "key": "",
      "val": "",
    })
  }
  /**
   * 显示参数输入框
   */
  showInput(): void {
    this.inputVisible = true;
    setTimeout(() => {
      this.inputElement?.nativeElement.focus();
    }, 10);
  }
  /**
   * 参数大类 输入框取消焦点
   * @returns 
   */
  handleInputConfirm(): void {
    let index = this.entityParam.goodsParam.findIndex((item: any) => { return item.name == this.inputValue; });
    if (index == -1 && this.inputValue != "") {
      this.entityParam.goodsParam.push({
        "name": this.inputValue,
        "list": [{
          "key": "",
          "val": "",
        }],
      })
    }

    this.inputValue = '';
    this.inputVisible = false;
  }
  /**
   * 参数大类拖拽
   * @param event 
   */
  drop(event: CdkDragDrop<string[]>) {
    moveItemInArray(this.entityParam.goodsParam, event.previousIndex, event.currentIndex);
  }
  /**
   * 参数详情拖拽
   * @param fid 父id
   * @param event 
   */
  itemDrop(fid: any, event: CdkDragDrop<string[]>) {
    moveItemInArray(this.entityParam.goodsParam[fid].list, event.previousIndex, event.currentIndex);
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
