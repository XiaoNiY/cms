import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup } from '@angular/forms';
import { NzMessageService } from 'ng-zorro-antd/message';
import { RecycleFeedbackService } from './recycle-feedback.service';

@Component({
    selector: 'app-recycle-feedback',
    templateUrl: './recycle-feedback.component.html',
    styleUrls: ['./recycle-feedback.component.scss']
})
export class RecycleFeedbackComponent implements OnInit {

    /**
     * 数据源
     */
    listOfData?: any;
    UserDetails?: any;
    /**
     * 获取爱思用户信息
     */
    userInfo?: any;
    /**
     * 处理备注信息
     */
    processInfo?: any;
    /**
     * 模态框表单
     */
    modalForm = {
        //  处理备注
        processContent: ""
    };
    /**
     * 模态框显示 or 隐藏
     */
    isVisible: boolean = false;
    /**
     * 用户身份的查看
     */
    i4UserVisible: boolean = false;
    /**
     * 当前是否在搜索
     */
    searchHint: boolean = false;
    /**
     * 当前搜索的name
     */
    searchName: string = "";
    /**
     * 确定按钮的加载
     */
    isLoading: boolean = false;
    /**
     * 表格按钮的加载
     */
    tableLoading: boolean = false;

    /**
     * 查询参数
     */
    queryForm: any = {
        // 用户类型 0游客 1用户
        userType: '',
        // 游客udid,爱思用户名,联系电话mobile
        keyword: '',
        // 0待处理 1已处理
        state: '',

        // 渠道
        platform: '',
        // 业务
        business: '',
        // 意见分类
        option: '',
        // 第几页
        pageNum: '1',
        // 每页多少条
        pageSize: '20',
        // 提交开始时间
        beginCreateTime: '',
        // 提交结束时间
        endCreateTime: '',
        // 处理开始时间
        beginProcessTime: '',
        // 处理结束时间
        endProcessTime: '',
        // 提交时间区间
        createFormat: '',
        // 处理时间区间
        processFormat: '',
    }
    originalPhotos: any[] = [];
    nowIndex: any;
    /**
     * 是否继续处理下一条
     */
    nextChecked: boolean = false;
    /**
     * 全局 loading
     */
    messageId: any = null;
    /**
     * 加载失败显示图像占位符
     */
    fallback =
        'data:image/png;base64,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';

    constructor(

        private recycleFeedBackService: RecycleFeedbackService,
        private message: NzMessageService,
        private fb: FormBuilder
    ) { }

    ngOnInit() {
        this.getFeedBackList();
    }

    i4show(data: any) {
        this.userInfo = data;

        if (data.userType == 0) {
            return
        }

        this.recycleFeedBackService.userDetails(data.userId).subscribe((res: any) => {
            this.i4UserVisible = true;
            if (res.code != 0) {
                this.createMessage("error", res.message);
                return;
            }

            this.UserDetails = res.data;
        }, error => {
            this.createMessage("error", error.message);
        })
    }

    showModal(data: any, index: any) {
        this.nowIndex = index;
        this.processInfo = data;
        this.modalForm.processContent = data.processContent;
        this.isVisible = true;
        if (this.processInfo.originalPhotos) {
            this.originalPhotos = this.processInfo.originalPhotos.split(',').map((item: any) => {
                return {
                    url: item,
                }
            })
        }
    }
    handleCancel() {
        this.isVisible = false;
        this.i4UserVisible = false;
        this.nextChecked = false;
        this.modalForm.processContent = "";
    }

    // 查询
    query() {
        if (this.queryForm.keyword != "" || this.queryForm.state != "" || this.queryForm.userType != "" || this.queryForm.createFormat != "" || this.queryForm.processFormat != "") {
            this.searchHint = true;
        } else {
            this.searchHint = false;
        }

        this.getFeedBackList();
    }

    // 返回原列表
    backList() {
        this.queryForm.keyword = "";
        this.queryForm.state = "";
        this.queryForm.userType = "";
        this.queryForm.createFormat = "";
        this.queryForm.beginCreateTime = "";
        this.queryForm.endCreateTime = "";
        this.queryForm.processFormat = "";
        this.queryForm.beginProcessTime = "";
        this.queryForm.endProcessTime = "";
        this.queryForm.pageNum = 1;
        this.searchHint = false;
        this.getFeedBackList();
    }

    /**
     * 重置
     */
    reset() {
        this.queryForm.keyword = "";
        this.queryForm.state = "";
        this.queryForm.userType = "";
        this.queryForm.createFormat = "";
        this.queryForm.beginCreateTime = "";
        this.queryForm.endCreateTime = "";
        this.queryForm.processFormat = "";
        this.queryForm.beginProcessTime = "";
        this.queryForm.endProcessTime = "";

        this.queryForm.platform = "";
        this.queryForm.business = "";
        this.queryForm.option = "";
        
        this.queryForm.pageNum = 1;
        this.searchHint = false;
        this.getFeedBackList();
    }

    getFeedBackList() {
        this.tableLoading = true;
        this.recycleFeedBackService.getList(this.queryForm).subscribe((res: any) => {
            this.listOfData = res.data;
            this.searchName = this.queryForm.keyword;
            this.tableLoading = false;
        }, err => {
            this.tableLoading = false;
        })
    }

    submitForm() {
        if (this.messageId != null) {
            return;
        }
        this.createBasicMessage();
        this.recycleFeedBackService.processList(this.processInfo.pkey, this.modalForm.processContent).subscribe((res: any) => {
            this.removeBasicMessage();
            if (res.code != 0) {
                this.createMessage('error', res.message);
                return;
            }
            this.createMessage('success', '处理成功');
            this.getFeedBackList();
            if (this.nextChecked) {
                this.findNextData();
            } else {
                this.handleCancel();
            }
        }, err => {
            this.removeBasicMessage();
            this.createMessage("error", err.message);
        })
    }

    /**
     * 切换到下一个
     * @returns 
     */
    findNextData() {
        // 如果处理的是最后一条，关闭窗口
        if ((this.nowIndex + 1) == this.listOfData.records.length) {
            this.createMessage("warning", "已到达当前页最后一条");
            return this.handleCancel();
        }
        this.processInfo = this.listOfData.records[++this.nowIndex];
        this.modalForm.processContent = this.processInfo.processContent;
    }
    /**
     * 意见分类转文字
     */
    option_to_Text(s: any) {
        let text = [];
        let arr = s ? s.split(',') : [];
        for (let index = 0; index < arr.length; index++) {
            const element = arr[index];
            switch (parseInt(element)) {
                case 200:
                    text.push("订单相关");
                    break;
                case 201:
                    text.push("物流相关");
                    break;
                case 202:
                    text.push("商品相关");
                    break;
                case 203:
                    text.push("活动优惠");
                    break;
                case 204:
                    text.push("售后相关");
                    break;
                case 100:
                    text.push("回收价格");
                    break;
                case 101:
                    text.push("回收打款");
                    break;
                case 102:
                    text.push("设备验机");
                    break;
                case 103:
                    text.push("活动加价");
                    break;
                case 104:
                    text.push("物流相关");
                    break;
                case 105:
                    text.push("使用建议");
                    break;
                case 106:
                    text.push("其他问题");
                    break;
                default:
                    text.push("-");
                    break;
            }
        }
        return text.length == 0 ? "-" : text.join(",");
    }
    /**
     * 订单来源
     */
    platform_to_text(platform: any) {
        let text = "";
        switch (platform) {
            case 1:
                text = "H5";
                break;
            case 2:
                text = "PC";
                break;
            case 3:
                text = "APP(爱思移动端)";
                break;
            default:
                text = "-";
                break;
        }
        return text;
    }

    userType_to_text(userType: any) {
        let text = "";
        switch (userType) {
            case 0:
                text = "游客";
                break;
            case 1:
                text = "爱思用户";
                break;
            default:
                text = "-";
                break;
        }
        return text;
    }

    /**
     * 页码改变
     * @param index 页码数
     */
    onPageIndexChange(index: Number) {
        console.log(index);
        this.queryForm.pageNum = index;
        this.getFeedBackList();
    }
    /**
     * 每页条数改变的回调
     * @param index 页码数
     */
    onPageSizeChange(index: Number) {
        console.log(index);
        this.queryForm.pageSize = index;
        this.getFeedBackList();
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
