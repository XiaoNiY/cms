import { Component, OnInit } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { NzMessageService } from 'ng-zorro-antd/message';
import { element } from 'protractor';
import { OrderAccDetailsService } from './order-acc-details.service';
import { HomeComponent } from '../../home/home.component';
@Component({
    selector: 'app-order-acc-details',
    templateUrl: './order-acc-details.component.html',
    styleUrls: ['./order-acc-details.component.scss']
})
export class OrderAccDetailsComponent implements OnInit {
    id: any = null;
    deadline = Date.now() + 1000 * 60 * 60 * 24 * 2 + 1000 * 30;

    refundVisible: any = false;
    affirmVisible: any = false;
    extendTimeVisible: boolean = false;
    modifyPriceVisible: boolean = false;
    /**
     * 跟进模态框
     */
    followVisible: boolean = false;
    /**
     * 详情数据
     */
    detailsData: any = null;
    /**
     * 全局 loading
     */
    messageId: any = null;
    /**
     * 确认退款文字
     */
    affirmText: string = "";
    /**
     * 跟进内容
     */
    followList: any = [];
    /**
     * 参数
     */
    entityParam: any = {
        id: null,
        // 退款金额
        refundPrice: null,
        // 我方承担运费
        bearFreight: null,
        // 延长日期
        afterSaleCloseTime: null
    }
    /**
     * 改价
     */
    modifyPriceParam: any = {
        id: 0,
        // 优惠邮费
        favorablePostage: null,
        // 改价金额
        priceChange: null,
    }
    /**
     * 跟进参数
     */
    followParam: any = {
        // 关联信息(订单号 售后单号 客户id 出库单号)
        relationInformation: "",
        // 1、订单 2、售后 3、客户 4、出库
        type: 1,
        // 文件列表
        enclosure: [],
        // 备注
        content: "",
    }
    /**
     * 购买数量
     */
    numSum: number = 0;
    /**
     * 小计
     */
    subTotal: number = 0;
    /**
     * 优惠小计
     */
    favorablePriceSum: number = 0;
    /**
     * 上传val
     */
    inputVal: any = null;

    /**
     * 加载失败显示图像占位符
     */
    fallback =
        'data:image/png;base64,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';

    constructor(
        private HomeComponent: HomeComponent,
        private router: Router,
        private message: NzMessageService,
        private activatedRoute: ActivatedRoute,
        private OrderAccDetailsService: OrderAccDetailsService,
    ) { }

    ngOnInit(): void {
        
        this.HomeComponent.ScrollTop(0,200);

        this.activatedRoute.params.subscribe(params => {
            this.id = params.id;
            this.entityParam.id = params.id;
            this.modifyPriceParam.id = params.id;
        });
        this.getDetails();
    }
    /**
     * 跳转商品详情
     */
    toGoodsInfo(goodsId: any) {
        this.router.navigate(['goods/goodsTabs', goodsId]);
    }
    getDetails() {
        this.OrderAccDetailsService.getDetails(this.id).subscribe((res: any) => {
            if (res.code != 0) {
                this.createMessage("error", res.message);
                return;
            }
            this.detailsData = res.data;
            for (let index = 0; index < this.detailsData.orderExpress.length; index++) {
                const element = this.detailsData.orderExpress[index];
                element.expressTraces = JSON.parse(element.expressTraces);
            }
            this.detailsData.order.statusText = this.status_To_Text(this.detailsData.order.status);

            // 合计
            for (let index = 0; index < this.detailsData.order.list.length; index++) {
                const element = this.detailsData.order.list[index];
                for (let index = 0; index < element.list.length; index++) {
                    const element1 = element.list[index];
                    this.numSum += element1.num;
                    this.subTotal += (element1.num * element1.price);
                    this.favorablePriceSum += element1.favorablePrice;
                }
            }

        }, err => {
            this.createMessage("error", err.message);
        })
    }

    /**
     * 退款状态转文字
     */
    refundState_To_Text(s: any) {
        let test = "";
        switch (s) {
            case 0:
                test = "未付款";
                break;
            case 1:
                test = "已付款";
                break;
            case 2:
                test = "部分退款";
                break;
            case 3:
                test = "全部退款";
                break;
            default:
                test = "-";
                break;
        }
        return test;
    }
    /**
     * 支付状态转文字
     */
    payType_To_Text(s: any) {
        let test = "";
        switch (s) {
            case 1:
                test = "支付宝";
                break;
            case 2:
                test = "微信";
                break;
            case 3:
                test = "银联";
                break;
            default:
                test = "-";
                break;
        }
        return test;
    }
    /**
     * 状态转文字
     */
    status_To_Text(s: any) {
        let test = "";

        switch (s) {
            case 0:
                test = "有效";
                break;
            case 1:
                test = "无效";
                break;
            case 2:
                test = "待付款";
                break;
            case 3:
                test = "待审核";
                break;
            case 4:
                test = "审核不通过";
                break;
            case 5:
                test = "审核通过";
                break;
            case 6:
                test = "排队发货";
                break;
            case 7:
                test = "待发货";
                break;
            case 8:
                test = "待收货（已发货）";
                break;
            case 9:
                test = "交易完成";
                break;
            case 10:
                test = "支付超时";
                break;
            case 11:
                test = "客服取消";
                break;
            case 12:
                test = "客户取消";
                break;
            case 13:
                test = "售后中";
                break;
            case 14:
                test = "全部退货";
                break;
            default:
                test = "-";
                break;
        }
        return test;
    }
    /**
     * 物流编码转文字
     */
    expressCode_To_Text(s: any) {
        let test = "";
        switch (s) {
            case "SF":
                test = "顺丰";
                break;
            case "YTO":
                test = "圆通";
                break;
            case "ZTO":
                test = "中通";
                break;
            case "STO":
                test = "申通";
                break;
            case "YUNDA":
                test = "韵达";
                break;
            case "JD":
                test = "京东";
                break;
            default:
                test = "-";
                break;
        }
        return test;
    }
    /**
     * 文件上传完成回调
     * @param files 
     * @param type  1:图片信息 2:视频文件 3:视频封面
     */
    handleFileInput(files: any, type: any) {
        let fileArr = files.target.files;
        for (let index = 0; index < fileArr.length; index++) {
            const element = fileArr[index];
            this.postFile(element, (res: any) => {
                if (res.code != 0) {
                    return;
                }
                // 上传类型
                if (type == 2) {
                    this.followParam.enclosure.push({
                        // 显示地址
                        showUrl: element.name,
                        // 图片地址
                        url: res.data,
                    });
                }
                this.inputVal = null;
            });
        }
    }
    /**
     * 跟进查询
     */
    followerLst() {
        if (this.messageId != null) {
            return;
        }
        this.createBasicMessage();
        this.OrderAccDetailsService.followerLst(this.followParam).subscribe((res: any) => {
            this.removeBasicMessage();
            if (res.code != 0) {
                this.createMessage("error", res.message);
                return;
            }
            this.followVisible = true;
            this.followList = res.data;
            for (let index = 0; index < this.followList.length; index++) {
                let element = this.followList[index];
                element.enclosure = element.enclosure ? element.enclosure.split(',') : [];
            }
        }, err => {
            this.removeBasicMessage();
            this.createMessage("error", err.message);
        })
    }
    /**
     * 确认退款
     */
    confirmRefund() {
        if (this.messageId != null) {
            return;
        }

        if (!this.affirmText) {
            return this.createMessage("warning", "请输入“确认退款”文字");
        }
        if (this.affirmText != "确认退款") {
            return this.createMessage("warning", "请输入“确认退款”文字");
        } else {
            this.createBasicMessage();
            this.OrderAccDetailsService.update(this.entityParam).subscribe((res: any) => {
                this.removeBasicMessage();
                if (res.code != 0) {
                    this.createMessage("error", res.message);
                    return;
                }
                this.createMessage("success", "退款成功");
                this.handleCancel();
                this.affirmCancel();
                this.getDetails();
            }, err => {
                this.removeBasicMessage();
                this.createMessage("error", err.message);
            })
        }
    }
    /**
     * 售后延期确认
     * @returns 
     */
    extendTimeConfirm() {
        if (this.messageId != null) {
            return;
        }
        if (!this.entityParam.afterSaleCloseTime) {
            return this.createMessage("warning", "请选择延长售后日期");
        }
        this.createBasicMessage();
        this.OrderAccDetailsService.update(this.entityParam).subscribe((res: any) => {
            this.removeBasicMessage();
            if (res.code != 0) {
                this.createMessage("error", res.message);
                return;
            }
            this.createMessage("success", "售后延期成功");
            this.handleCancel();
            this.getDetails();
        }, err => {
            this.removeBasicMessage();
            this.createMessage("error", err.message);
        })
    }
    /**
     * 改价
     */
    modifyPriceConfirm() {
        if (this.messageId != null) {
            return;
        }
        // if (!this.modifyPriceParam.favorablePostage) {
        //     return this.createMessage("warning", "请输入邮费优惠额度");
        // }
        if (!this.modifyPriceParam.priceChange) {
            return this.createMessage("warning", "请输入订单优惠额度");
        }
        this.createBasicMessage();
        this.OrderAccDetailsService.modifyPrice(this.modifyPriceParam).subscribe((res: any) => {
            this.removeBasicMessage();
            if (res.code != 0) {
                this.createMessage("error", res.message);
                return;
            }
            this.createMessage("success", "改价成功");
            this.handleCancel();
            this.getDetails();
        }, err => {
            this.removeBasicMessage();
            this.createMessage("error", err.message);
        })
    }

    /**
     * 新增跟进
     */
    followerSave() {
        if (this.messageId != null) {
            return;
        }
        if (!this.followParam.content) {
            return this.createMessage("warning", "请输入备注");
        }
        this.createBasicMessage();
        this.OrderAccDetailsService.followerSave(this.followParam).subscribe((res: any) => {
            this.removeBasicMessage();
            if (res.code != 0) {
                this.createMessage("error", res.message);
                return;
            }
            this.handleCancel();
            this.createMessage("success", "跟进信息成功");
        }, err => {
            this.removeBasicMessage();
            this.createMessage("error", err.message);
        })
    }
    /**
     * 只保留文件名加后缀
     */
    formUrl(url: String) {
        return url.substr(url.lastIndexOf('/') + 1);
    }
    /**
     * 删除跟进图片
     */
    deleteFollowImg(index: any) {
        this.inputVal = null;
        this.followParam.enclosure = this.followParam.enclosure.filter((item: any, i: any) => {
            return i != index;
        });
    }
    /**
     * 打开模态框(跟进) 初始化
     * @param id 
     */
    followModal(relationInformation: any): void {
        this.followParam.relationInformation = relationInformation;
        this.followerLst();
    }

    /**
     * 打开模态框(订单改价) 初始化
     * @param id 
     */
    modifyPriceModal() {
        this.modifyPriceVisible = true;
    }
    /**
     * 打开模态框(售后延期) 初始化
     * @param id 
     */
    extendTimeModal() {
        this.extendTimeVisible = true;
    }
    /**
     * 打开模态框(售后退款) 初始化
     * @param id 
     */
    showModal(): void {
        this.refundVisible = true;
    }
    /**
     * 打开模态框(确认退款) 初始化
     * @param id 
     */
    affirmModal(): void {
        if (!this.entityParam.refundPrice) {
            return this.createMessage("warning", "退款金额不能为空");
        }
        if (this.entityParam.bearFreight === null || this.entityParam.bearFreight === "") {
            return this.createMessage("warning", "我方承担运费不能为空");
        }
        this.affirmVisible = true;
    }
    /**
     * 模态框关闭触发
     */
    handleCancel(): void {
        this.refundVisible = false;
        this.extendTimeVisible = false;
        this.modifyPriceVisible = false;
        this.followVisible = false;

        this.affirmText = ""

        this.entityParam.refundPrice = null;
        this.entityParam.bearFreight = null;
        this.entityParam.afterSaleCloseTime = null;

        this.modifyPriceParam.favorablePostage = null;
        this.modifyPriceParam.priceChange = null;

        this.followParam.content = "";
        this.followParam.enclosure = [];
    }
    /**
     * 上传文件
     * @param su 上传完成回调函数
     */
    postFile(file: any, su: any) {
        this.OrderAccDetailsService.postFile(file).subscribe(data => {
            if (su) su(data);
        }, error => {

        });
    }
    /**
     * 模态框关闭触发(确认退款)
     */
    affirmCancel() {
        this.affirmVisible = false;
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
