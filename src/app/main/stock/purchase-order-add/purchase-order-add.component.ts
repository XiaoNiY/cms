import { Component, OnInit } from '@angular/core';
import { NzMessageService } from 'ng-zorro-antd/message';
import { ActivatedRoute, Router } from '@angular/router';
import { forkJoin } from 'rxjs';

import { PurchaseOrderAddService } from './purchase-order-add.service';
@Component({
    selector: 'app-purchase-order-add',
    templateUrl: './purchase-order-add.component.html',
    styleUrls: ['./purchase-order-add.component.scss']
})
export class PurchaseOrderAddComponent implements OnInit {
    /**
     * 是否显示骨架屏 分类管理
     */
    skeletonActive = true;
    /**
     * 采购申请单 选择数据
     */
    planSelectList: any = [];
    /**
     * 采购申请单 选择数据(获取id专用)
     */
    planSelectListFilter: any = [];
    /**
     * 采购申请单 列表数据
     */
    planTable: any = null;
    /**
     * 申请采购列表数据
     */
    addPlanTable: any = [];
    /**
     * 路由参数 copy:复制 create:生成订单 number:订单号
     */
    routeParams: any = null;
    /**
     * 供应商列表 数据
     */
    SupplierList: any = [];
    /**
     * 采购单参数
     */
    purchaseObj: any = {
        id: 0,
        // 采购单号
        purchaseNumber: "",
        // 采购申请单
        applyNumber: "",
        // 甲方
        firstParty: "",
        // 乙方
        partyB: "",
        // 备注
        remark: "",
        // 状态(0 草稿 1待审核 2审核通过 3审核不通过 4入库中 5已完成 6已关闭)
        state: 0,
    }
    /**
     * 全局 loading
     */
    messageId: any = null;
    // 时间定时器
    time: any = null

    constructor(
        private router: Router,
        private activatedRoute: ActivatedRoute,
        private PurchaseOrderAddService: PurchaseOrderAddService,
        private message: NzMessageService,
    ) { }

    ngOnInit() {

        this.activatedRoute.params.subscribe((params) => {
            console.log(params);
            this.routeParams = params;
            this.purchaseObj.id = params.id;
        })
        // 并联请求
        let postArr = [];
        postArr.push(this.PurchaseOrderAddService.getPlanList()
            .pipe((data) => {
                return data;
            }));
        postArr.push(this.PurchaseOrderAddService.getSupplierList()
            .pipe((data) => {
                return data;
            }));
        if (this.purchaseObj.id != 0) {
            postArr.push(this.PurchaseOrderAddService.details(this.purchaseObj.id)
                .pipe((data) => {
                    return data;
                }));
        }
        forkJoin(postArr)
            .subscribe((data: any) => {
                // 采购计划下拉列表
                let PlanList = data[0];
                // 供应商下拉列表
                let SupplierList = data[1];
                // 采购单详情
                let details = data[2];

                this.planSelectList = PlanList.data.records.filter(function (item: any) { return item.state == 2 || item.state == 4; });
                this.planSelectListFilter = PlanList.data.records;

                this.SupplierList = SupplierList.data.records.filter(function (item: any) { return item.state == 1; })

                if (details) {
                    this.setDetails(details);
                }
                if (this.routeParams.type == "create") {
                    this.purchaseObj.applyNumber = this.routeParams.number;
                    this.selectPlan(this.routeParams.number);
                }
                this.skeletonActive = false;
            }, err => {
            });
        // this.getPlanList();
        // this.getSupplierList();
    }
    /**
     * 全部入库
     */
    selectAll() {
        for (let index = 0; index < this.planTable.list.length; index++) {
            const element = this.planTable.list[index];
            if (element.isShow == 0 && element.maxPurchasedNumber > 0) {
                this.addBuyer(element);
            }

        }
    }
    /**
     * 清空已选
     */
    clearAll() {
        for (let index = 0; index < this.addPlanTable.length; index++) {
            const element = this.addPlanTable[index];
            this.delBuyer(element);
        }
    }
    /**
     * 添加采购
     * @param item 
     */
    addBuyer(item: any) {
        const index = this.addPlanTable.findIndex((obj: any) => obj.planId === item.id);
        if (item.isShow) {
            item.isShow = 0;

            if (index > -1 && !this.addPlanTable[index].id) {
                this.addPlanTable.splice(index, 1)
            } else {
                this.addPlanTable[index].isDelete = 1;
            }
        } else {
            item.isShow = 1;
            if (this.addPlanTable.length == 0 || index == -1) {
                let obj = { ...item };
                obj.planId = obj.id;
                obj.isDelete = 0;
                // 新建采购单 默认正常
                obj.state = 0;
                obj.purchaseNumber = obj.maxPurchasedNumber;
                delete obj.id;
                this.addPlanTable.push(obj);
            } else {
                this.addPlanTable[index].isDelete = 0;
            }
        }
    }
    /**
     * 取消采购
     * @param item 
     */
    delBuyer(item: any) {
        if (!item.id) {
            const index = this.addPlanTable.findIndex((obj: any) => obj.id === item.id);
            index > -1 && this.addPlanTable.splice(index, 1)
        } else {
            item.isDelete = 1;
        }
        console.log(item);
        console.log(this.planTable.list);
        let obj: any = this.planTable.list.filter(function (items: any) { return items.id === item.planId });
        if (obj.length >= 1) { obj[0].isShow = 0 }

    }
    /**
     * 采购单选择回调
     * @param id 
     */
    selectPlan(billNo: any) {
        try {
            let id = this.planSelectListFilter.filter(function (item: any) { return item.billNo == billNo })[0].id
            this.getPlanDetails(id);
        } catch (error) {

        }
    }
    /**
     * 详情
     */
    setDetails(res: any) {
        // this.PurchaseOrderAddService.details(this.id).subscribe((res: any) => {
        let list = res.data.list;
        let purchase = res.data.purchase;

        this.purchaseObj.id = purchase.id;
        this.purchaseObj.applyNumber = purchase.applyNumber;
        this.purchaseObj.firstParty = purchase.firstParty;
        this.purchaseObj.partyB = purchase.partyB;
        this.purchaseObj.remark = purchase.remark;
        this.purchaseObj.purchaseNumber = purchase.purchaseNumber;
        this.selectPlan(this.purchaseObj.applyNumber);


        this.addPlanTable = list;
        for (let index = 0; index < this.addPlanTable.length; index++) {
            const element = this.addPlanTable[index];
            element.isDelete = 0;
        }
        // this.t_addPlanTable = [...list];
        // }, err => {

        // })
    }
    onSave(state: any) {
        this.time = setTimeout(() => { // 防止采购数量未失焦就点击保存导致采购数量 + 已采购数量 + 冻结数量 > 申请数量校验不生效
            this.save(state)
            clearTimeout(this.time)
        }, 500);
    }
    /**
     * 保存
     * @param state  (0 草稿 1待审核 2审核通过 3审核不通过 4入库中 5已完成 6已关闭)
     */
    save(state: any) {
        if (!this.purchaseObj.applyNumber) {
            return this.createMessage("warning", "请选择计划申请单");
        }
        if (!this.purchaseObj.firstParty) {
            return this.createMessage("warning", "请选择甲方");
        }
        if (!this.purchaseObj.partyB) {
            return this.createMessage("warning", "请选择乙方");
        }
        if (this.addPlanTable.length == 0) {
            return this.createMessage("warning", "请选择采购内容");
        }

        for (let index = 0; index < this.addPlanTable.length; index++) {
            const { deliveryTime, purchasePrice, maxPurchasedNumber, purchaseNumber } = this.addPlanTable[index];
            if (!deliveryTime) {
                this.createMessage("warning", "交货日期不能为空");
                return;
            }
            if (!purchaseNumber) {
                this.createMessage("warning", "采购数量不能为空");
                return;
            } else if (!purchasePrice) {
                this.createMessage("warning", "采购单价不能为空");
                return;
            }
            // 采购数量 + 已采购数量 + 冻结数量 > 申请数量
            if (purchaseNumber > maxPurchasedNumber) {
                this.createMessage("warning", "采购数量已经超过最大采购数量, 请从新输入采购数量");
                return;
            }
        }
        if (this.messageId != null) {
            return;
        }
        this.purchaseObj.state = state;
        const copyList = JSON.parse(JSON.stringify(this.addPlanTable))
        copyList && copyList.forEach((element: any) => { // 清除冻结数量防止后端入库出现bug
            element.frozenNumber = ''
            element.planFrozenNumber = ''
        });
        let json = {
            purchase: this.purchaseObj,
            list: copyList
        }
        // console.log(JSON.stringify(copyList, null, '\t'))
        // if (this.purchaseObj) {
        //     return
        // }
        this.createBasicMessage();

        if (this.purchaseObj.id == 0) {
            delete this.purchaseObj.id;
            delete json.purchase.purchaseNumber;

            this.PurchaseOrderAddService.save(json).subscribe((res: any) => {
                this.removeBasicMessage();
                if (res.code != 0) {
                    this.createMessage("error", res.message);
                    return;
                }
                this.createMessage("success", res.message);
                this.router.navigate(['stock/purchaseOrder']);
            }, err => {
                this.removeBasicMessage();
                this.createMessage("error", err.message);
            })
        } else {
            this.PurchaseOrderAddService.update(json).subscribe((res: any) => {
                this.removeBasicMessage();
                if (res.code != 0) {
                    this.createMessage("error", res.message);
                    return;
                }
                this.createMessage("success", res.message);
                this.router.navigate(['stock/purchaseOrder']);
            }, err => {
                this.removeBasicMessage();
                this.createMessage("error", err.message);
            })
        }
    }
    /**
     * 申请单列表
     */
    getPlanDetails(id: any) {
        this.PurchaseOrderAddService.getPlanDetails(id).subscribe((res: any) => {
            this.planTable = res.data;
            this.planTable.list = this.planTable.list.filter(function (item: any) { return item.state != -1; });

            for (let index = 0; index < this.planTable.list.length; index++) {
                const element = this.planTable.list[index];
                element.isShow = 0;
            }
            if (this.addPlanTable.length >= 0) {
                for (let index = 0; index < this.addPlanTable.length; index++) {
                    const element = this.addPlanTable[index];
                    let obj: any = this.planTable.list.filter(function (items: any) { return items.id === element.planId })[0];
                    if (obj) {
                        obj.isShow = 1;
                    }
                }
            }
        }, err => {
        })
    }
    /**
     * 状态转文字
     */
    state_to_text(s: any) {
        let test = "";
        switch (s) {
            case 0:
                test = "采购";
                break;
            case 1:
                test = "已手动关闭";
                break;
            case 2:
                test = "已完成采购";
                break;
            case 3:
                test = "入库";
                break;
            default:
                test = "-";
                break;
        }
        return test;
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
