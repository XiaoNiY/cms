import { Component, OnInit } from '@angular/core';
import { StaffService } from './staff.service';
import { NzMessageService } from 'ng-zorro-antd/message';

@Component({
  selector: 'app-staff',
  templateUrl: './staff.component.html',
  styleUrls: ['./staff.component.scss']
})
export class StaffComponent implements OnInit {

  /**
   * 模态框显示 or 隐藏
   */
  isVisible = false;
  /**
   * 是否全选
   */
  checked = false;
  /**
   * 角色列表(查询条件)
   */
  roleArr: any = [];
  /**
   * 添加员工
   */
  addForm: any = {
    id: null,
    // 真实姓名
    realName: null,
    // 电话号码
    phoneNumber: null,
    // 角色id
    roleId: null,
    // 角色列表(模态框)
    roleList: null,
    // 账号
    accountNumber: null,
    // 密码
    password: null,
    // 状态
    state: '0',
  }
  /**
   * 列表查询条件
   */
  queryForm: any = {
    // 角色id 可以为空
    roleId: '',
    // 用户名 可以为空
    realName: '',
    // 电话号码 可以为空
    phoneNumber: '',
    // 输入框值
    inputVal: '',
    // 选择姓名 还是 联系方式
    userNameSelect: '1',
    // 当前页
    page: 1,
    // 每页数量
    pageSize: 20,
  }
  /**
   * 列表数据源
   */
  listOfData?: any;
  /**
   * 表格是否加载中
   */
  tableLoading: any = false;
  /**
   * 当前是否在搜索
   */
  searchHint = false;
  /**
   * 当前搜索name
   */
  searcName = "";
  /**
   * 全局 loading
   */
  messageId: any = null;
  constructor(
    private message: NzMessageService,
    private StaffService: StaffService,
  ) { }

  ngOnInit(): void {
    // this.modalForm = this.fb.group({
    //   id: [null],
    //   // 真实姓名
    //   realName: [null],
    //   // 电话号码
    //   phoneNumber: [null],
    //   // 角色id
    //   roleId: [null],
    //   // 账号
    //   accountNumber: [null],
    //   // 密码
    //   password: [password],
    //   // 状态
    //   state: ['0'],
    // });
    this.list();
  }
  /**
   * 查询
   */
  query(): void {
    // 判断是否
    if (this.queryForm.inputVal != "") {
      this.searchHint = true;
    } else {
      this.searchHint = false;
    }
    // 转换对应的值
    if (this.queryForm.userNameSelect == "1") {
      this.queryForm.realName = this.queryForm.inputVal;
      this.queryForm.phoneNumber = "";
    } else {
      this.queryForm.phoneNumber = this.queryForm.inputVal;
      this.queryForm.realName = "";
    }
    this.queryForm.page = 1;
    this.list();
  }
  /**
   * 搜索返回原列表
   */
  backList() {
    this.queryForm.realName = "";
    this.queryForm.phoneNumber = "";
    this.queryForm.roleId = "";
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
   * 确认是否删除
   * @param id 
   */
  confirm(id: any) {
    this.StaffService.delete({ id: id }).subscribe((res: any) => {
      if (res.code != 0) {
        this.createMessage("error", res.message);
        return;
      }
      this.createMessage("success", "删除员工成功");
      this.list();
    }, err => {
    });

  }
  /**
   * 生成n位随机数
   * @param n 
   * @returns 
   */
  generateMixed(n: any) {
    var chars = ["0", "1", "2", "3", "4", "5", "6", "7", "8", "9", "A", "B", "C", "D", "E", "F", "G", "H", "I", "J", "K", "L", "M", "N", "O", "P", "Q", "R", "S", "T", "U", "V", "W", "X", "Y", "Z", "a", "b", "c", "d", "e", "f", "g", "h", "i", "j", "k", "l", "m", "n", "o", "p", "q", "r", "s", "t", "u", "v", "w", "x", "y", "z"];
    var res = "";
    for (var i = 0; i < n; i++) {
      var id = Math.ceil(Math.random() * chars.length -1);
      res += chars[id];
    }
    return res;
  }

  /**
   * 打开模态框 初始化
   * @param id 
   */
  showModal(id: any = null): void {
    this.isVisible = true;
    this.addForm.roleList = [...this.roleArr];

    if (id == null) {
      this.addForm.password = this.generateMixed(16);
      return;
    }
    this.StaffService.details(id).subscribe((res: any) => {
      if (res.code != 0) {
        this.createMessage("error", res.message);
        return;
      }
      const tabData = res.data;
      this.addForm.id = tabData.id;
      this.addForm.realName = tabData.realName;
      this.addForm.phoneNumber = tabData.phoneNumber;
      this.addForm.accountNumber = tabData.accountNumber;
      this.addForm.password = tabData.password;
      this.addForm.state = tabData.state + "";

      let roleIdArr = tabData.roleId.split(",");
      for (let index = 0; index < roleIdArr.length; index++) {
        let roleId = roleIdArr[index];
        let objIndex = this.addForm.roleList.findIndex((item: any) => item.value == roleId);
        this.addForm.roleList[objIndex].checked = true;
      }
    }, err => {

    });
  }
  /**
   * 模态框关闭触发
   */
  handleCancel(): void {
    this.isVisible = false;
    for (const key in this.addForm.roleList) {
      const element = this.addForm.roleList[key];
      element.checked = false;
    }
    Object.keys(this.addForm).forEach(key => { this.addForm[key] = '' })
    this.addForm.state = "0";
    // this.modalForm.reset();

  }
  /**
   * 新增 or 编辑 模态框提交
   */
  submitForm(): void {
    this.save();
  }
  /**
   * 跳转编辑
   * @param id 
   */
  toEdit(id: any = 0) {
  }
  /**
   * 刷新列表
   */
  refresh() {
    this.listOfData = [];
    this.list();
  }
  /**
   * 查询员工列表
   */
  list() {
    if (this.tableLoading) { return; }
    this.tableLoading = true;
    this.StaffService.list(this.queryForm).subscribe((res: any) => {
      this.listOfData = res.data;
      for (let index = 0; index < this.listOfData.records.length; index++) {
        const element = this.listOfData.records[index];
        element.Checked = false;
      }
      this.tableLoading = false;
      this.searcName = this.queryForm.inputVal;
      this.getRoleList();
    }, err => {
      this.tableLoading = false;
    });
  }
  /**
   * 查询角色列表
   */
  getRoleList() {
    this.StaffService.getRoleList({ page: 1, pageSize: 99 }).subscribe((res: any) => {
      this.roleArr = [];
      let list = res.data.records;
      for (let index = 0; index < list.length; index++) {
        const element = list[index];
        this.roleArr.push({ label: element.name, value: element.id, checked: false })
      }
      this.resetRole();
    }, err => {
      this.removeBasicMessage();
      this.createMessage("error", err.message);
    });
  }
  /**
   * 根据角色id转换角色文字
   */
  resetRole() {
    for (let index = 0; index < this.listOfData.records.length; index++) {
      const element = this.listOfData.records[index];
      let roleTxtArr = [];
      let roleIdArr = element.roleId.split(",");
      for (let index = 0; index < roleIdArr.length; index++) {
        const roleId = roleIdArr[index];
        for (let index = 0; index < this.roleArr.length; index++) {
          const roleObj = this.roleArr[index];
          if (roleObj.value == roleId) {
            roleTxtArr.push(roleObj.label);
          }
        }
      }
      element.roleTxt = roleTxtArr.toString();
    }
    console.log(this.listOfData);
  }
  /**
   * 重置密码
   */
  resetFun(item: any) {
    if (this.messageId != null) {
      return;
    }
    this.createBasicMessage();
    let passWord = this.generateMixed(16);
    this.StaffService.resetPwd({ id: item.id, passWord: passWord }).subscribe((res: any) => {
      this.removeBasicMessage();
      if (res.code != 0) {
        this.createMessage("error", res.message);
        return;
      }
      this.createMessage("success", "重置密码成功");
      item.generateMixed = passWord;
    }, err => {
      this.removeBasicMessage();
      this.createMessage("error", err.message);
    });
  }
  /**
   * 添加 or 保存员工
   */
  save() {
    if (this.messageId != null) {
      return;
    }
    let roleArr = this.addForm.roleList.filter(function (item: { checked: boolean; }) { return item.checked == true; });
    if (!this.addForm.realName) {
      return this.createMessage("warning", "请输入真实姓名");
    }

    if (!this.addForm.phoneNumber) {
      return this.createMessage("warning", "请输入电话号码");
    }
    if (roleArr.length == 0) {
      return this.createMessage("warning", "请选择角色");
    }
    this.createBasicMessage();
    if (this.addForm.id) {
      this.StaffService.update(this.addForm).subscribe((res: any) => {
        this.removeBasicMessage();
        if (res.code == 9) {
          this.createMessage("error", "登录账号已存在");
          return;
        }
        if (res.code != 0) {
          this.createMessage("error", res.message);
          return;
        }
        this.createMessage("success", "员工修改成功");
        this.handleCancel();
        this.list();
      }, err => {
        this.removeBasicMessage();
        this.createMessage("error", err.message);
      });
    } else {
      this.StaffService.save(this.addForm).subscribe((res: any) => {
        this.removeBasicMessage();
        if (res.code == 9) {
          this.createMessage("error", "登录账号已存在");
          return;
        }
        if (res.code != 0) {
          this.createMessage("error", res.message);
          return;
        }
        this.createMessage("success", "员工添加成功");
        this.handleCancel();
        this.list();
      }, err => {
        this.removeBasicMessage();
        this.createMessage("error", err.message);
      });
    }
  }
  /**
   * 全局展示操作反馈信息
   * @param type 其他提示类型 success:成功 error:失败 warning:警告
   */
  createMessage(type: any, str: any): void {
    this.message.create(type, str);
  }
  /**
   * 开启loading
   */
  createBasicMessage(): void {
    this.messageId = this.message.loading('正在提交...', { nzDuration: 0 }).messageId;
  }
  /**
   * 移除loading
   */
  removeBasicMessage() {
    this.message.remove(this.messageId);
    this.messageId = null;
  }
}
