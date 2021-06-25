import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { NzMessageService } from 'ng-zorro-antd/message';
import { NzNotificationService } from 'ng-zorro-antd/notification';

import { ConfigDictService } from './config-dict.service';

@Component({
  selector: 'app-config-dict',
  templateUrl: './config-dict.component.html',
  styleUrls: ['./config-dict.component.scss']
})
export class ConfigDictComponent implements OnInit {
  // 模态框显示 or 隐藏
  isVisible = false;
  // 模态框表单
  modalForm!: FormGroup;
  // 查询表单
  validateForm: any = {
    dictName: '',
  };
  // tab表格数据
  listOfData: any | null = null;
  // 查询字典参数
  query_params_Json = {
    // 名称或者编码搜索
    name: "",
    // 多少页，默认1
    pageNum: 1,
    // 每页多少条，默认10
    pageSize: 20
  }
  // 当前是否在搜索
  searchHint = false;
  // 当前搜索name
  searcName = "";
  /**
   * 表格是否加载中
   */
  tableLoading: any = false;
  /**
   * 全局 loading
   */
  messageId: any = null;
  constructor(
    private fb: FormBuilder,
    private message: NzMessageService,
    private ConfigDictService: ConfigDictService,
    private notification: NzNotificationService
  ) { }

  ngOnInit(): void {
    this.getDictList();
    this.modalForm = this.fb.group({
      id: [null],
      name: [null, [Validators.required]],
      dictKey: [null, [Validators.required]],
      optionType: ['1', [Validators.required]],
      content: [null,],
      field1: [null],
      field2: [null],
      field3: [null],
      status: ['1', [Validators.required]],
      remark: "",
    });
  }
  /**
   * 查询
   */
  query(): void {
    if (this.query_params_Json.name != "") {
      this.searchHint = true;
    } else {
      this.searchHint = false;
    }
    this.getDictList();
  }
  /**
   * 搜索返回原列表
   */
  backList() {
    this.query_params_Json.name = "";
    this.query_params_Json.pageNum = 1;
    this.searchHint = false;
    this.getDictList();
  }
  /**
   * 页码改变
   * @param index 页码数
   */
  onPageIndexChange(index: number) {
    console.log(index);
    this.query_params_Json.pageNum = index;
    this.getDictList();
  }
  /**
   * 每页条数改变的回调
   * @param index 页码数
   */
  onPageSizeChange(index: number) {
    this.query_params_Json.pageSize = index;
    this.getDictList();
    console.log(index);
  }

  /**
   * 刷新列表
   */
  refresh() {
    this.listOfData = [];
    this.getDictList();
  }

  /**
   * 获取字典列表
   */
  getDictList() {

    if (this.tableLoading) { return; }
    this.listOfData = [];
    this.tableLoading = true;

    this.ConfigDictService.getDictList(this.query_params_Json).subscribe((res: any) => {
      if (res.code != 0) {
        this.createMessage("error", res.message);
        return;
      }
      this.listOfData = res.data;
      this.searcName = this.query_params_Json.name;
      this.tableLoading = false;
    }, err => {
      this.tableLoading = false;
      this.createMessage("error", err.message);
    });
  }
  /**
   * 打开模态框 初始化
   * @param id 
   */
  showModal(id: any = null): void {
    this.isVisible = true;
    const index = this.listOfData.records.findIndex((item: { id: null; }) => item.id === id);
    const tabData = this.listOfData.records[index];
    try {
      this.modalForm.get('id')!.setValue(tabData.id);
      this.modalForm.get('name')!.setValue(tabData.name);
      this.modalForm.get('dictKey')!.setValue(tabData.dictKey);
      this.modalForm.get('content')!.setValue(tabData.content);
      this.modalForm.get('field1')!.setValue(tabData.field1);
      this.modalForm.get('field2')!.setValue(tabData.field2);
      this.modalForm.get('field3')!.setValue(tabData.field3);
      this.modalForm.get('optionType')!.setValue(tabData.optionType + "" || '1');
      this.modalForm.get('status')!.setValue(tabData.status + "" || '1');
      this.modalForm.get('remark')!.setValue(tabData.remark);
    } catch (error) {

    }
  }
  /**
   * 模态框关闭触发
   */
  handleCancel(): void {
    this.isVisible = false;
    this.modalForm.reset();
    this.modalForm.get('optionType')!.setValue('1');
    this.modalForm.get('status')!.setValue('1');
  }
  /**
   * 新增 or 编辑 模态框提交
   */
  submitForm(): void {

    if (this.messageId != null) {
      return;
    }

    for (const i in this.modalForm.controls) {
      this.modalForm.controls[i].markAsDirty();
      this.modalForm.controls[i].updateValueAndValidity();
    }
    if (this.modalForm.value.name == null) {
      return this.createMessage("warning", "属性名不能为空");
    } else if (this.modalForm.value.dictKey == null) {
      return this.createMessage("warning", "编码不能为空");
    }
    this.createBasicMessage();
    if (this.modalForm.value.id == null) {
      this.ConfigDictService.addDict(this.modalForm.value).subscribe((res: any) => {
        this.removeBasicMessage();
        if (res.code != 0) {
          this.createNotification(res.message);
          return;
        }
        this.handleCancel();
        this.getDictList();
        this.createMessage("success", "保存成功");
      }, err => {
        this.removeBasicMessage();
        this.createMessage("error", err.message);
      });
    } else {
      this.ConfigDictService.updateDict(this.modalForm.value.id, this.modalForm.value).subscribe((res: any) => {
        this.removeBasicMessage();
        if (res.code != 0) {
          this.createNotification(res.message);
          return;
        }
        this.createMessage("success", "保存成功");
        this.handleCancel();
        this.getDictList();
      }, err => {
        this.removeBasicMessage();
        this.createMessage("error", err.message);
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
  /**
   * 删除
   * @param id 
   */
  confirm(id: any): void {
    if (this.messageId != null) {
      return;
    }
    this.createBasicMessage();
    this.ConfigDictService.deleteDict(id).subscribe((res: any) => {
      this.removeBasicMessage();
      if (res.code != 0) {
        this.createMessage("error", res.message);
        return;
      }
      this.createMessage("success", "删除成功");
      this.getDictList();
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
}
