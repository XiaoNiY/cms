import { Component, OnInit } from '@angular/core';
import { FormBuilder } from '@angular/forms';
import { NzNotificationService } from 'ng-zorro-antd/notification';

import { GoodsAttrService } from './goods-attr.service';
@Component({
  selector: 'app-goods-attr',
  templateUrl: './goods-attr.component.html',
  styleUrls: ['./goods-attr.component.scss']
})
export class GoodsAttrComponent implements OnInit {

  isVisible = false;

  // 模态框新建 or 保存 加载中状态
  modalLoading = false;
  // 查询表格初始化
  queryForm: any = {
    name: '',
    current: '1',
    size: '20',
  };
  // tab表格初始化
  modalForm: any ;

  // 查询load动画
  isLoadingOne = false;
  // 全选
  checked = false;
  // tab表格数据
  listOfData: any;

  constructor(
    private fb: FormBuilder,
    private GoodsAttrService: GoodsAttrService,
    private notification: NzNotificationService,
  ) {
  }

  /**
   * 打开模态框 初始化
   * @param id 
   */
  showModal(id: any = null): void {
    this.isVisible = true;
    if (id != null) {

      this.GoodsAttrService.getItem(id).subscribe((res: any) => {
        if (res.code != 0) {
          this.createNotification(res.message);
          return;
        }
        const tabData = res.data;
        try {
          this.modalForm.get('id')!.setValue(tabData.id);
          this.modalForm.get('name')!.setValue(tabData.name);
        } catch (error) {
          console.log(error);
        }
      }, err => {
      });
    }
  }
 /**
 * 查询
 */
  query(): void {
    this.isLoadingOne = true;
    this.getList();
  }
  ngOnInit(): void {
    // this.queryForm = this.fb.group({
    //   name: '',
    //   current: '1',
    //   size: '20',
    // });
    this.modalForm = this.fb.group({
      id: null,
      name: '',
    });
    this.getList();
  }

  confirm(id: any) {
    this.GoodsAttrService.delete(id).subscribe((res: any) => {
      this.getList();
    }, err => {
    });
  }

  /**
   * 模态框关闭触发
   */
  handleCancel(): void {
    this.isVisible = false;
    this.modalForm.reset();
  }
  /**
   * 新增 or 编辑 模态框提交
   */
  submitForm(): void {
    this.modalLoading = true;
    if (this.modalForm.value.id == null) {
      this.GoodsAttrService.add(this.modalForm.value).subscribe((res: any) => {
        this.modalLoading = false;
        if (res.code != 0) {
          this.createNotification(res.message);
          return;
        }
        this.handleCancel();
        this.getList();
      }, err => {
        // 取消查询动画
        this.modalLoading = false;
      });
    } else {
      this.GoodsAttrService.update(this.modalForm.value).subscribe((res: any) => {
        this.modalLoading = false;
        if (res.code != 0) {
          this.createNotification(res.message);
          return;
        }
        this.handleCancel();
        this.getList();
      }, err => {
        // 取消查询动画
        this.modalLoading = false;
      });
    }
  }

  /**
   * 全部删除
   */
  onAllDel() {
    var outMealServicelist = this.listOfData.records.filter(function (item: { Checked: boolean; }) { return item.Checked == true; });

    for (let index = 0; index < outMealServicelist.length; index++) {
      const element = outMealServicelist[index];
      this.GoodsAttrService.delete(element.id).subscribe((res: any) => {
        if (res.code != 0) {
          this.createNotification(res.message);
          return;
        }
        this.getList();
      }, err => {
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
  // 页码改变
  onPageIndexChange(index: number) {
    console.log(index);
    this.queryForm.current = index;
    this.getList();
  }
  // 每页条数改变的回调
  onPageSizeChange(index: number) {
    console.log(index);
    this.queryForm.size = index;
    this.getList();
  }
  getList() {
    this.checked = false;
    this.GoodsAttrService.get(this.queryForm).subscribe((res: any) => {
      console.log(res);
      res.data.records.forEach((element: any) => {
        element['Checked'] = false;
      });
      this.listOfData = res.data;
      this.isLoadingOne = false;
    }, err => {
      this.isLoadingOne = false;
    });
  }
}
