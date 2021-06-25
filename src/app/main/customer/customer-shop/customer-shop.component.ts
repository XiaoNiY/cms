import { Component, OnInit } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { NzMessageService } from 'ng-zorro-antd/message';
import { CustomerShopService } from './customer-shop.service';

@Component({
    selector: 'app-customer-shop',
    templateUrl: './customer-shop.component.html',
    styleUrls: ['./customer-shop.component.scss']
})
export class CustomerShopComponent implements OnInit {
    id: any = null;
    /**
     * 全局 loading
     */
    messageId: any = null;
    /**
     * 详情数据
     */
    detailsData: any = null;
    auditVisible = false;
    /**
     * 审核
     */
    auditParams = {
        id: 0,
        // 0 无效( 已删除 ) 1待完善 2待审核 3审核通过 4 审核不通过  10 暂不认证
        status: "3",
        // 
        userId:"",
        // 备注
        auditReason: ""
    };
    /**
     * 加载失败显示图像占位符
     */
    fallback =
        'data:image/png;base64,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';
    constructor(
        private router: Router,
        private activatedRoute: ActivatedRoute,
        private message: NzMessageService,
        private CustomerShopService: CustomerShopService,
    ) { }

    ngOnInit() {
        this.activatedRoute.params.subscribe(params => {
            this.id = params.id;
        });
        this.details();
    }

    /**
     * 打开模态框
     */
    showAuditModal() {
        this.auditVisible = true;
    }
    /**
     * 关闭模态框
     */
    handleCancel() {
        this.auditVisible = false
    }
    /**
   * 审核确定按钮
   */
    closeFun() {
        if (this.messageId != null) {
            return;
        }
        this.auditParams.id = this.detailsData.id;
        this.auditParams.userId = this.detailsData.userId;
        this.createBasicMessage();
        this.CustomerShopService.audit(this.auditParams).subscribe((res: any) => {
            this.removeBasicMessage();
            if (res.code != 0) {
                this.createMessage("error", res.message);
                return;
            }
            this.createMessage("success", "门店信息审核成功");
            this.handleCancel();
            this.details();
        }, err => {
            this.removeBasicMessage();
            this.createMessage("error", err.message);
        })
    }
    /**
     * 获取详情
     */
    details() {
        this.CustomerShopService.details({ id: this.id, type: 1 }).subscribe((res: any) => {
            if (res.code != 0) {
                this.createMessage("error", res.message);
                return;
            }
            this.detailsData = res.data.list[0];
            this.detailsData.companyImgs = this.detailsData.companyImgs.split(',');
            let serArr = this.detailsData.serviceTypes.split(',');
            let strArr = [];
            for (let index = 0; index < serArr.length; index++) {
                const element = serArr[index];
                if(element == 1){
                    strArr.push("普通维修");
                }else if(element == 2){
                    strArr.push("高级维修");
                }else if(element == 3){
                    strArr.push("手机&配件买卖");
                }
            }
            this.detailsData.service = strArr;
        }, err => {
            this.createMessage("error", err.message);
        })
    }
    status_to_text(status: any) {
        let text = "";
        switch (status) {
            case 1:
                text = "待完善";
                break;
            case 2:
                text = "待审核";
                break;
            case 3:
                text = "审核通过";
                break;
            case 4:
                text = "审核不通过";
                break;
            case 10:
                text = "暂不认证";
                break;
            case 20:
                text = "审核通过(已读)";
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
