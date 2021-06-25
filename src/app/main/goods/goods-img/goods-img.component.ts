import { Component, OnInit } from "@angular/core";
import { CdkDragDrop, moveItemInArray } from '@angular/cdk/drag-drop';

import { NzMessageService } from 'ng-zorro-antd/message';

import { GoodsTabsService } from '../goods-tabs/goods-tabs.service';
import { GoodsImgService } from './goods-img.service';
import { Global } from '../../../shared/global';

function getBase64(file: File): Promise<string | ArrayBuffer | null> {
  return new Promise((resolve, reject) => {
    const reader = new FileReader();
    reader.readAsDataURL(file);
    reader.onload = () => resolve(reader.result);
    reader.onerror = error => reject(error);
  });
}
@Component({
  selector: 'app-goods-img',
  templateUrl: './goods-img.component.html',
  styleUrls: ['./goods-img.component.scss']
})
export class GoodsImgComponent implements OnInit {
  // FTP预览地址( 原图 )
  // FTP_SHOW_URL_ORIGINAL = "";
  /**
   * 商品详情数据(公共)
   */
  detailsData: any = null;
  /**
   * 请求参数
   */
  json: any = {
    id: null,
    updateType: "4",
    //  图片列表
    imgs: [],
    // 视频地址
    videoUrl: "",
    // 视频封面
    videoImg: "",
    // 视频宽高
    videoWh: null,
    // 视频时间
    videoTime: null,
    // 视频封面类型：默认0，1-商品主图封面、2-视频封面
    videoImgType: 0,
  }
  /**
   * 上传val
   */
  inputVal:any = null;
  /**
   * 上传图片文件列表
   */
  fileList: any[] = [];
  /**
   * 全局 loading
   */
  messageId: any = null;
  // 加载失败显示图像占位符
  fallback =
    'data:image/png;base64,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';
  constructor(
    private GoodsTabsService: GoodsTabsService,
    private GoodsImgService: GoodsImgService,
    private message: NzMessageService
  ) { }
  ngOnInit(): void {
    // this.FTP_SHOW_URL_ORIGINAL = Global.dictData.filter((item: any) => {
    //   return item.dictKey == "FTP_SHOW_URL_ORIGINAL";
    // })[0].content;
    
    this.GoodsTabsService.updateFun = () => {
      this.initData();
    }
    this.initData();
  }
  initData() {
    this.detailsData = this.GoodsTabsService.detailsData;
    this.json.id = this.detailsData.id;
    this.fileList = JSON.parse(this.detailsData.imgs) || [];
    this.json.videoWh = this.detailsData.videoWh || "";
    this.json.videoTime = this.detailsData.videoTime || "";
    this.json.videoUrl = this.detailsData.videoUrl || "";
    this.json.videoImgType = this.detailsData.videoImgType + "";
    this.json.videoImg = this.detailsData.videoImg;
  }
  /**
   * 文件上传完成回调
   * @param files 
   * @param type  1:图片信息 2:视频文件 3:视频封面
   */
  handleFileInput(files: any, type: any) {

    let fileArr = files.target.files;
    if (type == 1 && this.fileList.length == 10) {
      return this.createMessage("warning", "最多上传10张图片");
    }
    for (let index = 0; index < fileArr.length; index++) {
      const element = fileArr[index];
      this.postFile(element, (res: any) => {
        if (res.code != 0) {
          return;
        }
        // 上传类型
        if (type == 1) {
          this.fileList.push({
            // 图片地址
            url: res.data,
            // 是否是主图  0否 1 是
            isMain: 0
          });
        } else if (type == 2) {
          this.json.videoUrl = res.data;
        } else if (type == 3) {
          this.json.videoImg = res.data;
          this.json.videoImgType = "1";
        }
        this.inputVal = null;
      });
    }
  }
  /**
   * 提交
   */
  submit() {
    if (this.messageId != null) {
      return;
    }
    // 图片列表 主图
    const listMainImg: any = this.fileList.filter((item: any) => { return item.isMain == 1 });

    if (listMainImg.length == 0 ) {
      return this.createMessage("warning", "请设置商品主图");
    }
    if(this.json.videoImg && !this.json.videoUrl){
      return this.createMessage("warning", "请上传视频文件");
    }
    if(!this.json.videoImg && this.json.videoUrl && this.json.videoImgType == "0"){
      return this.createMessage("warning", "请上传视频封面");
    }
    if(this.json.videoImgType == 1){
      this.json.videoImg  = "0";
    }
    this.json.imgs = JSON.stringify(this.fileList);
    
    this.createBasicMessage();
    this.GoodsImgService.update(this.json).subscribe((res: any) => {
      this.removeBasicMessage();
      if (res.code != 0) {
        this.createMessage("error", res.message);
        return;
      }
      this.GoodsTabsService.updateDetails();
      this.createMessage("success", "保存成功");
    }, err => {
      this.removeBasicMessage();
      this.createMessage("error", err.message);
    });
  }
  /**
   * 删除图片
   */
  deleteImg(index: any) {
    this.inputVal = null;
    this.fileList = this.fileList.filter((item: any, i: any) => {
      return i != index;
    });
  }
  /**
   * 删除视频
   */
  deleteVideo() {
    this.inputVal = null;
    this.json.videoUrl = "";
    this.json.videoImgType = "0";
  }
  /**
   * 删除视频封面
   */
  deleteVideoImg() {
    this.inputVal = null;
    this.json.videoImg = "";
  }
  /**
   * 设置商品主图
   */
  setMainImg(index: any) {
    const mainIndex = this.fileList.findIndex((item: any) => { return item.isMain == 1; });
    if (mainIndex >= 0) {
      this.fileList[mainIndex].isMain = 0;
    }
    this.fileList[index].isMain = 1;
    this.fileList.sort(function (a, b) { return b.isMain - a.isMain })
  }
  /**
   * 图片列表拖拽
   * @param event 
   */
  drop(event: CdkDragDrop<string[]>) {
    moveItemInArray(this.fileList, event.previousIndex, event.currentIndex);
  }
  /**
   * 上传文件
   * @param su 上传完成回调函数
   */
  postFile(file: any, su: any) {
    this.GoodsImgService.postFile(file).subscribe(data => {
      if (su) su(data);
    }, error => {

    });
  }
  /**
   * 开启loading
   */
  createBasicMessage(text: any = null): void {
    this.messageId = this.message.loading(text ? text : '正在提交...', { nzDuration: 0 }).messageId;
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
