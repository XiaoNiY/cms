import { Component, OnInit } from '@angular/core';

import { NzMessageService } from 'ng-zorro-antd/message';

import { appManagementService } from './app-management.service';

@Component({
  selector: 'app-management',
  templateUrl: './app-management.component.html',
  styleUrls: ['./app-management.component.scss']
})
export class AppManagementComponent implements OnInit {
  queryForm: any = {
    // 当前页码
    pageNum: 1,
    // 分页大小
    pageSize: 20,
  }
  // 一 二 三 级 弹窗对象
  modalForm: any = {
    // 上级分类
    pid: ''
  }
  // 上传列表集合
  fileList: any = []
  /**
   * 表单load加载
   */
  tableLoading: any = false;
  // 列表数据
  tableData: any = {
    // 数据列表集合
    records: [],
    // 总条数
    total: 0
  }

  // 一级弹窗
  isOneModalShow: boolean = false
  // 二级弹窗
  isTwoModalShow: boolean = false
  // 三级弹窗
  isThreeModalShow: boolean = false

  // 上级分类
  categoryList: any = []

  /**
   * 全局 loading
   */
  messageId: any = null;

  // 防止重复上传
  forbidUpload: boolean = false

  // 定时器
  time: any = null

  // 缓存
  cacheData: any = {
    // 一、二、三级弹窗
    level: '',
  }

  constructor(
    private appManagementService: appManagementService,
    private message: NzMessageService,
  ) { }

  ngOnInit() {
    this.httpList()
  }

  // 查询列表
  onQuery() {
    this.httpList()
  }
  /**
     * 页码改变
     * @param index 页码数
     */
  onPageIndexChange(index: Number) {
    this.queryForm.current = index;
    this.httpList()
  }
  /**
   * 每页条数改变的回调
   * @param index 页码数
   */
  onPageSizeChange(index: Number) {
    this.queryForm.size = index;
    this.httpList()
  }
  // 一级新增
  onOpenOneModalAdd() {
    this.modalForm = {}
    this.isOneModalShow = true
  }
  // 二级新增
  onOpenTwoModalAdd() {
    this.modalForm = {}
    this.isTwoModalShow = true
    this.httpCategoryParent(2)
  }
  // 三级新增
  onOpenThreeModalAdd() {
    this.modalForm = { userType: 0 }
    this.isThreeModalShow = true
    this.httpCategoryParent(3)
  }
  // 关闭新增弹窗
  onModalClose() {
    this.isOneModalShow = false
    this.isTwoModalShow = false
    this.isThreeModalShow = false
  }
  // 上传图标和角标的按钮
  onModalPreview(ev: any) {
    const { originFileObj } = ev?.file
    this.httpUpload(originFileObj)
  }

  // 新增 确定提价数据
  async onConfirm(level: number) {
    if (level == 1 && this.checkOne()) {
      return
    }
    if (level == 2 && this.checkTwo()) {
      return
    }
    if (level == 3 && this.checkThree()) {
      return
    }
    const formData = new FormData()
    for (const iterator in this.modalForm) {
      formData.append(iterator, this.modalForm[iterator])
    }
    const isSuccess = await this.httpPostGoodsType(level, formData)
    if (isSuccess) {
      this.onModalClose() // 关闭弹窗
    }

  }

  // 分类一校验
  checkOne() {
    const { name, userType, status } = this.modalForm
    if (!name) {
      this.message.warning('请输入名称')
      return true
    }
    if (!userType) {
      this.message.warning('请选择适用用户')
      return true
    }
    if (![0, 1].includes(status)) {
      this.message.warning('请选择状态')
      return true
    }
    return false
  }

  // 分类二校验
  checkTwo() {
    const { pid, name, userType, status } = this.modalForm
    if (!pid) {
      this.message.warning('请选择上级分类')
      return true
    }
    if (!name) {
      this.message.warning('请输入名称')
      return true
    }
    if (!userType) {
      this.message.warning('请选择适用用户')
      return true
    }
    if (![0, 1].includes(status)) {
      this.message.warning('请选择状态')
      return true
    }
    return false
  }

  // 分类三校验
  checkThree() {
    const { pid, name, url, icon, type, status } = this.modalForm
    if (!pid) {
      this.message.warning('请选择上级分类')
      return true
    }
    if (!name) {
      this.message.warning('请输入名称')
      return true
    }
    if (!icon) {
      this.message.warning('请输入图标')
      return true
    }
    if (!type) {
      this.message.warning('请选择跳转方式')
      return true
    }
    if (!url) {
      this.message.warning('请输入链接/值')
      return true
    }
    if (![0, 1].includes(status)) {
      this.message.warning('请选择状态')
      return true
    }
    return false
  }
  /**
     * 查询列表
     * @returns 
     */
  async httpList() {
    this.createBasicMessage()
    try {
      const { data }: any = await this.appManagementService.httpGetGoodsType(this.queryForm)
      if (data) {
        this.tableData = data
      }
      this.removeBasicMessage()
    } catch (error) {
      this.removeBasicMessage()
    }
  }
  /**
   * 图片 上传
   * @returns 
  */
  async httpUpload(originFileObj: any) {
    if (!originFileObj || this.forbidUpload) { // 禁止 重复上传
      return
    }
    this.forbidUpload = true
    try {
      const { data }: any = await this.appManagementService.httpPostFile(originFileObj)
      this.modalForm.icon = data
      this.forbidUpload = false
      data && this.message.success('图片上传成功')
    } catch (error) {
      this.forbidUpload = false
      this.message.warning('图片上传失败，请重新选取上传')
    }
  }
  /**
   * 提交新增弹窗的数据
   * @returns 
  */
  async httpPostGoodsType(query: any, params: any) {
    if (!params) {
      return
    }
    try {
      const { message }: any = await this.appManagementService.httpPostGoodsType(query, params)
      message && this.message.success(message)
      if (message == 'success') {
        this.time = setTimeout(() => {
          this.httpList() // 成功刷新列表
          clearTimeout(this.time)
        }, 500);
      }
      return message == 'success'
    } catch (error) {
      console.log(error, 'error')
      return false;

    }
  }
  /**
  * 上级分类 下拉列表
  * @returns 
 */
  async httpCategoryParent(query: any) {
    if (!query) {
      return
    }
    try {
      const { data }: any = await this.appManagementService.httpCategoryParent(query)
      if (data) {
        this.categoryList = data
      }
    } catch (error) {
      console.log(error, 'error')

    }
  }

  // 状态 code转换中文
  status_to_text(val: number) {
    const text: any = { 0: '禁用', 1: '启用' }
    return text[val] || ''
  }

  // 适用用户 code转换中文
  userType_to_text(val: number) {
    const text: any = { 0: '通用', 1: 'c端用户', 2: 'b端商家' }
    return text[val] || ''
  }

  // 跳转方式 code转换中文
  type_to_text(val: number) {
    const text: any = { 1: '商品ID', 2: '链接', 3: '搜索', 4: '分类' }
    return text[val] || ''
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
  * @param type 其他提示类型 success:成功 error:失败 warning:警告
  */
  createMessage(type: any, str: any): void {
    this.message.create(type, str);
  }
}
