import { Component, OnInit, ViewChild } from '@angular/core';
import { FormBuilder, FormGroup } from '@angular/forms';
import { RoleService } from './role.service';
import { NzMessageService } from 'ng-zorro-antd/message';

import { NzTreeNodeOptions } from 'ng-zorro-antd/tree';


@Component({
  selector: 'app-role',
  templateUrl: './role.component.html',
  styleUrls: ['./role.component.scss']
})
export class RoleComponent implements OnInit {

  /**
   * 模态框表单
   */
  modalForm!: FormGroup;
  /**
   * 权限框表单
   */
  menuForm: any = {};
  /*
  * 模态框新建 or 保存 加载中状态
  */
  modalLoading = false;
  /**
   * 角色模态框显示 or 隐藏
   */
  roleModal = false;
  /**
   * 权限模态框显示 or 隐藏
   */
  menuModal = false;
  /**
   * 是否全选
   */
  checked = false;
  /**
   * 列表查询条件
   */
  queryForm: any = {
    // 角色名称
    name: '',
    // 每页数量
    pageSize: 20,
    // 当前页
    page: 1
  }
  /**
   * 表格是否加载中
   */
  tableLoading: any = false;
  /**
   * 列表数据源
   */
  listOfData?: any;
  /**
   * 当前是否在搜索   
   */
  searchHint = false;
  /**
   * 当前搜索name
   */
  searcName = "";


  nodes: any[] = [
    // {
    //   title: 'parent 1',
    //   key: '100',
    //   children: [
    //     {
    //       title: 'parent 1-0',
    //       key: '1001',
    //       children: [
    //         { title: 'leaf 1-0-0', key: '10010', disableCheckbox: true, isLeaf: true },
    //         { title: 'leaf 1-0-1', key: '10011', isLeaf: true }
    //       ]
    //     },
    //     {
    //       title: 'parent 1-1',
    //       key: '1002',
    //       children: [
    //         { title: 'leaf 1-1-0', key: '10020', isLeaf: true },
    //         { title: 'leaf 1-1-1', key: '10021', isLeaf: true }
    //       ]
    //     }
    //   ]
    // }
  ];

  constructor(
    private message: NzMessageService,
    private RoleService: RoleService,
    private fb: FormBuilder,
  ) {
  }

  ngOnInit(): void {
    this.modalForm = this.fb.group({
      id: [null],
      // 角色名称
      name: [null],
      // 权限字符
      keyword: [null],
      // 显示顺序
      sort: [null],
      // 状态
      rStats: ['0'],
      // 备注
      rRemarks: [null],
    });
    this.list();
    this.menuList();
  }
  /**
   * 刷新列表
   */
  refresh() {
    this.listOfData = [];
    this.list();
  }
  /**
   * 查询
   */
  query(): void {
    if (this.queryForm.name == "") {
      return;
    }
    this.searchHint = true;
    this.list();
  }
  /**
   * 搜索返回原列表
   */
  backList() {
    this.queryForm.name = "";
    this.queryForm.page = 1;
    this.searchHint = false;
    this.checked = false;
    this.list();
  }
  /**
   * item单选
   * @param id 
   * @param checked 
   */
  onItemChecked(id: number, checked: boolean): void {
    const index = this.listOfData.records.findIndex((item: { id: number; }) => item.id === id);
    this.listOfData.records[index].Checked = checked;
    this.updataCheckAll();
  }
  /**
   * 全选
   * @param value 
   */
  onAllChecked(value: boolean): void {
    this.listOfData.records.forEach((item: { Checked: boolean; }) => item.Checked = value);
  }
  /**
   * 判断item是否全部选择
   */
  updataCheckAll() {
    const index = this.listOfData.records.findIndex((item: { Checked: boolean; }) => item.Checked == false);

    if (index != -1) {
      this.checked = false;
    } else {
      this.checked = true;
    }
  }
  /**
   * 页码改变
   * @param index 
   */
  onPageIndexChange(index: number) {
    console.log(index);
    this.queryForm.page = index;
    this.checked = false;
    this.list();
  }
  /**
   * 每页条数改变的回调
   * @param index 
   */
  onPageSizeChange(index: number) {
    console.log(index);
    this.queryForm.pageSize = index;
    this.list();
  }
  /**
   * 删除角色
   * @param id 
   */
  confirm(id: any) {
  }
  /**
   * 打开角色权限 模态框初始化
   * @param id 
   */
  showMenuModal(id: any = null): void {
    this.menuModal = true;
    this.menuForm.id = id;
    // this.menuList();
    if (id != null) {
      this.Permission(id);
    }

  }
  /**
   * 打开角色信息模态框 初始化
   * @param id 
   */
  showRoleModal(id: any = null): void {
    this.roleModal = true;
    if (id != null) {
      this.details(id);
    }
  }
  /**
   * 模态框关闭触发
   */
  handleCancel(): void {
    this.roleModal = false;
    this.menuModal = false;
    this.modalForm.reset();
    this.modalForm.get('rStats')!.setValue("0");
  }
  /**
   * 新增 or 编辑 模态框提交
   */
  submitForm(): void {
    if (this.modalForm.value.id) {
      this.RoleService.update(this.modalForm.value).subscribe((res: any) => {
        if (res.code != 0) {
          this.createMessage("error", res.message);
          return;
        }
        this.createMessage("success", "角色修改成功");
        this.handleCancel();
        this.list();
      }, err => {
      });
    } else {
      this.RoleService.add(this.modalForm.value).subscribe((res: any) => {
        if (res.code != 0) {
          this.createMessage("error", res.message);
          return;
        }
        this.createMessage("success", "角色添加成功");
        this.handleCancel();
        this.list();
      }, err => {
      });
    }
  }
  toEdit(id: any = 0) {
  }
  /**
   * 查询角色列表
   */
  list() {
    if (this.tableLoading) { return; }
    this.tableLoading = true;
    this.RoleService.list(this.queryForm).subscribe((res: any) => {
      this.listOfData = res.data;
      for (let index = 0; index < this.listOfData.records.length; index++) {
        const element = this.listOfData.records[index];
        element.Checked = false;
      }
      this.searcName = this.queryForm.name;
      this.tableLoading = false;
    }, err => {
      this.tableLoading = false;
    });
  }
  /**
  * 权限列表
  */
  menuList() {
    this.RoleService.menuList({ name: "" }).subscribe((res: any) => {
      this.nodes = res.data;
      this.toChildren(this.nodes);
    }, err => {
    });
  }
  toChildren(children: any) {
    children.forEach((item: any) => {
      item['title'] = item.name;
      item['key'] = item.id + "";
      item['checked'] = false;

      if (item.children && item.children.length > 0) {
        item['isLeaf'] = false;
        this.toChildren(item.children);
      } else {
        item['isLeaf'] = true;
      }
    });
  }
  /**
   * 权限提交
   */
  submitPower() {
    let pidList = [];
    for (let index = 0; index < this.nodes.length; index++) {
      const element = this.nodes[index];
      if (element.checked) {
        pidList.push(element.id);
      }
      for (let k = 0; k < element.children.length; k++) {
        const c = element.children[k];
        if (c.checked) {
          pidList.push(c.id);
        }
      }
    }
    this.menuForm.pidList = pidList;
    this.setPermission();
  }
  /**
  * 角色详情
  */
  details(id: any) {
    this.RoleService.details(id).subscribe((res: any) => {
      if (res.code != 0) {
        this.createMessage("error", res.message);
        return;
      }
      const tabData = res.data;

      this.modalForm.get('id')!.setValue(tabData.id);
      this.modalForm.get('name')!.setValue(tabData.name);
      this.modalForm.get('keyword')!.setValue(tabData.keyword);
      this.modalForm.get('sort')!.setValue(tabData.sort);
      this.modalForm.get('rStats')!.setValue(tabData.rstats + "");
      this.modalForm.get('rRemarks')!.setValue(tabData.rremarks);
    }, err => {
    });
  }

  /**
  * 查询角色权限
  */
  Permission(id: any) {
    this.RoleService.Permission({ id: id }).subscribe((res: any) => {
      if (res.code != 0) {
        this.createMessage("error", res.message);
        return;
      }
      const tabData = res.data;
      let pidList = [];
      // 获取已绑定的权限id
      for (let index = 0; index < tabData.length; index++) {
        const element = tabData[index];
        pidList.push(element.id+"");
        for (let k = 0; k < element.children.length; k++) {
          const c = element.children[k];
          pidList.push(c.id+"");
        }
      }
      this.menuForm.showPid = pidList;
    }, err => {
    });
  }
  /**
  * 设置角色权限
  */
  setPermission() {
    this.RoleService.setPermission(this.menuForm).subscribe((res: any) => {
      if (res.code != 0) {
        this.createMessage("error", res.message);
        return;
      }
      this.createMessage("success", "设置成功");
      this.handleCancel();
      this.list();
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
