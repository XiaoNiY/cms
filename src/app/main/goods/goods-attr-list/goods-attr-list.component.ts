import { Component, OnInit, HostListener } from '@angular/core';
import { ActivatedRoute, } from '@angular/router';
import { NzNotificationService } from 'ng-zorro-antd/notification';
import { FormBuilder } from '@angular/forms';

import { GoodsAttrListService } from './goods-attr-list.service';
@Component({
  selector: 'app-goods-attr-list',
  templateUrl: './goods-attr-list.component.html',
  styleUrls: ['./goods-attr-list.component.scss']
})
export class GoodsAttrListComponent implements OnInit {

  isVisible = false;
  // tab表格初始化
  modalForm!: any;
  // tab表格数据
  listOfData: any | null = null;
  // 属性值列表
  attrArr: any = [];
  // 模态框新建 or 保存 加载中状态
  modalLoading = false;
  // 查询字典参数
  query_params_Json = {
    attrTypeId: null,
    // 0 属性（SKU） 1 参数
    type: null,
    // 多少页，默认1
    current: 1,
    // 每页多少条，默认10
    size: 10
  }

  constructor(
    private fb: FormBuilder,
    private route: ActivatedRoute,
    private notification: NzNotificationService,
    private GoodsAttrListService: GoodsAttrListService,
  ) { }

  ngOnInit(): void {
    this.route.params.subscribe(params => {
      this.query_params_Json.attrTypeId = params.attrTypeId;
      this.query_params_Json.type = params.type;
    });
    this.modalForm = this.fb.group({
      id: null,
      attrTypeId: this.query_params_Json.attrTypeId,
      // 名称
      name: '',
      //  排序
      sort: '',
      // 类型
      type: this.query_params_Json.type,
      // 检索方式  默认:0
      searchType: '0',
      // 手动输入
      canWrite: '1',
      // 选择类型
      selectType: '1',
      // 属性值列表  , 分号分割
      content: ''
    });
    this.getList();
  }
  keyup(event: any) {
    if (event.key === 'keyup' || event.type === 'click') {
      if (!this.modalForm.get('content')?.value) return;
      this.attrArr.push(this.modalForm.get('content')?.value);
    }
    event.preventDefault();
  }
  /**
   * 打开模态框 初始化
   * @param id 
   */
  showModal(id: any = null): void {
    this.isVisible = true;
    if (id == null) { return }
    this.GoodsAttrListService.getItem(id).subscribe((res: any) => {
      if (res.code != 0) {
        this.createNotification(res.message);
        return;
      }
      const tabData = res.data;
      try {
        this.modalForm.get('id')!.setValue(tabData.id);
        this.modalForm.get('attrTypeId')!.setValue(this.query_params_Json.attrTypeId);
        this.modalForm.get('name')!.setValue(tabData.name);
        this.modalForm.get('sort')!.setValue(tabData.sort);
        this.modalForm.get('type')!.setValue(tabData.type);
        this.modalForm.get('searchType')!.setValue(tabData.searchType + "");
        this.modalForm.get('canWrite')!.setValue(tabData.canWrite + "");
        this.modalForm.get('selectType')!.setValue(tabData.selectType + "");
        this.modalForm.get('content')!.setValue(tabData.content);
        this.attrArr = tabData.content.split(',');
      } catch (error) {
        console.log(error);
      }
    }, err => {
    });
  }
  /**
   * 模态框关闭触发
   */
  handleCancel(): void {
    this.isVisible = false;
    this.modalForm.reset();
    this.modalForm.get('selectType')!.setValue("0");
    this.modalForm.get('searchType')!.setValue("0");
    this.modalForm.get('type')!.setValue(this.query_params_Json.type);
    this.modalForm.get('attrTypeId')!.setValue(this.query_params_Json.attrTypeId);
    this.modalForm.get('canWrite')!.setValue("1");
    this.attrArr = [];
  }
  /**
   * 新增 or 编辑 模态框提交
   */
  submitForm(): void {
    this.modalLoading = true;
    this.modalForm.get('content')!.setValue(this.attrArr.join(','));

    if (this.modalForm.value.id == null) {
      this.GoodsAttrListService.add(this.modalForm.value).subscribe((res: any) => {
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
      this.GoodsAttrListService.update(this.modalForm.value).subscribe((res: any) => {
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
  
  confirm(id: any) {
    this.GoodsAttrListService.delete(id).subscribe((res: any) => {
      this.getList();
    }, err => {
    });
  }


  onClose(index: any) {
    this.attrArr.splice(index, 1)
  }
  getList() {
    this.GoodsAttrListService.get(this.query_params_Json).subscribe((res: any) => {
      this.listOfData = res.data;
    }, err => {
    });
  }
}
