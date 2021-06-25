import { Component, OnInit } from '@angular/core';
import { NzMessageService } from 'ng-zorro-antd/message';
import { SellUserCouponService } from './sell-user-coupon.service';
@Component({
    selector: 'app-sell-user-coupon',
    templateUrl: './sell-user-coupon.component.html',
    styleUrls: ['./sell-user-coupon.component.scss']
})
export class SellUserCouponComponent implements OnInit {
    id: any = null;
    /**
     * 列表数据源
     */
    listOfData?: any;
    /**
     * 表格全选按钮
     */
    checked: boolean = false;
    /**
     * 批量停止用户用券
     */
    batch: boolean = false;
    /**
     * 停止用户用券
     */
    stopUserVouchers: boolean = false;
    /**
     * 表格按钮的加载
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
    /**
     * 过期时间
     */
    useEndTime: any = null;
    /**
     * 过期当前时间
     */
    currentTime: any = null;
    /**
     * 停止用券原因
     */
    stopContent: any = "";
    modalParam: any = {};
    queryForm: any = {
        // 名称、昵称、ID
        userInfo: '',
        // 状态：1、待使用 2、售后中 3、已过期 4、已使用 5强制停止
        status: '',
        // 优惠券类型：1、满减卷  2、折扣卷 3、随机卷
        type: '',
        // 优惠卷号
        couponNo: '',
        // 领取开始时间
        getBeginTime: '',
        // 领取结束时间
        getEndTime: '',
        // 多少页，默认1
        pageNum: '1',
        // 多少条，默认20
        pageSize: '20',
        getTimeForm: '',
    }
    constructor(
        private sellUserCouponService: SellUserCouponService,
        private message: NzMessageService,
    ) { }

    ngOnInit() {
        this.getUserList();
    }

    // 批量停止用户用券
    showModel() {
        // this.checked = false;
        let flag = true;
        for (let index = 0; index < this.listOfData.records.length; index++) {
            const element = this.listOfData.records[index];
            if (element.checked) {
                flag = false;
                this.batch = true;
            }
        }

        if (flag) {
            return this.createMessage('warning', '请至少选择一条数据');
        }
    }

    // 停止用户用券
    showVouchers(id: any = 0) {
        this.stopUserVouchers = true;
        this.modalParam.id = id;
    }

    handleCancel() {
        this.batch = false;
        this.stopUserVouchers = false;
        this.stopContent = "";
    }

    /**
     * 查询
     */
    query() {
        if (this.queryForm.userInfo != "" || this.queryForm.status != "" || this.queryForm.couponNo != "" || this.queryForm.getTimeForm != "") {
            this.searchHint = true;
        } else {
            this.searchHint = false;
        }

        this.getUserList();
    }

    /**
     * 返回搜索列表
     */
    backList() {
        this.queryForm.userInfo = "";
        this.queryForm.status = "";
        this.queryForm.couponNo = "";
        this.queryForm.getBeginTime = "";
        this.queryForm.getEndTime = "";
        this.queryForm.getTimeForm = "";
        this.queryForm.pageNum = 1;
        this.searchHint = false;
        this.getUserList();
    }

    getUserList() {
        this.sellUserCouponService.getList(this.queryForm).subscribe((res: any) => {
            res.data.records.forEach((element: any) => {
                element['checked'] = false;
            });
            this.listOfData = res.data;
            for (let index = 0; index < this.listOfData.records.length; index++) {
                let element = this.listOfData.records[index];
                element.statusTest = this.status_to_text(element.status);
            }
            this.searchName = this.queryForm.userInfo;
            this.tableLoading = false;
        }, error => {
            this.tableLoading = false;
        })
    }

    stop(stop: any) {
        this.checked = false;
        if (!this.stopContent) {
            return this.createMessage('warning', '请输入备注');
        }
        if (stop != 0) {
            this.sellUserCouponService.stopCoupon({ remark: this.stopContent, ids: [this.modalParam.id] }).subscribe((res: any) => {
                if (res.code != 0) {
                    this.createMessage('error', res.message);
                    return;
                }
                this.createMessage('success', '停止成功');
                
                this.handleCancel();
                this.getUserList();
            }, error => {
                this.createMessage('error', error.message);
            })
        } else {
            // let idArr = this.listOfData.records.map((ele: any) => {
            //     debugger
            //     return ele.id;
            // })
            let idArr: any = [];
            this.listOfData.records.forEach((item: any) => {
                if (item.checked) {
                    idArr.push(item.id);
                }
            });
            this.sellUserCouponService.stopCoupon({ remark: this.stopContent, ids: idArr }).subscribe((res: any) => {
                if (res.code != 0) {
                    this.createMessage('error', res.message);
                    return;
                }
                this.createMessage('success', '停止成功');
                this.handleCancel();
                this.getUserList();
            }, error => {
                this.createMessage('error', error.message);
            })
        }

    }
    // item单选
    onItemChecked(id: number, checked: boolean): void {
        console.log("id:" + id + ",checked:" + checked);
        const index = this.listOfData.records.findIndex((item: { id: number; }) => item.id === id);
        this.listOfData.records[index].checked = checked;
        this.updateCheckAll();
    }
    // 全选
    onAllChecked(value: boolean): void {
        // this.listOfData.records.forEach((item: { checked: boolean; }) => item.checked = value);
        this.listOfData.records.forEach((item: any) => {
            if (item.status == '1') {
                item.checked = value;
            }
        });
        console.log(value);
    }
    // 判断item是否全部选择
    updateCheckAll() {
        const index = this.listOfData.records.findIndex((item: { checked: boolean; }) => item.checked == false);
        console.log(index);

        if (index != -1) {
            this.checked = false;
        } else {
            this.checked = true;
        }
    }

    status_to_text(status: any) {
        let text = "";
        switch (status) {
            case 1:
                text = "待使用";
                break;
            case 2:
                text = "售后中";
                break;
            case 3:
                text = "已过期";
                break;
            case 4:
                text = "已使用";
                break;
            case 5:
                text = "强制停止";
                break;
            default:
                text = "-";
                break;
        }
        return text;
    }

    flagTime(time: string): string {
        let color = 'black';
        if (!time) {
            return color;
        }
        if (new Date(time).valueOf() > Date.now()) {
            color = 'black';
        } else if (new Date(time).valueOf() >= Date.now() - 3 * 24 * 60 * 60 * 1000) {
            color = 'orange';
        } else {
            color = 'gray';
        }

        return color;
    }

    /**
     * 页码改变
     * @param index 页码数
     */
    onPageIndexChange(index: Number) {
        this.checked = false;
        console.log(index);
        this.queryForm.pageNum = index;
        this.getUserList();
    }
    /**
     * 每页条数改变的回调
     * @param index 页码数
     */
    onPageSizeChange(index: Number) {
        console.log(index);
        this.queryForm.pageSize = index;
        this.getUserList();
    }

    /**
    * 全局展示操作反馈信息
    * @param type 其他提示类型 success:成功 error:失败 warning:警告
    */
    createMessage(type: any, str: any): void {
        this.message.create(type, str);
    }
}
