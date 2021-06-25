import { Component, OnInit } from '@angular/core';

import { NzMessageService } from 'ng-zorro-antd/message';

import { appHomeActivtyService } from './app-home-activty.service';

@Component({
  selector: 'app-home-activty',
  templateUrl: './app-home-activty.component.html',
  styleUrls: ['./app-home-activty.component.scss']
})
export class AppHomeActivityComponent implements OnInit {

  /**
   * 查询参数格式
   */
  queryForm: any = {
    // 状态：0 未开始  1 进行中 2 已结束
    status: '',
    // 当前页码
    pageNum: 1,
    // 分页大小
    pageSize: 20,
  }

  // 新增弹窗对象
  modalForm: any = {
    // 名称
    activityName: '',
    // 格式
    layout: '1',
    // 开始时间
    beginTime: '',
    // 结束时间
    endTime: '',
    // 备注
    bak: '',
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
  isModalShow: boolean = false

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
  // 状态集合
  statusType: any = { 0: '未开始', 1: '进行中', 2: '已结束' }

  contentSet: any = {
    // 图片一
    pic: '',
    // 连接
    lurl: '',
    // 0 不需要登录  1 需要登录
    needLogin: ''
  }

  // 图片、链接、状态集合
  contentList: any = [
    {
      // 图片一
      pic: '',
      // 连接
      lurl: '',
      // 0 不需要登录  1 需要登录
      needLogin: ''
    }
  ]
  // 弹窗里面的状态
  modalStatusSet: any = { 1: '一', 2: '二', 3: '三', 4: '四', }


  constructor(
    private appHomeActivtyService: appHomeActivtyService,
    private message: NzMessageService,
  ) { }

  ngOnInit() {
    this.httpList()
  }

  // 查询列表
  onQuery() {
    this.httpList()
  }


  // 列表删除 status 2
  async onTableDelete(item: any) {
    const { id } = item
    this.httpPostActivity(`${id}/2`, {})
  }
  // 上移和下移
  onTableMove(item: any, type: string) {
    const { id } = item
    this.httpPutActivity(`${type}/${id}`, {})
  }
  // 编辑
  onTableEdit(item: any) {
    const { id, activityName, layout, beginTime, endTime, content, bak } = item
    this.contentList = JSON.parse(content) || []
    this.modalForm = { activityName, layout, beginTime, endTime, bak }
    this.cacheData = { id }
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

  // 活动 新增
  onOpenModalAdd() {
    this.cacheData.id = '' // id 传空为新增
    this.modalForm = {}
    this.cacheData = {}
    this.contentList = []
    this.isModalShow = true
  }
  // 关闭新增弹窗
  onModalClose() {
    this.isModalShow = false
  }
  // 上传图标和角标的按钮
  onModalPreview(ev: any, i: number) {
    const { originFileObj } = ev?.file
    this.httpUpload(originFileObj, i)
  }
  // 选择要上传几张图片
  onModalSelectStatus(val: number) {
    const size = this.contentList.length
    if (size === val) {
      return
    }
    if (size > val) {
      const index = size - val
      this.contentList.splice(val - 1, index)
      return
    }
    const index = val - size
    for (let i = 0; i < index; i++) {
      this.contentList.push({ ...this.contentSet })
    }
  }
  // 活动 新增 确定提价数据
  async onConfirm() {
    const { activityName, layout, beginTime, endTime } = this.modalForm
    const { id } = this.cacheData
    if (!activityName) {
      this.message.warning('请输入名称')
      return
    }
    if (!layout) {
      this.message.warning('请选择状态')
      return
    }
    for (let i = 0; i < this.contentList.length; i++) {
      const { lurl, needLogin, pic } = this.contentList[i];
      if (!pic) {
        this.message.warning(`请选择图片${this.number_to_text(i + 1)}`)
        return
      }
      if (!lurl) {
        this.message.warning(`请输入链接${this.number_to_text(i + 1)}`)
        return
      }
      if (![0, 1].includes(needLogin)) {
        this.message.warning(`请选择状态`)
        return
      }
    }
    if (!beginTime) {
      this.message.warning('请选择开始时间')
      return
    }
    if (!endTime) {
      this.message.warning('请选择结束时间')
      return
    }
    this.modalForm.beginTime = this.date(beginTime)
    this.modalForm.endTime = this.date(endTime)
    this.modalForm.content = this.contentList
    let isSuccess = null
    if (id) {
      // 编辑
      isSuccess = await this.httpPutActivity(id, this.modalForm)
    } else {
      // 新增保存
      isSuccess = await this.httpPostActivity('', this.modalForm)
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
      const { data }: any = await this.appHomeActivtyService.httpGetActivity(this.queryForm)
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
  async httpUpload(originFileObj: any, i: number) {
    if (!originFileObj || this.forbidUpload) { // 禁止 重复上传
      return
    }
    this.forbidUpload = true
    try {
      const { data }: any = await this.appHomeActivtyService.httpPostFile(originFileObj)
      this.contentList[i].pic = data
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
  async httpPostActivity(query: any, params: any) {
    if (!params) {
      return
    }
    try {
      const { message }: any = await this.appHomeActivtyService.httpPostActivity(query, params)
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
  async httpPutActivity(query: any, params: any) {
    if (!params) {
      return
    }
    try {
      const { message }: any = await this.appHomeActivtyService.httpPutActivity(query, params)
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
  status_to_text(val: number) {
    return this.statusType[val] || '-'
  }
  // table状态字段code转换成中文
  content_to_pic(item: any) {
    const { content: contentText } = item
    if (!contentText) {
      return ''
    }
    const content = JSON.parse(contentText)
    const { pic } = content && content[0]
    return pic || ''
  }
  // 阿拉伯数字转中文数字
  number_to_text(val: number) {
    return this.modalStatusSet[val]
  }
  /**
  * 时间格式转换 年月日
  * @param date 
  * @returns 
  */
  date(date: any) {
    const d = new Date(date)
    return `${d.getFullYear()}-${this.p((d.getMonth() + 1))}-${this.p(d.getDate())} ${this.p(d.getHours())}:${this.p(d.getMinutes())}:${this.p(d.getSeconds())}`;
  }
  /**
   * 补0
   * @param s 
   */
  p(s: any) {
    return s < 10 ? '0' + s : s
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
