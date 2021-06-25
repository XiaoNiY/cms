import { Component, OnInit } from '@angular/core';
import { NzUploadFile } from 'ng-zorro-antd/upload';

import { NzMessageService } from 'ng-zorro-antd/message';

import { GoodsTabsService } from '../goods-tabs/goods-tabs.service';
import { GoodsInfoCService } from './goods-info-c.service';

declare var UE: any;

@Component({
  selector: 'app-goods-info-c',
  templateUrl: './goods-info-c.component.html',
  styleUrls: ['./goods-info-c.component.scss']
})
export class GoodsInfoCComponent implements OnInit {
  /**
   * 商品详情数据(公共)
   */
  detailsData: any = null;
  introductionC: any = null;
  /**
   * 参数
   */
  json: any = {
    id: null,
    updateType: "4",
    // 富文本内容
    introductionC: ""
  }
  /**
   * 预览效果
   */
  viewContent = null;
  viewTime: any = null;
  /**
   * 富文本 实例化对象
   */
  myeditor: any = null;

  /**
   * 全局 loading
   */
  messageId: any = null;


  constructor(
    private GoodsTabsService: GoodsTabsService,
    private GoodsInfoCService: GoodsInfoCService,
    private message: NzMessageService
  ) { }

  ngOnInit(): void {
    this.detailsData = this.GoodsTabsService.detailsData;
    this.json.id = this.detailsData.id;
    this.introductionC = this.detailsData.introductionC || "";

    this.myeditor = UE.getEditor('editorC', {
      toolbars: [[]],
      elementPathEnabled: false,
      wordCount: false //是否开启字数统计
    });
    setTimeout(() => {
      this.myeditor.setContent(this.introductionC);
      this.viewContent = this.introductionC;
    }, 100);


    this.viewTime = setInterval(() => {
      this.viewContent = this.myeditor.getContent()
    }, 1000);
  }
  ngOnDestroy() {
    clearInterval(this.viewTime);
    this.myeditor.destroy();
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
          this.createMessage("error", res.message);
          return;
        }
        this.myeditor.execCommand("inserthtml", "<img style='width:100%' src='" + res.data + "' />");

      });
    }
  }
  submit() {
    if (this.messageId != null) {
      return;
    }

    this.json.introductionC = this.myeditor.getContent();

    this.createBasicMessage();
    this.GoodsInfoCService.update(this.json).subscribe((res: any) => {
      this.removeBasicMessage();
      if (res.code != 0) {
        this.createMessage("error", res.message);
        return;
      }
      this.createMessage("success", "保存成功");
    }, err => {
      this.createMessage("error", err.message);
      this.removeBasicMessage();
    });
  }

  /**
   * 上传文件
   * @param su 上传完成回调函数
   */
  postFile(file: any, su: any) {
    this.GoodsInfoCService.postFile(file).subscribe(data => {
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
