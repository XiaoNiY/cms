import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { NzMessageService } from 'ng-zorro-antd/message';

import { ConfigAddressService } from './config-address.service';
@Component({
  selector: 'app-config-address',
  templateUrl: './config-address.component.html',
  styleUrls: ['./config-address.component.scss']
})
export class ConfigAddressComponent implements OnInit {

  /**
   * 模态框表单
   */
  modalForm!: FormGroup;
  /**
   * 模态框显示 or 隐藏
   */
  isVisible = false;
  /**
   * tab表格数据
   */
  listOfData: any | null = null;
  /**
   * 查询字典参数
   */
  query_params_Json = {
    // 简称
    name: "",
    // 多少页，默认1
    page: 1,
    // 每页多少条，默认10
    pageSize: 10
  }
  /**
   * 当前是否在搜索
   */
  searchHint = false;
  /**
   * 当前搜索name
   */
  searcName = "";
  /**
   * 区域选择
   */
  nzOptions: any = [];
  /**
   * 全局 loading
   */
  messageId: any = null;
  /**
   * 表格是否加载中
   */
  tableLoading: any = false;
  /**
   * 地区区域数据
   */
  areaData: any = [];
  constructor(
    private fb: FormBuilder,
    private message: NzMessageService,
    private ConfigAddressService: ConfigAddressService
  ) { }

  ngOnInit(): void {
    this.modalForm = this.fb.group({
      id: [null],
      // 简称
      name: [null],
      // 联系人
      contacts: [null,],
      // 联系方式
      tel: [null],
      // 地区
      districtId: [null],
      // 详细地址
      address: [null],
      // 状态 0：有效，1：无效 
      status: '0',
    });
    this.getList();

    this.ConfigAddressService.area().subscribe((res: any) => {
      // 地区
      let area = res;
      this.areaData = area;
      this.nzOptions = [];
      // 省
      for (const key in area.province) {
        let province = area.province[key];
        let obj: any = {
          value: province.id,
          label: province.name,
          children: []
        };
        // 市
        for (const k in area.city[province.id]) {
          let city = area.city[province.id][k];
          let cityObj: any = {
            value: city.id,
            label: city.name,
            children: []
          }
          // 区
          for (const s in area.county[city.id]) {
            let county = area.county[city.id][s];
            cityObj.children.push({
              value: county.id,
              label: county.name,
              isLeaf: true,
            })
          }
          obj.children.push(cityObj);
        }
        this.nzOptions.push(obj);
      }
    }, err => {
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
    this.getList();
  }
  /**
   * 搜索返回原列表
   */
  backList() {
    this.query_params_Json.name = "";
    this.query_params_Json.page = 1;
    this.searchHint = false;
    this.getList();
  }
  /**
   * 页码改变
   * @param index 页码数
   */
  onPageIndexChange(index: number) {
    console.log(index);
    this.query_params_Json.page = index;
    this.getList();
  }
  /**
   * 每页条数改变的回调
   * @param index 页码数
   */
  onPageSizeChange(index: number) {
    console.log(index);
    this.query_params_Json.pageSize = index;
    this.getList();
  }

  /**
   * 打开模态框 初始化
   * @param id 
   */
  showModal(id: any = null): void {
    this.isVisible = true;
    if (id == null) { return }
    this.ConfigAddressService.details(id).subscribe((res: any) => {
      if (res.code != 0) {
        this.createMessage("error", res.message);
        return;
      }
      const tabData = res.data;
      try {
        this.modalForm.get('id')!.setValue(tabData.id);
        this.modalForm.get('name')!.setValue(tabData.name);
        this.modalForm.get('tel')!.setValue(tabData.tel);
        this.modalForm.get('address')!.setValue(tabData.address);
        this.modalForm.get('contacts')!.setValue(tabData.contacts);
        this.modalForm.get('status')!.setValue(tabData.status + "");

        let districtId = [];
        // 省
        for (const key in this.areaData.province) {
          let province = this.areaData.province[key];
          // 市
          for (const k in this.areaData.city[province.id]) {
            let city = this.areaData.city[province.id][k];
            // 区
            for (let index = 0; index < this.areaData.county[city.id].length; index++) {
              const county = this.areaData.county[city.id][index];
              if (county.id == tabData.districtId) {
                districtId.push(province.id);
                districtId.push(city.id);
                districtId.push(county.id);
                break;
              }
            }
          }
        }
        this.modalForm.get('districtId')!.setValue(districtId);
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
    this.modalForm.get('status')!.setValue("0");
  }
  /**
   * 新增 or 编辑 模态框提交
   */
  submitForm(): void {
    if (this.modalForm.value.id == null) {
      this.createBasicMessage();
      this.ConfigAddressService.save(this.modalForm.value).subscribe((res: any) => {
        this.removeBasicMessage();
        if (res.code != 0) {
          this.createMessage("error", res.message);
          return;
        }
        this.createMessage("success", res.message);
        this.handleCancel();
        this.getList();
      }, err => {
      });
    } else {
      this.edit(this.modalForm.value);
    }
  }
  /**
   * 删除
   * @param id 
   */
  confirm(id: any): void {
    this.edit({
      id: id,
      delete_state: 1
    });
  }

  /**
   * 刷新列表
   */
  refresh() {
    this.listOfData = [];
    this.getList();
  }
  /**
   * 查询地址
   */
  getList() {
    if (this.tableLoading) { return; }
    this.tableLoading = true;
    this.ConfigAddressService.get(this.query_params_Json).subscribe((res: any) => {
      this.searcName = this.query_params_Json.name;
      this.listOfData = res.data;
      this.tableLoading = false;
    }, err => {
      this.tableLoading = false;
    });
  }
  /**
   * 编辑 or 删除
   */
  edit(json: any) {
    this.createBasicMessage();
    this.ConfigAddressService.edit(json).subscribe((res: any) => {
      this.removeBasicMessage();
      if (res.code != 0) {
        this.createMessage("error", res.message);
        return;
      }
      this.createMessage("success", res.message);
      this.getList();
      this.handleCancel();
    }, err => {
      this.removeBasicMessage();
      this.createMessage("error", err.message);
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
