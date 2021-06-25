import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { NzNotificationService } from 'ng-zorro-antd/notification';
import { GoodsClassifyService } from './goods-classify.service';

import { NzUploadFile } from 'ng-zorro-antd/upload';

@Component({
  selector: 'app-goods-classify',
  templateUrl: './goods-classify.component.html',
  styleUrls: ['./goods-classify.component.scss']
})
export class GoodsClassifyComponent implements OnInit {

  fileList: NzUploadFile[] = [];

  // 模态框显示 or 隐藏
  isVisible = false;
  // 模态框新建 or 保存 加载中状态
  modalLoading = false;
  // 模态框表单
  modalForm!: FormGroup;
  // 上一级分类
  PidName: string = "";
  value?: any;

  /**
   * tab表格数据
   */
  listOfData?: any | null = null;

  SelectNodes?: any = [];

  constructor(
    private fb: FormBuilder,
    private notification: NzNotificationService,
    private GoodsClassifyService: GoodsClassifyService,
  ) {

  }

  ngOnInit(): void {
    this.getList();

    this.modalForm = this.fb.group({
      id: [null],
      // 当前分类
      name: [null],
      icon: [null],
      // 第三方链接
      url: [null],
      // 上一分类
      pid: ['0'],
      // 分类方式
      type: ['0'],
      // 排序
      sort: [null],
      // 状态
      status: ['1'],
    });

  }

  getList() {
    this.GoodsClassifyService.get().subscribe((res: any) => {
      this.listOfData = res.data;

      this.forChildren(this.listOfData);
      console.log(this.listOfData);
    }, err => {
    });
  }
  forChildren(children: any) {
    children.forEach((item: any) => {
      item['title'] = item.name;
      item['key'] = item.id;
      if (item.children && item.children.length > 0) {
        item['expanded'] = true;
        // console.log(item.children);
        this.forChildren(item.children);
      } else {
        item['isLeaf'] = true;
        
        item['children'] = [];
      }
    });
  }
  confirm(id: any) {
    this.GoodsClassifyService.delete(id).subscribe((res: any) => {
      this.getList();
    }, err => {
    });
  }

  forPid(children: any, pid: any) {
    for (let index = 0; index < children.length; index++) {
      let item = children[index];
      if (item.children && item.children.length > 0) {
        this.forPid(item.children, pid);
      }
      if (item.pid == pid) {
        children.splice(0, children.length);
      }
    }
  }
  /**
   * 打开模态框 初始化
   * @param id 
   */
  showModal(id: any = null): void {
    this.isVisible = true;
    this.SelectNodes = JSON.parse(JSON.stringify(this.listOfData));
    if (id != null) {

      this.GoodsClassifyService.getItem(id).subscribe((res: any) => {
        if (res.code != 0) {
          this.createNotification(res.message);
          return;
        }
        const tabData = res.data;

        try {
          this.modalForm.get('id')!.setValue(tabData.id);
          this.modalForm.get('name')!.setValue(tabData.name);
          this.modalForm.get('icon')!.setValue(tabData.icon);
          this.modalForm.get('url')!.setValue(tabData.url);
          this.modalForm.get('pid')!.setValue(tabData.pid);
          this.modalForm.get('type')!.setValue(tabData.type + "");
          this.modalForm.get('sort')!.setValue(tabData.sort);
          this.modalForm.get('status')!.setValue(tabData.status + "");

          if (tabData.icon) {
            this.fileList = [
              {
                uid: tabData.id,
                name: tabData.icon,
                status: 'done',
                response: 'Server Error 500', // custom error message to show
                url: tabData.icon
              }
            ];
          }
          this.value = tabData.pid;

          this.forPid(this.SelectNodes, tabData.pid);
          this.forChildren(this.SelectNodes);
          console.log(this.value);
        } catch (error) {
          console.log(error);
        }
      }, err => {
      });
    }
  }
  /**
   * 模态框关闭触发
   */
  handleCancel(): void {
    this.isVisible = false;
    this.modalForm.reset();
    this.fileList = [];
    this.modalForm.get('pid')!.setValue('0');
    this.modalForm.get('status')!.setValue('1');
    this.modalForm.get('type')!.setValue('0');
  }

  /**
   * 新增 or 编辑 模态框提交
   */
  submitForm(): void {
    this.modalLoading = true;
    this.modalForm.get('pid')!.setValue(this.value || 0);
    
    if (this.modalForm.value.id == null) {
      this.GoodsClassifyService.add(this.modalForm.value).subscribe((res: any) => {
        this.modalLoading = false;
        if (res.code != 0) {
          this.createNotification(res.message);
          return;
        }
        this.getList();
        this.handleCancel();
      }, err => {
        this.modalLoading = false;
      });
    } else {
      this.GoodsClassifyService.update(this.modalForm.value).subscribe((res: any) => {
        this.modalLoading = false;
        if (res.code != 0) {
          this.createNotification(res.message);
          return;
        }
        this.getList();
        this.handleCancel();
      }, err => {
        this.modalLoading = false;
      });
    }
  }

  /**
   * 全局通知
   * @param string 文字
   */
  createNotification(string: string): void {
    this.notification.create(
      'warning',
      '通知',
      string
    );
  }
  beforeUpload = (file: NzUploadFile): boolean => {
    this.fileList = this.fileList.concat(file);
    
    this.modalForm.get('icon')!.setValue(this.fileList[0].name);
    return false;
  };
  /**
   * 上传图片
   * @param e 
   */
  onUpload(e: MouseEvent): void {
    e.preventDefault();
  }
}
