import { Component, OnInit } from '@angular/core';
import { NzMessageService } from 'ng-zorro-antd/message';
import { CustomerMerchantService } from './customer-merchant.service';
@Component({
    selector: 'app-customer-merchant',
    templateUrl: './customer-merchant.component.html',
    styleUrls: ['./customer-merchant.component.scss']
})
export class CustomerMerchantComponent implements OnInit {

    isVisible = false;

    /**
     * 列表数据源
     */
    listOfData?: any;
    /**
     * 查询参数格式
     */
    queryForm: any = {
        //  用户
        user: '',
        // 账号状态
        status: '',
        //用户初始身份
        temUserType: '',
        //用户真实身份
        userType: '',
        // 开始时间
        beginTime: '',
        // 结束时间
        endTime: '',
        // 时间区间
        dateFormat: '',
        
        //0 表示userId查询 1表示id查询
        type: '0',
        page: '1',
        pageSize: '20',
    }
    /**
     * 全局 loading
     */
    messageId: any = null;
    /**
     * 表单load加载
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
    constructor(
        private message: NzMessageService,
        private CustomerMerchantService: CustomerMerchantService,
    ) { }

    ngOnInit() {
        this.getCustomerList();
    }


    showModal(): void {
        this.isVisible = true;
    }

    handleCancel() {
        this.isVisible = false;
    }
    query() {
        if (
            this.queryForm.user != "" ||
            this.queryForm.status != "" ||
            this.queryForm.temUserType != "" ||
            this.queryForm.userType != "" ||
            this.queryForm.dateFormat != ""
        ) {
            this.searchHint = true;
        } else {
            return;
        }
        this.getCustomerList();
    }

    /**
     * 刷新列表
     */
    refresh() {
        this.listOfData = [];
        this.getCustomerList();
    }
    /**
     * 页码改变
     * @param index 页码数
     */
    onPageIndexChange(index: Number) {
        this.queryForm.page = index;
        this.getCustomerList();
    }
    /**
     * 每页条数改变的回调
     * @param index 页码数
     */
    onPageSizeChange(index: Number) {
        this.queryForm.pageSize = index;
        this.getCustomerList();
    }
    /**
     * 搜索返回原列表
     */
    backList() {
        this.queryForm.user = "";
        this.queryForm.status = "";
        this.queryForm.temUserType = "";
        this.queryForm.userType = "";
        this.queryForm.dateFormat = "";

        this.queryForm.page = 1;
        this.searchHint = false;
        this.getCustomerList();
    }


    /**
     * 复制内容
     */
    copy(val: any) {
        let oInput = document.createElement('input');
        oInput.value = val;
        document.body.appendChild(oInput);
        oInput.select();
        document.execCommand('Copy');
        document.body.removeChild(oInput);
        this.createMessage('success', "复制成功");
    }


    /**
     * 客户管理列表
     */
    getCustomerList() {
        if (this.tableLoading) { return; }
        this.listOfData = [];
        this.tableLoading = true;
        this.CustomerMerchantService.getList(this.queryForm).subscribe((res: any) => {
            if (res.code != 0) {
                this.createMessage("error", res.message);
                return;
            }
            let textArr = [];
            if (this.queryForm.user) {
                textArr.push(this.queryForm.user);
            }
            if (this.queryForm.status) {
                textArr.push(this.state_To_text(this.queryForm.status));
            }
            if (this.queryForm.temUserType) {
                textArr.push(this.temUserType_To_text(this.queryForm.temUserType));
            }
            if (this.queryForm.userType) {
                textArr.push(this.userType_To_text(this.queryForm.userType));
            }
            if (this.queryForm.dateFormat) {
                let strTime = this.CustomerMerchantService.shiftDate(this.queryForm.dateFormat[0]);
                let endTime = this.CustomerMerchantService.shiftDate(this.queryForm.dateFormat[1]);
                let time = strTime + " - " + endTime;
                textArr.push(time);
            }
            this.searcName = textArr.join(' | ');

            this.listOfData = res.data;
            for (let index = 0; index < this.listOfData.list.length; index++) {
                const element = this.listOfData.list[index];
                element.statusText = this.state_To_text(element.status);
                element.temUserTypeText = this.temUserType_To_text(element.temUserType);
            }
            this.tableLoading = false;
        }, err => {
            this.tableLoading = false;
            this.createMessage("error", err.message);
        })
    }

    /**
     * 用户初始身份
     * @param state 
    */
    temUserType_To_text(state: any) {
        let text = "";
        switch (parseInt(state)) {
            case 0:
                text = "未选择";
                break;
            case 1:
                text = "个人";
                break;
            case 2:
                text = "门店商户";
                break;
            case 3:
                text = "个人商户";
                break;
            default:
                text = "-";
                break;
        }
        return text;
    }

    /**
     * 用户真实身份
     * @param state 
    */
    userType_To_text(state: any) {
        let text = "";
        switch (parseInt(state)) {
            case 0:
                text = "未选择";
                break;
            case 1:
                text = "个人";
                break;
            case 2:
                text = "门店商户";
                break;
            case 3:
                text = "个人商户";
                break;
            default:
                text = "-";
                break;
        }
        return text;
    }
    /**
     * 状态转换颜色
     */
    getStatusColor(s: any) {
        let colorText = "";
        switch (parseInt(s)) {
            // 橙色
            case 0:
                colorText = "font0"
                break;
            // 绿色
            case 1:
                colorText = "font1"
                break;

        }
        return colorText;
    }
    /**
     * 状态转文字
     * @param state 
    */
    state_To_text(state: any) {
        let text = "";
        switch (parseInt(state)) {
            case 0:
                text = "无效";
                break; 
            case 1:
                text = "有效";
                break;
            case 2:
                text = "禁用";
                break;
            default:
                text = "-";
                break;
        }
        return text;
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
