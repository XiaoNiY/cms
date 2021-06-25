import { Component, OnInit } from '@angular/core';
import { forkJoin } from 'rxjs';


import { GoodsTabsService } from '../goods-tabs/goods-tabs.service';
import { GoodsInfoBService } from './goods-info-b.service';

import { NzMessageService } from 'ng-zorro-antd/message';

declare var UE: any;

@Component({
  selector: 'app-goods-info-b',
  templateUrl: './goods-info-b.component.html',
  styleUrls: ['./goods-info-b.component.scss']
})
export class GoodsInfoBComponent implements OnInit {
  /**
   * 商品详情数据(公共)
   */
  detailsData: any = null;
  /**
   * 详细信息B端
   */
  introductionB: any = null;
  /**
   * 预览效果
   */
  viewContent = null;
  /**
   * 是否使用C端详情
   */
  checked = false;
  /**
   * 参数
   */
  json: any = {
    id: null,
    updateType: "6",
    // 商品详情（富文本）
    introduction: "",
    // 被复制的商品id
    refId: "0"
  }
  /**
   * 富文本 实例化对象
   */
  myeditor: any = null;

  /**
   * 全局 loading
   */
  messageId: any = null;
  /**
   * fileVal
   */
  fileObj: any = null;
  constructor(
    private GoodsTabsService: GoodsTabsService,
    private GoodsInfoBService: GoodsInfoBService,
    private message: NzMessageService
  ) { }

  ngOnInit(): void {
    this.myeditor = UE.getEditor('editorB', {
      toolbars: [[]],
      elementPathEnabled: false,
      wordCount: false //是否开启字数统计
    });
    this.GoodsTabsService.updateFun = () => {
      this.initData();
    }
    this.initData();
  }
  initData(){
    this.detailsData = this.GoodsTabsService.detailsData;
    this.json.id = this.detailsData.id;
    this.json.introduction = this.detailsData.introduction || "";

    setTimeout(() => {
      this.myeditor.setContent(this.json.introduction);
    }, 100);
  }
  ngOnDestroy() {
    this.myeditor.destroy();
  }
  /**
   * 文件上传完成回调
   * @param files 
   */
  handleFileInput(files: any) {
    let fileArr = files.target.files;
    // 并联请求
    let postArr = [];

    for (let index = 0; index < fileArr.length; index++) {
      const element = fileArr[index];
      postArr.push(this.postFile(element));
    }
    forkJoin(postArr)
      .subscribe((imgArr: any) => {
        for (let index = 0; index < imgArr.length; index++) {
          const element = imgArr[index];
          this.myeditor.execCommand("inserthtml", "<img style='width:100%' src='" + element.data + "' />");
        }
      }, err => {
      });
    this.fileObj = "";
  }
  /**
   * 保存
   */
  submit() {
    if (this.messageId != null) {
      return;
    }
    this.json.introduction = this.myeditor.getContent();
    if (this.json.introduction == "") {
      return this.createMessage("warning", "详细信息不能为空");
    }
    this.createBasicMessage();
    this.GoodsInfoBService.update(this.json).subscribe((res: any) => {
      this.removeBasicMessage();
      if (res.code != 0) {
        this.createMessage("error", res.message);
        return;
      }
      this.GoodsTabsService.updateDetails();
      this.createMessage("success", "保存成功");
      // this.router.navigate(['home/goods/goodsAll']);
    }, err => {
      this.createMessage("error", err.message);
      this.removeBasicMessage();
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
   * @param type 其他提示类型 success:成功 error:失败 warning：警告
   */
  createMessage(type: any, str: any): void {
    this.message.create(type, str);
  }

  /**
   * 上传文件
   * @param su 上传完成回调函数
   */
  postFile(file: any) {
    return this.GoodsInfoBService.postFile(file).pipe((data) => { return data; })
  }

}
