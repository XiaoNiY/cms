import { Component, OnInit } from '@angular/core';

import { NzMessageService } from 'ng-zorro-antd/message';

import { appHardcoreAreaService } from './app-hardcore-area.service';

@Component({
  selector: 'app-hardcore-area',
  templateUrl: './app-hardcore-area.component.html',
  styleUrls: ['./app-hardcore-area.component.scss']
})
export class AppHardcoreAreaComponent implements OnInit {

  /**
   * 查询参数格式
   */
  queryForm: any = {
    // 状态：0 无效  1 启用
    status: '',
    // 当前页码
    pageNum: 1,
    // 分页大小
    pageSize: 20,
  }

  // 新增弹窗对象
  modalForm: any = {
    // 导航栏名称
    ntName: '',
    // 导航栏图片
    ntPicUrl: '',
    // 角标图片
    cornerMarker: '',
    // 跳转链接
    ntUrl: '',
    // 状态 0：无效，1：有效
    status: '',
    // 备注
    bak: '',
  }
  // 设置
  popoverForm: any = {
    // 0 隐藏  1显示
    kingKongSetting: 1
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
    total: 0,
    // 当前页面
    pages: 0,
    // 每页的条数
    size: 0,
  }
  isModalShow: boolean = false
  // 上传等待动画
  modalUploadLoading: boolean = false

  // 控制金刚区弹窗
  visible: boolean = false;
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
    // 列表id 编辑的时候要用到
    id: '',
    // 图标
    ntPicUrl: '',
    // 角标
    cornerMarker: '',
  }


  constructor(
    private appHardcoreAreaService: appHardcoreAreaService,
    private message: NzMessageService,
  ) { }

  ngOnInit(): void {
    this.httpList()
  }

  // 查询列表
  onQuery() {
    this.httpList()
  }


  // 列表删除 status 2
  onTableDelete(item: any) {
    const { id } = item
    this.httpPostNavigationBar(`${id}/2`, {})
  }
  // 列表禁用 status 0
  onTableDisable(item: any) {
    const { id } = item
    this.httpPostNavigationBar(`${id}/0`, {})
  }
  // 列表开启 status 1
  onTableEnable(item: any) {
    const { id } = item
    this.httpPostNavigationBar(`${id}/1`, {})
  }
  // 上移和下移
  onTableOperate(item: any, type: string) {
    const { id } = item
    this.httpPutNavigationBar(`${type}/${id}`, {})
  }
  // 编辑
  onTableEdit(item: any) {
    const { id, ntName, ntPicUrl, cornerMarker, ntUrl, status, bak } = item
    this.modalForm = { ntName, ntPicUrl, cornerMarker, ntUrl, status, bak }
    this.cacheData = { ntPicUrl, cornerMarker, id }
    this.isModalShow = true
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

  // 金刚区 新增
  onOpenModalAdd() {
    this.cacheData.id = '' // id 传空为新增
    this.modalForm = {}
    this.cacheData = {}
    this.isModalShow = true
  }
  // 金刚区 显示弹窗
  onHardcore() {
    this.visible = true
  }

  // 金刚区 确定
  async onSurePopover() {
    const { kingKongSetting } = this.popoverForm
    try {
      const { message }: any = await this.appHardcoreAreaService.httpSetting(kingKongSetting, {})
      this.visible = false
      message && this.message.success(message)
      this.httpList() // 刷新列表
    } catch (error) {
    }
  }
  // 金刚区 确定
  onClosePopover() {
    this.visible = false
  }
  // 关闭新增弹窗
  onModalClose() {
    this.isModalShow = false
  }
  // 上传图标和角标的按钮
  onModalPreview(ev: any, key: string) {
    const { thumbUrl, originFileObj } = ev?.file
    this.cacheData[key] = thumbUrl
    this.httpUpload(originFileObj, key)
  }

  // 金刚区 新增 确定提价数据
  async onConfirm() {
    const { ntName, ntPicUrl, cornerMarker, ntUrl, status } = this.modalForm
    const { id } = this.cacheData
    if (!ntName) {
      this.message.warning('请输入名称')
      return
    }
    if (!ntPicUrl) {
      this.message.warning('请选择图标')
      return
    }
    if (!cornerMarker) {
      this.message.warning('请选择角标')
      return
    }
    if (!ntUrl) {
      this.message.warning('请输入链接地址')
      return
    }
    if (![0, 1].includes(status)) {
      this.message.warning('请选择状态')
      return
    }
    const formData = new FormData()
    for (const iterator in this.modalForm) {
      formData.append(iterator, this.modalForm[iterator])
    }
    let isSuccess = null
    if (id) {
      // 编辑
      isSuccess = await this.httpPutNavigationBar(id, formData)
    } else {
      // 新增保存
      isSuccess = await this.httpPostNavigationBar('', formData)
    }
    if (isSuccess) {
      this.isModalShow = false // 关闭弹窗
    }

  }
  /**
     * 查询列表
     * @returns 
     */
  async httpList() {
    this.createBasicMessage()
    try {
      const { data }: any = await this.appHardcoreAreaService.httpGetNavigationBar(this.queryForm)
      const { iPage, kingKongSetting } = data || {}
      if (iPage) {
        this.tableData = iPage
        this.popoverForm.kingKongSetting = kingKongSetting
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
  async httpUpload(originFileObj: any, key: string) {
    if (!originFileObj || this.forbidUpload) { // 禁止 重复上传
      return
    }
    this.forbidUpload = true
    try {
      const { data }: any = await this.appHardcoreAreaService.httpPostFile(originFileObj)
      this.modalForm[key] = data
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
  async httpPostNavigationBar(query: any, params: any) {
    if (!params) {
      return
    }
    try {
      const { message }: any = await this.appHardcoreAreaService.httpPostNavigationBar(query, params)
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
  * 提交新增弹窗的数据
  * @returns 
 */
  async httpPutNavigationBar(query: any, params: any) {
    if (!params) {
      return
    }
    try {
      const { message }: any = await this.appHardcoreAreaService.httpPutNavigationBar(query, params)
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

  // table状态字段code转换成中文
  status_to_text(val: any) {
    const text: any = { 0: '禁用', 1: '启用' }
    return text[val] || '-'
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
