import { Component, OnInit } from '@angular/core';
import { NzMessageService } from 'ng-zorro-antd/message';
import { RecycleOrderService } from './recycle-order.service';

@Component({
    selector: 'app-recycle-order',
    templateUrl: './recycle-order.component.html',
    styleUrls: ['./recycle-order.component.scss']
})
export class RecycleOrderComponent implements OnInit {

    i4UserVisible: any = false;
    /**
     * 用户详情
     */
    UserDetails: any = null;
    /**
     * 数据源
     */
    listOfData?: any;
    /**
     * 表格加载
     */
    tableLoading: boolean = false;
    /**
     * 当前是否在搜索
     */
    searchHint: boolean = false;
    /**
     * 当前搜索的name
     */
    searchName: string = "";
    queryForm: any = {
        //用户ID
        userId: '',
        // 订单编号
        okey: '',
        // 寄件人手机
        lnktel: '',
        // 评估机型
        umname: '',
        // 订单状态 11：待揽件邮寄 13：物流运输中 14：到货检测中 15：待确 认交易 16：待付款 18：付款失败 19：付款成功 91：取消交易
        ostat: '',
        // 下单方式：1、估价下单  2、批量下单
        orderWay: '',
        // 订单来源
        platform: '',
        // 用户身份：1 爱思用户 2 游客，
        orderUserType: '',
        // 检测结果类型
        restype: '',
        // 下单开始时间
        beginOtime11: '',
        // 下单结束时间
        endOtime11: '',
        OtimeForm: '',
        // 第几页
        pageNum: '1',
        // 每页多少条
        pageSize: '20',
    }
    /**
     * 全局 loading
     */
    messageId: any = null;
    /**
     * 路由缓存恢复时
     */
    static updateCache: any = null;
    constructor(
        private message: NzMessageService,
        public recycleOrderService: RecycleOrderService,
    ) { }

    ngOnInit() {
        RecycleOrderComponent.updateCache = () => {
            this.tableLoading = false;
            this.getOrderList();
        }
        this.getOrderList();
    }


    /**
     * 打开模态框 初始化
     * @param id 
     */
    showModal(item: any = null): void {
        if (item.userId < 0) {
            return
        }
        if (this.messageId != null) {
            return;
        }
        this.createBasicMessage();
        this.recycleOrderService.userDetails(item.userId).subscribe((res: any) => {
            this.i4UserVisible = true;
            this.removeBasicMessage();
            if (res.code != 0) {
                this.createMessage("error", res.message);
                return;
            }

            this.UserDetails = res.data;
        }, error => {
            this.createMessage("error", error.message);
            this.removeBasicMessage();
        })
    }
    /**
     * 模态框关闭触发
     */
    handleCancel(): void {
        this.i4UserVisible = false;
    }
    /**
     * 查询
     */
    query() {
        if (this.queryForm.okey != "" || this.queryForm.lnktel != "" || this.queryForm.umname != "" || this.queryForm.ostat != "" || this.queryForm.orderWay != "" || this.queryForm.platform != "" || this.queryForm.orderUserType != "" || this.queryForm.restype != "" || this.queryForm.OtimeForm != "") {
            this.searchHint = true;
        } else {
            this.searchHint = false;
        }

        this.getOrderList();
    }

    /**
     * 返回搜索列表
     */
    backList() {
        this.queryForm.okey = "";
        this.queryForm.lnktel = "";
        this.queryForm.umname = "";
        this.queryForm.ostat = "";
        this.queryForm.orderWay = "";
        this.queryForm.platform = "";
        this.queryForm.orderUserType = "";
        this.queryForm.restype = "";
        this.queryForm.OtimeForm = "";
        this.queryForm.beginOtime11 = "";
        this.queryForm.endOtime11 = "";
        this.queryForm.pageNum = 1;
        this.searchHint = false;
        this.getOrderList();
    }

    /**
     * 重置
     */
    reset() {
        this.queryForm.okey = "";
        this.queryForm.lnktel = "";
        this.queryForm.umname = "";
        this.queryForm.ostat = "";
        this.queryForm.orderWay = "";
        this.queryForm.platform = "";
        this.queryForm.orderUserType = "";
        this.queryForm.restype = "";
        this.queryForm.OtimeForm = "";
        this.queryForm.beginOtime11 = "";
        this.queryForm.endOtime11 = "";
        this.queryForm.pageNum = 1;
        this.searchHint = false;
        this.getOrderList();
    }

    getOrderList() {
        if (this.tableLoading) { return; }
        this.listOfData = [];
        this.tableLoading = true;

        this.recycleOrderService.getList(this.queryForm).subscribe((res: any) => {
            this.listOfData = res.data;


            let textArr = [];
            if (this.queryForm.okey) {
                textArr.push(this.queryForm.okey);
            }
            if (this.queryForm.lnktel) {
                textArr.push(this.queryForm.lnktel);
            }
            if (this.queryForm.ostat) {
                textArr.push(this.ostat_to_text(this.queryForm.ostat));
            }
            if (this.queryForm.orderWay) {
                textArr.push(this.queryForm.orderWay == 1 ? '估价回收' : '批量回收');
            }
            if (this.queryForm.platform) {
                textArr.push(this.platform_to_text(this.queryForm.platform));
            }
            if (this.queryForm.orderUserType) {
                textArr.push(this.queryForm.orderUserType == 1 ? "爱思用户" : "游客");
            }
            if (this.queryForm.restype) {
                textArr.push(this.restype_to_text(this.queryForm.restype));
            }
            if (this.queryForm.nzFormat) {
                textArr.push(this.queryForm.nzFormat);
            }
            if (this.queryForm.OtimeForm) {
                let strTime = this.recycleOrderService.shiftBeginDate(this.queryForm.OtimeForm[0]);
                let endTime = this.recycleOrderService.shiftEndDate(this.queryForm.OtimeForm[1]);
                let time = strTime + " - " + endTime;
                textArr.push(time);
            }
            this.searchName = textArr.join(' | ');


            this.tableLoading = false;
        }, error => {
            this.tableLoading = false;
            this.createMessage("error", error.message);
        })
    }

    /**
     * 订单来源
     */
    platform_to_text(platform: any) {
        let text = "";
        switch (parseInt(platform)) {
            case 1:
                text = "h5";
                break;
            case 2:
                text = "pc";
                break;
            case 3:
                text = "app(爱思移动端)";
                break;
            default:
                text = "-";
                break;
        }
        return text;
    }


    /**
     * 验机结果
     */
    restype_to_text(restype: any) {
        let text = "";
        switch (parseInt(restype)) {
            case 11:
                text = "验机结果一致";
                break;
            case 12:
                text = "验机机况存在差异";
                break;
            case 13:
                text = "验机机型不一致";
                break;
            case 14:
                text = "一单多机";
                break;
            default:
                text = "-";
                break;
        }
        return text;
    }

    /**
     * 订单状态
     */
    ostat_to_text(ostat: any) {
        let text = "";
        switch (parseInt(ostat)) {
            case 11:
                text = "待揽件邮寄";
                break;
            case 13:
                text = "物流运输中";
                break;
            case 14:
                text = "到货验机中";
                break;
            case 15:
                text = "待机主确认交易";
                break;
            case 16:
                text = "待打款";
                break;
            case 18:
                text = "打款失败";
                break;
            case 19:
                text = "订单已完成";
                break;
            case 91:
                text = "订单已取消";
                break;
            default:
                text = "-";
                break;
        }
        return text;
    }

    /**
     * 页数
     * @param index 
     */
    onPageIndexChange(index: number) {
        console.log(index);
        this.queryForm.pageNum = index;
        this.getOrderList();
    }

    /**
     * 页码数
     * @param index 
     */
    onPageSizeChange(index: number) {
        console.log(index);
        this.queryForm.pageSize = index;
        this.getOrderList();
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
