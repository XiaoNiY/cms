import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { NzNotificationService } from 'ng-zorro-antd/notification';
import { ConfigBrandService } from './config-brand.service';

@Component({
  selector: 'app-config-brand',
  templateUrl: './config-brand.component.html',
  styleUrls: ['./config-brand.component.scss']
})
export class ConfigBrandComponent implements OnInit {
  // 模态框显示 or 隐藏
  isVisible = false;
  // 模态框新建 or 保存 加载中状态
  modalLoading = false;
  // 模态框表单
  modalForm!: FormGroup;
  // tab表格数据
  listOfData: any | null = null;

  // 查询字典参数
  query_params_Json = {
    // 名称或者编码搜索
    name: "",
    // 多少页，默认1
    current: 1,
    // 每页多少条，默认10
    size: 10
  }
  /**
   * 表格是否加载中
   */
  tableLoading: any = false;

  // 当前是否在搜索
  searchHint = false;
  // 当前搜索name
  searcName = "";
  constructor(
    private fb: FormBuilder,
    private notification: NzNotificationService,
    private ConfigBrandService: ConfigBrandService
  ) { }

  ngOnInit(): void {
    this.modalForm = this.fb.group({
      id: [null],
      // 名称
      name: [null],
      // 名称(EN)
      nameEn: [null,],
      // 编码
      code: [null],
      // 排序
      sort: [null],
    });
    this.getList();
  }
  /**
   * 查询
   */
  query(): void {
    if(this.query_params_Json.name != ""){
      this.searchHint = true;
    }else{
      this.searchHint = false;
    }
    this.getList();
  }
  /**
   * 刷新列表
   */
  refresh() {
    this.listOfData = [];
    this.getList();
  }
  /**
   * 搜索返回原列表
   */
  backList(){
    this.query_params_Json.name = "";
    this.query_params_Json.current = 1;
    this.searchHint = false;
    this.getList();
  }
  /**
   * 页码改变
   * @param index 页码数
   */
  onPageIndexChange(index: number) {
    console.log(index);

    this.query_params_Json.current = index;
    this.getList();
  }
  /**
   * 每页条数改变的回调
   * @param index 页码数
   */
  onPageSizeChange(index: number) {
    console.log(index);
    this.query_params_Json.size = index;
    this.getList();
  }

  /**
   * 打开模态框 初始化
   * @param id 
   */
  showModal(id: any = null): void {
    this.isVisible = true;
    if (id == null) { return }
    this.ConfigBrandService.getItem(id).subscribe((res: any) => {
      if (res.code != 0) {
        this.createNotification(res.message);
        return;
      }
      const tabData = res.data;
      try {
        this.modalForm.get('id')!.setValue(tabData.id);
        this.modalForm.get('name')!.setValue(tabData.name);
        this.modalForm.get('nameEn')!.setValue(tabData.nameEn);
        this.modalForm.get('code')!.setValue(tabData.code);
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
  }
  /**
   * 新增 or 编辑 模态框提交
   */
  submitForm(): void {
    this.modalLoading = true;
    if (this.modalForm.value.id == null) {
      this.ConfigBrandService.add(this.modalForm.value).subscribe((res: any) => {
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
      this.ConfigBrandService.update(this.modalForm.value).subscribe((res: any) => {
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
  /**
   * 删除
   * @param id 
   */
  confirm(id: any): void {
    this.ConfigBrandService.delete(id).subscribe((res: any) => {
      this.getList();
    }, err => {
      this.modalLoading = false;
    });
  }

  getList() {
    if (this.tableLoading) { return; }
    this.listOfData = [];
    this.tableLoading = true;

    this.ConfigBrandService.get(this.query_params_Json).subscribe((res: any) => {
      this.searcName =  this.query_params_Json.name ;
      this.listOfData = res.data;
      this.tableLoading = false;
    }, err => {
      this.tableLoading = false;
    });
  }

}
