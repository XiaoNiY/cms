import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { ActivatedRoute, } from '@angular/router';
import { ConfigDictListService } from './config-dict-list.service';
import { NzNotificationService } from 'ng-zorro-antd/notification';
@Component({
  selector: 'app-config-dict-list',
  templateUrl: './config-dict-list.component.html',
  styleUrls: ['./config-dict-list.component.scss']
})
export class ConfigDictListComponent implements OnInit {
  // 模态框显示 or 隐藏
  isVisible = false;
  // tab表格数据
  listOfData: any | null = null;
  // 模态框表单
  modalForm!: FormGroup;
  // 模态框新建 or 保存 加载中状态
  modalLoading = false;
  // 查询字典参数
  params_Json = {
    // 名称或者编码搜索
    parentKey: "",
    // 多少页，默认1
    pageNum: 1,
    // 每页多少条，默认10
    pageSize: 20
  }

  constructor(
    private route: ActivatedRoute,
    private ConfigDictListService: ConfigDictListService,
    private fb: FormBuilder,
    private notification: NzNotificationService,
  ) { }

  ngOnInit(): void {

    this.route.params.subscribe(params => {
      this.params_Json.parentKey = params.dictKey;
    });

    this.modalForm = this.fb.group({
      // id
      id: [null],
      // 上级
      parentKey: [this.params_Json.parentKey, [Validators.required]],
      // 名称
      name: [null, [Validators.required]],
      // 键
      dictKey: [null, [Validators.required]],
      // 值
      content: [null, [Validators.required]],
      // 国家
      field1: [null],
      // 操作系统
      field2: [null],
      // 假名
      field3: [null],
      // 颜色
      color: ['#895858'],
      // 状态
      status: ['1', [Validators.required]],
      // 备注
      remark: "",
    });
    this.getDictList();
  }
  /**
   * 打开模态框 初始化
   * @param id 
   */
  showModal(id: any = null): void {
    this.isVisible = true;
    if (!id) { return }
    this.ConfigDictListService.getDictItme(id).subscribe((res: any) => {
      if (res.code != 0) {
        this.createNotification(res.message);
        return;
      }
      const tabData = res.data;
      try {
        this.modalForm.get('id')!.setValue(tabData.id);
        this.modalForm.get('parentKey')!.setValue(tabData.parentKey);
        this.modalForm.get('name')!.setValue(tabData.name);
        this.modalForm.get('dictKey')!.setValue(tabData.dictKey);
        this.modalForm.get('content')!.setValue(tabData.content);
        this.modalForm.get('field1')!.setValue(tabData.field1);
        this.modalForm.get('field2')!.setValue(tabData.field2);
        this.modalForm.get('field3')!.setValue(tabData.field3);
        this.modalForm.get('color')!.setValue(tabData.color);
        this.modalForm.get('status')!.setValue(tabData.status + "" || '1');
        this.modalForm.get('remark')!.setValue(tabData.remark);
      } catch (error) {

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
    console.log(this.params_Json.parentKey);

    this.modalForm.get('status')!.setValue('1');
    this.modalForm.get('parentKey')!.setValue(this.params_Json.parentKey);
    this.modalForm.get('color')!.setValue('#895858');
  }
  /**
   * 删除
   * @param id 
   */
  confirm(id: any): void {
    this.ConfigDictListService.deleteDict(id).subscribe((res: any) => {
      this.getDictList();
    }, err => {
      this.modalLoading = false;
    });
  }
  /**
   * 新增 or 编辑 模态框提交
   */
  submitForm(): void {
    console.log(this.modalForm.value);
    for (const i in this.modalForm.controls) {
      this.modalForm.controls[i].markAsDirty();
      this.modalForm.controls[i].updateValueAndValidity();
    }
    if (
      this.modalForm.value.parentKey == null ||
      this.modalForm.value.name == null ||
      this.modalForm.value.dictKey == null ||
      this.modalForm.value.content == null) {
      return;
    }
    this.modalLoading = true;

    if (this.modalForm.value.id == null) {
      this.ConfigDictListService.addDict(this.modalForm.value).subscribe((res: any) => {
        this.modalLoading = false;
        if (res.code != 0) {
          this.createNotification(res.message);
          return;
        }
        this.handleCancel();
        this.getDictList();
      }, err => {
        this.modalLoading = false;
      });
    } else {
      this.ConfigDictListService.updateDict(this.modalForm.value.id, this.modalForm.value).subscribe((res: any) => {
        this.modalLoading = false;
        if (res.code != 0) {
          this.createNotification(res.message);
          return;
        }
        this.handleCancel();
        this.getDictList();
      }, err => {
        this.modalLoading = false;
      });
    }
  }
  /**
   * 获取子字典列表
   */
  getDictList() {
    this.ConfigDictListService.getDictList(this.params_Json).subscribe((res: any) => {
      this.listOfData = res.data;
    }, err => {
    });
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

  /**
   * 页码改变
   * @param index 页码数
   */
  onPageIndexChange(index: number) {
    this.params_Json.pageNum = index;
    this.getDictList();
  }
  /**
   * 每页条数改变的回调
   * @param index 页码数
   */
  onPageSizeChange(index: number) {
    this.params_Json.pageSize = index;
    this.getDictList();
  }

}
