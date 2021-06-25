import { Component, OnInit, ElementRef, ViewChild } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { NzMessageService } from 'ng-zorro-antd/message';
import { NzImageService } from 'ng-zorro-antd/image';
import { RecycleOrderDetailsService } from './recycle-order-details.service';


import { HomeComponent } from '../../home/home.component';
@Component({
    selector: 'app-recycle-order-details',
    templateUrl: './recycle-order-details.component.html',
    styleUrls: ['./recycle-order-details.component.scss']
})
export class RecycleOrderDetailsComponent implements OnInit {

    reportVisible: any = false;
    deviceVisible: any = false;
    logisticsVisible: any = false;

    /**
     * 主窗体
     */
    @ViewChild('deviceList')
    deviceListDom!: ElementRef;

    /**
     * 数据源
     */
    detailsData?: any;
    /**
     * 验机报告数据
     */
    reportData?: any;
    /**
     * 单个设备详情
     */
    deviceDetails: any = null;
    /**
     * 验机报告详情
     */
    reportDetails: any = null;
    /**
     * 物流数据
     */
    logisticDetails: any= [];
    /**
     * 订单号
     */
    okey: any;
    stepsLength: number = 0;

    /**
     * 加载失败显示图像占位符
     */
    fallback =
        'data:image/png;base64,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';
    /**
     * 全局 loading
     */
    messageId: any = null;
    constructor(
        private HomeComponent: HomeComponent,
        private message: NzMessageService,
        private nzImageService: NzImageService,
        private recycleOrderDetailsService: RecycleOrderDetailsService,
        private activatedRoute: ActivatedRoute,
    ) { }

    ngOnInit() {
        this.activatedRoute.params.subscribe(params => {
            this.okey = params.okey;
            if (this.okey != 0) {
                this.getOrderDetails();
            }
        })
    }
    /**
     * 定位置设备列表
     */
    toDeviceList() {
        // console.log(this.deviceListDom);
        this.HomeComponent.ScrollTop(this.deviceListDom.nativeElement.offsetTop,200);
    }
    getOrderDetails() {
        this.recycleOrderDetailsService.details(this.okey).subscribe((res: any) => {
            this.detailsData = res.data;
            /**
             * 流转步骤
             */
            this.detailsData.steps = JSON.parse(this.detailsData.steps);
            for (let index = 0; index < this.detailsData.steps.length; index++) {
                const element = this.detailsData.steps[index];
                if (element.state == 2) {
                    this.stepsLength = index;
                    break;
                }
            }
            /**
             * 订单跟踪
             */
            this.detailsData.dynamic = JSON.parse(this.detailsData.dynamic);
            /**
             * 评估
             */
            this.detailsData.evalDetails.ueval = JSON.parse(this.detailsData.checkDetails.ueval);
            /**
             * 验机
             */
            this.detailsData.checkDetails.ueval = JSON.parse(this.detailsData.checkDetails.ueval);

        })
    }
    /**
     * 查看图片
     * @param imgArr 
     */
    showImg(imgArr: any) {
        let images = [];
        for (let index = 0; index < imgArr.length; index++) {
            const element = imgArr[index];
            images.push({
                src: element
            });
        }
        this.nzImageService.preview(images, { nzZoom: 1.5, nzRotate: 0 });
    }
    /**
     * 订单状态
     * @param ostat 
     * @returns 
     */
    ostat_to_text(ostat: any) {
        let text = "";
        switch (ostat) {
            case 11:
                text = "待揽件邮寄";
                break;
            case 13:
                text = "物流运输中";
                break;
            case 14:
                text = "到货检测中";
                break;
            case 15:
                text = "待确认交易";
                break;
            case 16:
                text = "待付款";
                break;
            case 18:
                text = "付款失败";
                break;
            case 19:
                text = "付款成功";
                break;
            case 91:
                text = "取消交易";
                break;
            default:
                text = "-";
                break;
        }
        return text;
    }

    /**
     * 打开模态框(设备详情) 初始化
     * @param item 
     * @param code 1:评估 2:设备
     */
    showDeviceModal(id: any = null, code: any = null): void {
        if (this.messageId != null) {
            return;
        }
        if (code == 1 && this.detailsData.sosoInfo.length == 0) {
            return this.createMessage("warning", "暂无详情数据");
        } else {
            id = this.detailsData.sosoInfo[0].gid
        }
        this.createBasicMessage();
        this.recycleOrderDetailsService.deviceDetails(this.okey, id).subscribe((res: any) => {
            this.removeBasicMessage();
            if (res.code != 0) {
                this.createMessage("error", res.message);
                return;
            }
            if (res.data == null || res.data.length == 0) {
                return this.createMessage("warning", "暂无详情数据");
            }
            this.deviceVisible = true;
            this.deviceDetails = res;
            this.deviceDetails.code = code;
        }, error => {
            this.createMessage("error", error.message);
            this.removeBasicMessage();
        })
    }
    /**
     * 打开模态框(验机报告) 初始化
     * @param item 
     */
    showReportModal(id: any = null): void {
        if (this.messageId != null) {
            return;
        }
        this.createBasicMessage();
        this.recycleOrderDetailsService.report(this.okey, id).subscribe((res: any) => {

            this.removeBasicMessage();
            if (res.code != 0) {
                this.createMessage("error", res.message);
                return;
            }
            if (res.data == null || res.data.length == 0) {
                return this.createMessage("warning", "暂无详情数据");
            }
            this.reportVisible = true;
            this.reportDetails = res.data[0];
        }, error => {
            this.createMessage("error", error.message);
            this.removeBasicMessage();
        })
    }
    /**
     * 查看物流详情
     * @param expno 
     * @returns 
     */
    showLogisticsModal(expno: any) {
        if (this.messageId != null) {
            return;
        }
        this.createBasicMessage();
        this.recycleOrderDetailsService.logistic(this.okey, expno).subscribe((res: any) => {
            this.removeBasicMessage();
            if (res.code != 0) {
                this.createMessage("error", res.message);
                return;
            }
            if (res.data == null || res.data.length == 0) {
                return this.createMessage("warning", "暂无物流数据");
            }
            this.logisticDetails = res.data;
            this.logisticsVisible = true;
        }, error => {
            this.createMessage("error", error.message);
            this.removeBasicMessage();
        })
    }
    /**
     * 模态框关闭触发
     */
    handleCancel(): void {
        this.deviceVisible = false;
        this.reportVisible = false;
        this.logisticsVisible = false;
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
