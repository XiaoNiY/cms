import { Component, OnInit, Input } from '@angular/core';
import { FormBuilder, FormGroup } from '@angular/forms';
import { NzNotificationService } from 'ng-zorro-antd/notification';
import { forkJoin } from 'rxjs';
import { NzMessageService } from 'ng-zorro-antd/message';
import { GoodsPublicnoteService } from './goods-publicnote.service';

declare var UE: any;
@Component({
  selector: 'app-goods-publicnote',
  templateUrl: './goods-publicnote.component.html',
  styleUrls: ['./goods-publicnote.component.scss']
})
export class GoodsPublicnoteComponent implements OnInit {

  editor: any = null;

  isVisible = false;
  // 全选
  checked = false;
  // tab表格数据
  listOfData: any | null = null;
  // 查询字典参数
  query_params_Json = {
    // 多少页，默认1
    current: 1,
    // 每页多少条，默认10
    size: 10
  }

  /**
   * 参数
   */
  json: any = {
    id: null,
    noteName: "",
    // 商品详情（富文本）
    noteInfo: "",
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
    private fb: FormBuilder,
    private notification: NzNotificationService,
    private GoodsPublicnoteService: GoodsPublicnoteService,
    private message: NzMessageService
  ) { }

  ngOnInit(): void {

    // console.log(UE);
    // this.editor = UE.getEditor("editor");
    this.getList();
  }

  ngOnDestroy() {
    this.myeditor.destroy();
  }
  getList() {
    this.GoodsPublicnoteService.get(this.query_params_Json).subscribe((res: any) => {
      if (res.code != 0) {
        this.createMessage("error", res.message);
        return;
      }
      res.data.records.forEach((element: any) => {
        element['Checked'] = false;
      });
      this.listOfData = res.data;
    }, err => {
    });
  }

  /**
   * 打开模态框 初始化
   * @param id 
   */
  showModal(id: any = null): void {
    this.isVisible = true;


    setTimeout(() => {
      if (!this.myeditor) {
        this.myeditor = UE.getEditor('publicnote', {
          toolbars: [[]],
          elementPathEnabled: false,
          wordCount: false //是否开启字数统计
        });

      }
    }, 100);

    if (id != null) {
      this.GoodsPublicnoteService.getItem(id).subscribe((res: any) => {
        if (res.code != 0) {
          this.createMessage("error", res.message);
          return;
        }
        const tabData = res.data;
        this.myeditor.setContent(tabData.noteInfo);
        this.json.id = tabData.id;
        this.json.noteName = tabData.noteName;
        this.json.noteInfo = tabData.noteInfo;

      }, err => {
      });
    }
  }

  /**
   * 模态框关闭触发
   */
  handleCancel(): void {
    this.isVisible = false;
  }
  /**
   * 新增 or 编辑 模态框提交
   */
  submitForm(): void {
    if (this.messageId != null) {
      return;
    }
    if (!this.json.noteName) {
      return this.createMessage("warning", "简称不能为空");;
    }
    this.json.noteInfo = this.myeditor.getContent();
    this.createBasicMessage();
    if (this.json.id == null) {
      this.GoodsPublicnoteService.add(this.json).subscribe((res: any) => {
        this.removeBasicMessage();
        if (res.code != 0) {
          this.createMessage("error", res.message);
          return;
        }
        this.createMessage("success", "保存成功");
        this.handleCancel();
        this.getList();
      }, err => {
        this.removeBasicMessage();
        this.createMessage("error", err.message);
      });
    } else {
      this.GoodsPublicnoteService.update(this.json).subscribe((res: any) => {
        this.removeBasicMessage();
        if (res.code != 0) {
          this.createMessage("error", res.message);
          return;
        }
        this.createMessage("success", "保存成功");
        this.handleCancel();
        this.getList();
      }, err => {
        this.removeBasicMessage();
        this.createMessage("error", err.message);
      });
    }
  }

  confirm(id: any) {
    this.GoodsPublicnoteService.delete(id).subscribe((res: any) => {
      if (res.code != 0) {
        this.createMessage("error", res.message);
        return;
      }
      this.getList();
    }, err => {
    });
  }

  // 页码改变
  onPageIndexChange(index: number) {
    console.log(index);
    this.getList();
  }
  // 每页条数改变的回调
  onPageSizeChange(index: number) {
    console.log(index);
    this.getList();
  }


  // 全部删除
  onAllDel() {
    var outMealServicelist = this.listOfData.records.filter(function (item: { Checked: boolean; }) { return item.Checked == true; });

    for (let index = 0; index < outMealServicelist.length; index++) {
      const element = outMealServicelist[index];
      this.GoodsPublicnoteService.delete(element.id).subscribe((res: any) => {
        if (res.code != 0) {
          this.createMessage("error", res.message);
          return;
        }
        this.getList();
      }, err => {
      });
    }
  }
  // item单选
  onItemChecked(id: number, checked: boolean): void {
    console.log("id:" + id + ",checked:" + checked);
    const index = this.listOfData.records.findIndex((item: { id: number; }) => item.id === id);
    this.listOfData.records[index].Checked = checked;
    this.updataCheckAll();
  }
  // 全选
  onAllChecked(value: boolean): void {
    this.listOfData.records.forEach((item: { Checked: boolean; }) => item.Checked = value);
    console.log(value);
  }
  // 判断item是否全部选择
  updataCheckAll() {
    const index = this.listOfData.records.findIndex((item: { Checked: boolean; }) => item.Checked == false);
    console.log(index);

    if (index != -1) {
      this.checked = false;
    } else {
      this.checked = true;
    }
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
   * 上传文件
   * @param su 上传完成回调函数
   */
  postFile(file: any) {
    return this.GoodsPublicnoteService.postFile(file).pipe((data) => { return data; })
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
