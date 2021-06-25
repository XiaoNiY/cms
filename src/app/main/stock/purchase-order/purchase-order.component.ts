import { Component, OnInit } from '@angular/core';
import { NzMessageService } from 'ng-zorro-antd/message';
import { PurchaseOrderService } from './purchase-order.service';

@Component({
    selector: 'app-purchase-order',
    templateUrl: './purchase-order.component.html',
    styleUrls: ['./purchase-order.component.scss']
})
export class PurchaseOrderComponent implements OnInit {
    /**
     * 时间格式
     */
    dateFormat = 'yyyy-MM-dd';
    /**
     * 列表数据源
     */
    listOfData?: any;
    /**
     * 查询参数格式
     */
    queryForm: any = {
        // 采购单
        purchaseNumber: '',
        // 采购申请单
        applyNumber: '',
        //状态
        state: '',
        // 开始时间
        beginTime: '',
        // 结束时间
        endTime: '',
        // 时间区间
        dateFormat: '',
        // 包含商品
        whGood: '',
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
    /**
     * 路由缓存恢复时
     */
    static updateCache: any = null;

    constructor(
        private message: NzMessageService,
        private purchaseOrderService: PurchaseOrderService,
    ) { }

    ngOnInit() {
        PurchaseOrderComponent.updateCache = () => {
            this.tableLoading = false;
            this.getPurchaseOrderList();
        }
        this.getPurchaseOrderList();
    }

    /**
     * 刷新列表
     */
    refresh() {
        this.listOfData = [];
        this.getPurchaseOrderList();
    }
    query() {
        this.getPurchaseOrderList();
    }

    onPageIndexChange(index: number) {
        console.log(index);
        this.queryForm.page = index;
        this.getPurchaseOrderList();
    }

    onPageSizeChange(index: number) {
        console.log(index);
        this.queryForm.pageSize = index;
        this.getPurchaseOrderList();
    }
    /**
     * 搜索返回原列表
     */
    backList() {
        this.queryForm.purchaseNumber = "";
        this.queryForm.applyNumber = "";
        this.queryForm.state = "";
        this.queryForm.beginTime = "";
        this.queryForm.endTime = "";
        this.queryForm.dateFormat = "";
        this.queryForm.whGood = "";

        this.queryForm.page = 1;
        this.searchHint = false;
        this.getPurchaseOrderList();
    }
    /**
     * 采购单列表
     */
    getPurchaseOrderList() {
        if (this.tableLoading) { return; }
        this.listOfData = [];
        this.tableLoading = true;
        this.purchaseOrderService.getList(this.queryForm).subscribe((res: any) => {
            if (res.code != 0) {
                this.createMessage("error", res.message);
                return;
            }
            this.searcName = this.queryForm.purchaseNumber || this.queryForm.applyNumber;
            this.listOfData = res.data;
            for (let index = 0; index < this.listOfData.records.length; index++) {
                const element = this.listOfData.records[index];
                element.stateText = this.status_To_text(element.state);
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
        if (this.messageId != null) {
            return;
        }

        this.createBasicMessage();
        this.purchaseOrderService.delete(id).subscribe((res: any) => {
            this.removeBasicMessage();
            if (res.code != 0) {
                this.createMessage("error", res.message);
                return;
            }
            this.createMessage("success", "删除成功");
            this.getPurchaseOrderList();
        }, err => {
            this.removeBasicMessage();
            this.createMessage("error", err.message);
        });
    }
    /**
    * 状态转文字
    * @param status 
    */
    status_To_text(status: any) {
        let text = "";
        switch (status) {
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
                text = "入库中";
                break;
            case 5:
                text = "已完成";
                break;
            case 6:
                text = "已关闭";
                break;
            default:
                text = "---";
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
    // 采购单导出 下载
    onExportOrder() {
        this.download()
    }
    async download() {
        try {
            const { data }: any = await this.purchaseOrderService.httpExportOrder(this.queryForm)
            const { url, msg } = data
            url && window.open(url, '_self')
            msg && this.message.warning(msg);
        } catch (error) {

        }
    }

}
