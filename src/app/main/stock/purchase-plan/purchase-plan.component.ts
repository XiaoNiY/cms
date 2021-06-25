import { Component, OnInit } from '@angular/core';
import { FormBuilder } from '@angular/forms';
import { NzMessageService } from 'ng-zorro-antd/message';
import { PurchasePlanService } from './purchase-plan.service';

@Component({
    selector: 'app-purchase-plan',
    templateUrl: './purchase-plan.component.html',
    styleUrls: ['./purchase-plan.component.scss']
})
export class PurchasePlanComponent implements OnInit {
    id: any;
    listOfData: any;
    // 查询load动画
    isLoadingOne = false;
    // 表格是否加载中
    tableLoading: any = false;
    /**
     * 当前搜索的name
     */
    searchName = "";
    /**
     * 当前是否在搜索
     */
    searchHint = false;
    /**
     * 全局 loading
     */
    messageId: any = null;
    queryForm: any = {
        // 计划单号
        billNo: '',
        // 包含商品
        whGood: '',
        // 状态(0 草稿 1待审核 2审核通过 3审核不通过 4采购中 5已完成 6已关闭)
        state: '',
        // 页数 1
        page: '1',
        // 页码 10
        pageSize: '20',
        // 开始时间
        beginTime: '',
        // 结束时间
        endTime: '',
        // 时间区间
        dateFormat: '',
    }
    /**
     * 路由缓存恢复时
     */
    static updateCache: any = null;
    constructor(
        private message: NzMessageService,
        private purchasePlanService: PurchasePlanService,
        private fb: FormBuilder,
    ) { }

    ngOnInit() {
        PurchasePlanComponent.updateCache = () => {
            this.tableLoading = false;
            this.getList();
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
    query() {
        this.getList();
    }

    /**
     * 搜索返回列表
     */
    backList() {
        this.queryForm.billNo = "";
        this.queryForm.dateFormat = "";
        this.queryForm.beginTime = "";
        this.queryForm.endTime = "";
        this.queryForm.whGood = "";
        this.queryForm.state = "";
        this.queryForm.page = 1;
        this.searchHint = false;
        this.getList();
    }

    getList() {

        if (this.tableLoading) { return; }
        this.listOfData = [];
        this.tableLoading = true;
        this.purchasePlanService.getPurchaseList(this.queryForm).subscribe((res: any) => {
            if (res.code != 0) {
                this.createMessage("error", res.message);
                return;
            }
            this.listOfData = res.data;
            this.isLoadingOne = false;
            this.searchName = this.queryForm.billNo;
            for (let index = 0; index < this.listOfData.records.length; index++) {
                const element = this.listOfData.records[index];
                element.stateText = this.state_To_text(element.state);
            }
            this.tableLoading = false;
        }, err => {
            this.tableLoading = false;
            this.createMessage("error", err.message);
        })
    }

    /**
     * 删除
     * @param id 
     */
    confirm(id: any) {
        this.purchasePlanService.del({ id: id }).subscribe((res: any) => {
            this.getList();
        }, err => {
            this.isLoadingOne = false;
        })

    }

    /**
     * 状态转文字
     * @param state 
    */
    state_To_text(state: any) {
        let text = "";
        switch (state) {
            case 0:
                text = "草稿";
                break;
            case 1:
                text = "待审核";
                break;
            case 2:
                text = "审核通过";
                break;
            case 3:
                text = "审核不通过";
                break;
            case 4:
                text = "采购中";
                break;
            case 5:
                text = "已完成";
                break;
            case 6:
                text = "已关闭";
                break;
        }
        return text;
    }

    /**
     * 页码改变
     * @param index 页码数
     */
    onPageIndexChange(index: number) {
        console.log(index);
        this.queryForm.page = index;
        this.getList();
    }
    /**
     * 每页条数改变的回调
     * @param index 页码数
     */
    onPageSizeChange(index: number) {
        console.log(index);
        this.queryForm.pageSize = index;
        this.getList();
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
