import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup } from '@angular/forms';
import { PurchasePlanDetailsService } from './purchase-plan-details.service';
import { ActivatedRoute, Router } from '@angular/router';
import { NzMessageService } from 'ng-zorro-antd/message';


@Component({
    selector: 'app-purchase-plan-details',
    templateUrl: './purchase-plan-details.component.html',
    styleUrls: ['./purchase-plan-details.component.scss']
})
export class PurchasePlanDetailsComponent implements OnInit {
    id: any;
    // 模态框表单
    type: any;
    // 模态框表单
    // modalForm!: FormGroup;
    /**
     * 模态框显示隐藏
     */
    isVisible: boolean = false;
    closeVisible: boolean = false;
    closeAllVisible: boolean = false;
    /**
    * 采购计划详情数据
    */
    detailsData: any = {
        billNo: ''
    };
    /**
     * 本地列表数据
     */
    tableData: any = [];
    /**
     * 查询load动画
     */
    isLoadingOne = false;
    /**
    * 表格是否加载中
    */
    tableLoading: any = false;
    /**
     * 附件
     */
    fileList: any[] = [];
    /**
     * 计划数量总和
     */
    planNumberSum: any = 0;
    /**
     * 计划数量总和
     */
    totalFrozenNumber: any = 0;

    /**
     * 已采购数量总和
     */
    purchasedNumberSum: any = 0;
    /**
    * 备注
    */
    remark: any;
    /**
    * 关闭备注
    */
    closeRemark: any;
    /**
     * 当前操作手动关闭的数据id
     */
    rowData: any;
    currentState: any = null;
    currentRemark: any = null;
    constructor(
        private purchasePlanDetailsService: PurchasePlanDetailsService,
        private activatedRoute: ActivatedRoute,
        private message: NzMessageService,
        private fb: FormBuilder,
        private router: Router,
    ) { }

    ngOnInit() {
        this.activatedRoute.params.subscribe((params) => {
            this.id = params.id;
            if (this.id != 0) {
                this.getList();
            }
        })
    }

    /**
     * 复制计划单号
     */
    copy() {
        let oInput = document.createElement('input');
        oInput.value = this.detailsData.billNo;
        document.body.appendChild(oInput);
        oInput.select();
        document.execCommand('Copy');
        document.body.removeChild(oInput);
        this.createMessage('success', "复制成功");
    }

    showModal() {
        this.isVisible = true;
    }


    handleCancel() {
        this.isVisible = false;
        this.closeVisible = false;
        this.closeAllVisible = false;
    }

    /**
     * 手动关闭 表格内的按钮
     */
    showCloseVisible(rowData: any) {
        this.closeVisible = true;
        this.rowData = rowData;
    }
    save() {
        this.closeVisible = false;
        this.rowData.closeRemark = this.remark;
        this.purchasePlanDetailsService.close({
            id: this.rowData.id,
            state: 1,
            closeRemark: this.remark,
        }).subscribe((res: any) => {
            if (res.code != "") {
                this.createMessage('error', res.message);
                return;
            }
            this.createMessage('success', "关闭成功");
            this.getList();
        }, err => {
            this.createMessage('error', "请求出错");
        })
    }

    /**
     * 手动关闭 按钮
     */
    close() {
        this.closeAllVisible = true;
    }

    saveAll() {
        if (!this.closeRemark) {
            this.message.warning('请填写备注')
            return
        }
        this.currentState = this.detailsData.state;
        this.currentRemark = this.detailsData.closeRemark;
        this.closeAllVisible = false;
        this.detailsData.state = 6;
        this.detailsData.closeRemark = this.closeRemark;
        this.getList()
        this.update();
    }

    submitForm(state: any) {
        if (state == 3 && !this.detailsData.auditDesc) {
            return this.createMessage('warning', '请输入审核意见')
        }
        this.detailsData.state = state;
        this.detailsData.auditDesc = this.detailsData.auditDesc;
        this.update();
    }

    getList() {
        this.planNumberSum = 0
        this.purchasedNumberSum = 0
        this.totalFrozenNumber = 0
        this.purchasePlanDetailsService.getList({ "id": this.id }).subscribe((res: any) => {
            this.detailsData = res.data.procurementPlan;
            this.tableData = res.data.list;

            var obj = this.detailsData.enclosure;
            if (obj) {
                this.fileList = obj.split(',').map((item: any) => {
                    return {
                        url: item,
                        name: (item.match(/[^\\/]+\.[^\\/]+$/) || []).pop(),
                        status: 'done',
                    }
                })
            }
            this.detailsData.stateText = this.state_To_text(this.detailsData.state);

            for (let index = 0; index < this.tableData.length; index++) {
                const element = this.tableData[index];
                element.stateText1 = this.state_To_text1(element.state);
                this.planNumberSum += element.planNumber;
                this.purchasedNumberSum += element.purchasedNumber;
                this.totalFrozenNumber += element.frozenNumber;
            }

            this.isLoadingOne = false;
        }, err => {
            this.isLoadingOne = false;
        })
    }

    /**
     * 修改
     */
    update() {
        let json = {
            procurementPlan: this.detailsData,
            list: this.tableData
        }
        this.purchasePlanDetailsService.update(json).subscribe((res: any) => {
            this.isLoadingOne = false;
            if (res.code != 0) {
                if (this.currentState != null && this.currentRemark != null) {
                    this.detailsData.state = this.currentState;
                    this.detailsData.closeRemark = this.currentRemark;
                    this.currentState = null;
                    this.currentRemark = null;
                }
                this.createMessage('error', res.message);
                return;
            }
            this.createMessage('success', "修改成功");
            this.router.navigate(['stock/purchasePlan']);
        }, err => {
            this.createMessage('error', "请求出错");
            this.isLoadingOne = false;
        })

        console.log(this.tableData);
    }

    fileDown(url: any) {
        window.location.href = url;
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
     * 表格状态转文字* 
     * @param state 
     */
    state_To_text1(state: any) {
        let text = "";
        switch (state) {
            case 0:
                text = "未关闭";
                break;
            case 1:
                text = "已关闭";
                break;
            case 2:
                text = "采购完成";
                break;
            case 3:
                text = "待采购";
                // text = "正常";
                break;
        }
        return text;
    }

    /**
    * 全局展示操作反馈信息
    * @param type 其他提示类型 success:成功 error:失败 warning:警告
    */
    createMessage(type: any, str: any): void {
        this.message.create(type, str);
    }
}

