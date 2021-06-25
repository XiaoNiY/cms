import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { NzMessageService } from 'ng-zorro-antd/message';

import { MenuService } from './menu.service';
@Component({
  selector: 'app-menu',
  templateUrl: './menu.component.html',
  styleUrls: ['./menu.component.scss']
})
export class MenuComponent implements OnInit {

  /**
   * 模态框表单
   */
  modalForm!: FormGroup;
  /**
   * tab表格数据
   */
  listOfData?: any | null = [
    // {
    //   id: '0',
    //   name: 'parent 0',
    //   icon: '100',
    //   menuLevel: 'NG ZORRO',
    //   path: true,
    //   type: true,
    //   isHide: true,
    //   remarks: true,
    //   children: [
    //     {
    //       id: '0',
    //       name: 'parent 0',
    //       icon: '100',
    //       menuLevel: 'NG ZORRO',
    //       path: true,
    //       type: true,
    //       isHide: true,
    //       remarks: true
    //     },
    //     {
    //       id: '0',
    //       name: 'parent 0',
    //       icon: '100',
    //       menuLevel: 'NG ZORRO',
    //       path: true,
    //       type: true,
    //       isHide: true,
    //       remarks: true
    //     },
    //     {
    //       id: '0',
    //       name: 'parent 0',
    //       icon: '100',
    //       menuLevel: 'NG ZORRO',
    //       path: true,
    //       type: true,
    //       isHide: true,
    //       remarks: true
    //     },

    //   ]
    // }
  ];
  /**
   * 模态框显示 or 隐藏
   */
  isVisible = false;
  /**
   * 上级菜单目录树
   */
  SelectNodes?: any = [];
  constructor(
    private message: NzMessageService,
    private fb: FormBuilder,
    private MenuService: MenuService
  ) { }

  ngOnInit(): void {
    this.modalForm = this.fb.group({
      id: [null],
      // 父Id
      cId: [null],
      // 菜单名称
      name: [null],
      // 图标
      icon: [null],
      // 请求地址
      path: [null],
      // 权限标识
      keyword: [null],
      // 显示排序
      sort: [null],
      // 状态
      isHide: ['1'],
      // 类型 1：目录 2:菜单 3:按钮
      type: ['1'],
      // 备注
      remarks: [null],
    });
    this.list();
  }

  /**
   * 打开模态框 初始化
   * @param id 
   */
  showModal(id: any = null): void {
    this.isVisible = true;
    let arr = [...this.listOfData];
    this.SelectNodes = [];
    this.SelectNodes.push({
      title: "系统管理",
      key: 0,
      isLeaf: false,
      children: [],
    });
    if (arr.length != 0) {
      for (let index = 0; index < arr.length; index++) {
        const element = arr[index];
        this.SelectNodes[0].children.push({
          title: element.name,
          key: element.id,
          isLeaf: true
        });
      }
    } else {
      this.SelectNodes[0].isLeaf = true;
    }
    if (id != null) {
      this.details(id);
    }
  }
  /**
   * 模态框关闭触发
   */
  handleCancel(): void {
    this.isVisible = false;
    this.modalForm.reset();
    this.modalForm.get('isHide')!.setValue("1");
  }
  /**
   * 新增 or 编辑 模态框提交
   */
  submitForm(): void {
    let obj = this.modalForm.value;
    if(obj.cId == 0){
      obj.type = "1";
    }else{
      obj.type = "2";
    }
    if (this.modalForm.value.id != null) {
      this.MenuService.update(this.modalForm.value).subscribe((res: any) => {
        if (res.code != 0) {
          this.createMessage("error", res.message);
          return;
        }
        this.createMessage("success", "菜单保存成功");
        this.handleCancel();
        this.list();
      }, err => {
      });
    } else {
      this.MenuService.addMenu(this.modalForm.value).subscribe((res: any) => {
        if (res.code != 0) {
          this.createMessage("error", res.message);
          return;
        }
        this.createMessage("success", "菜单添加成功");
        this.handleCancel();
        this.list();
      }, err => {
      });
    }
  }
  /**
   * 确认是否删除
   * @param obj 
   */
  confirm(obj: any) {
    this.MenuService.delete({ id: obj.id, oldName: obj.name }).subscribe((res: any) => {
      if (res.code != 0) {
        this.createMessage("error", res.message);
        return;
      }
      this.createMessage("success", "菜单删除成功");
      this.list();
    }, err => {
    });
  }
  /**
  * 查询菜单列表
  */
  list() {
    this.MenuService.list({ name: "" }).subscribe((res: any) => {
      this.listOfData = res.data;
      this.forChildren(this.listOfData);
    }, err => {
    });
  }
  forChildren(children: any) {
    children.forEach((item: any) => {
      if (item.children && item.children.length > 0) {
        item['expanded'] = true;
        this.forChildren(item.children);
      } else {
        item['isLeaf'] = true;
      }
    });
  }
  /**
  * 角色详情
  */
  details(id: any) {
    this.MenuService.details(id).subscribe((res: any) => {
      if (res.code != 0) {
        this.createMessage("error", res.message);
        return;
      }
      const tabData = res.data;

      this.modalForm.get('id')!.setValue(tabData.id);
      this.modalForm.get('cId')!.setValue(tabData.cid);
      this.modalForm.get('name')!.setValue(tabData.name);
      this.modalForm.get('icon')!.setValue(tabData.icon);
      this.modalForm.get('path')!.setValue(tabData.path);
      this.modalForm.get('keyword')!.setValue(tabData.keyword);
      this.modalForm.get('sort')!.setValue(tabData.sort);
      this.modalForm.get('isHide')!.setValue(tabData.isHide + "");
      this.modalForm.get('remarks')!.setValue(tabData.remarks);
    }, err => {
    });
  }
  /**
   * 全局展示操作反馈信息
   * @param type 其他提示类型 success:成功 error:失败 warning:警告
   */
  createMessage(type: any, str: any): void {
    this.message.create(type, str);
  }
}