import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup } from '@angular/forms';
import { ActivatedRoute, Router } from '@angular/router';
import { NzMessageService } from 'ng-zorro-antd/message';
// import { Duplex } from 'stream';
import { PurchasePlanApplyService } from './purchase-plan-apply.service';

@Component({
    selector: 'app-purchase-plan-apply',
    templateUrl: './purchase-plan-apply.component.html',
    styleUrls: ['./purchase-plan-apply.component.scss']
})
export class PurchasePlanApplyComponent implements OnInit {
    id: any;
    /**
     * 列表数据源
     */
    listOfData?: any;
    /**
    * 采购计划详情数据
    */
    detailsData: any = {
        billNo: '',
        remark: ''
    };
    /**
     * 模态框表单
     */
    modalForm!: FormGroup;
    /**
     * 复选框
     */
    checked = false;
    /**
     * 模态框显示隐藏
     */
    isVisible: boolean = false;
    /**
     * 文件
     */
    fileList: any[] = [];
    /**
     * 期望交货时间
     */
    deliveryTime: any = null;
    /**
     * 最迟交货日期
     */
    endDeliveryTime: any = null;
    /**
     * 当前是否在搜索
     */
    searchHint = false;
    /**
     * 当前搜索name
     */
    searchName = "";
    /**
     * 本地列表数据
     */
    tableData: any = [];
    /**
    * 本地列表删除的数据
    */
    tableDelData: any = [];
    /**
     * 查询参数
     */
    queryForm: any = {
        // 商品
        whGood: '',
        // 排队数量
        lineupNumber: '',
        // 库存
        stock: '',
        // 超卖数量
        oversoldNumber: '',
        page: '1',
        pageSize: '10',
    }
    /**
     * 查询load动画
     */
    isLoadingOne = false;
    /**
     * 表格是否加载中
     */
    tableLoading: any = false;
    /**
     * 默认仓库id
     */
    defaultWhPutId: any;
    whArr: any;
    // 缓存在本地数据，后端不需要这一类数据
    cacheDate: any = {}

    /**
     * 已选择仓库商品(临时存放)
     */
    selectGoodsArr: any = [];
    constructor(
        private PurchasePlanApplyService: PurchasePlanApplyService,
        private activatedRoute: ActivatedRoute,
        private message: NzMessageService,
        private fb: FormBuilder,
        private router: Router,
    ) { }

    ngOnInit() {
        this.modalForm = this.fb.group({
            // id
            id: [null],
            // 计划单号
            billNo: [null],
            // 附件
            enclosure: [null],
            // 备注
            remark: [null],
            // 审核人
            reviewer: [null],
            // 状态 (0 草稿 1待审核 2审核通过 3审核不通过 4采购中 5已完成 6已关闭)
            state: 0,
            // 完成或关闭时间
            endTime: [null],
            // 审核意见
            auditDesc: [null],
            // 关闭单的备注
            closeRemark: [null],
        })
        this.getWhgoods();

        this.modalForm.controls.billNo.disable();

        this.activatedRoute.params.subscribe(params => {
            this.id = params.id;
            if (this.id != 0) {
                this.getTableDataList();
            }
        })
    }

    showModal() {
        this.checked = false;
        this.isVisible = true;
        // for (let i = 0; i < this.tableData.length; i++) {
        //     this.selectGoodsArr.push(this.tableData[i]);
        // }
        this.selectGoodsArr = [... this.tableData];
        this.getWhGoodsList();
    }

    handleCancel() {
        this.isVisible = false;
        // this.selectGoodsArr = [];
    }

    /**
     * 选择更多商品de查询
     */
    query() {
        this.isLoadingOne = true;

        let reg = /^[+]{0,1}(\d+)$/;
        if (!reg.test(this.queryForm.lineupNumber) == null && !reg.test(this.queryForm.lineupNumber)) {
            this.createMessage('warning', '请输入排队数量且为整数');
            return;
        }
        if (!reg.test(this.queryForm.stock) == null && !reg.test(this.queryForm.stock)) {
            this.createMessage('warning', '请输入实际库存且为整数');
            return;
        }
        if (!reg.test(this.queryForm.oversoldNumber) == null && !reg.test(this.queryForm.oversoldNumber)) {
            this.createMessage('warning', '请输入超卖数量且为整数');
            return;
        }
        this.searchHint = true;
        this.getWhGoodsList();
    }

    /**
     * 搜索返回原列表
     */
    backList() {
        this.queryForm.whGood = "";
        this.queryForm.lineupNumber = "";
        this.queryForm.stock = "";
        this.queryForm.oversoldNumber = "";
        this.queryForm.page = 1;
        this.searchHint = false;
        this.getWhGoodsList();
    }

    initData(obj: any) {
        if (this.detailsData) {
            this.modalForm.get('id')!.setValue(obj.id);
            this.modalForm.get('billNo')!.setValue(obj.billNo);
            this.modalForm.get('enclosure')!.setValue(obj.enclosure);
            this.modalForm.get('remark')!.setValue(obj.remark);
            this.modalForm.get('reviewer')!.setValue(obj.reviewer);
            this.modalForm.get('state')!.setValue(obj.state);
            this.modalForm.get('endTime')!.setValue(obj.endTime);
            this.modalForm.get('auditDesc')!.setValue(obj.auditDesc);
            this.modalForm.get('closeRemark')!.setValue(obj.closeRemark);

            if (obj.enclosure) {
                this.fileList = obj.enclosure.split(',').map((item: any) => {
                    return {
                        url: item,
                        id: item,
                        name: (item.match(/[^\\/]+\.[^\\/]+$/) || []).pop(),
                        status: 'done',
                    }
                })
            }
        }
    }

    getWhGoodsList() {
        this.PurchasePlanApplyService.whGetList(this.queryForm).subscribe((res: any) => {
            res.data.records.forEach((element: any) => {
                element['checked'] = false;
            });
            this.listOfData = res.data;
            this.searchName = this.queryForm.whGood;

            this.checked = false;
            if (this.selectGoodsArr.length != 0) {
                for (let index = 0; index < this.selectGoodsArr.length; index++) {
                    const element = this.selectGoodsArr[index];
                    for (let k = 0; k < this.listOfData.records.length; k++) {
                        const obj = this.listOfData.records[k];
                        if (element.whGoodsId == obj.id) {
                            obj.checked = true;
                            continue;
                        }
                    }
                }
            }
            this.tableLoading = false;
            this.updateCheckAll();
        }, err => {
            this.tableLoading = false;
        });
    }

    /**
     * 详情
     */
    getTableDataList() {
        this.PurchasePlanApplyService.details({ "id": this.id }).subscribe((res: any) => {
            this.detailsData = res.data.procurementPlan;
            this.tableData = res.data.list;
            this.initData(res.data.procurementPlan);
            this.isLoadingOne = false;
            this.setStorageTotal()
        }, err => {
            this.isLoadingOne = false;
        })
    }

    submitForm(state: any): void {
        let procurementPlan = this.modalForm.value;
        procurementPlan.state = state;

        if (this.tableData.length < 1) {
            return this.createMessage('warning', '仓库商品至少要选择1件，否则无法保存');
        }

        let allTableData = this.tableData.concat(this.tableDelData);

        for (let index = 0; index < this.tableData.length; index++) {
            const element = this.tableData[index];

            if (!element.planNumber) {
                return this.createMessage('warning', '请输入计划数量');
            }
            if (!element.whPutId) {
                return this.createMessage('warning', '请输入入库仓库');
            }
            if (element.planNumber <= 0) {
                return this.createMessage('warning', '计划数量不能小于0');
            }
        }

        const json = {
            procurementPlan: this.modalForm.value,
            list: allTableData
        }

        // 附件
        const enclosureList = [];
        for (let index = 0; index < this.fileList.length; index++) {
            enclosureList.push(this.fileList[index].url);
        }
        this.modalForm.value.enclosure = enclosureList.toString();

        if (this.modalForm.value.id == null) {
            this.PurchasePlanApplyService.add(json).subscribe((res: any) => {
                this.isLoadingOne = false;
                if (res.code != 0) {
                    this.createMessage('error', res.message);
                    return;
                }
                this.createMessage('success', "添加成功");
                this.router.navigate(['stock/purchasePlan']);
            }, err => {
                this.isLoadingOne = false;
            })
        } else {
            this.PurchasePlanApplyService.update(json).subscribe((res: any) => {
                this.isLoadingOne = false;
                if (res.code != 0) {
                    this.createMessage('error', res.message);
                    return;
                }
                this.createMessage('success', "修改成功");
                this.router.navigate(['stock/purchasePlan']);
            }, err => {
                this.createMessage('error', "请求出错");
                this.isLoadingOne = false;
            })
        }

        console.log(this.tableData);
    }

    /**
     * 查询仓库列表
     */
    getWhgoods() {
        this.PurchasePlanApplyService.wh().subscribe((res: any) => {
            if (res.code != 0) {
                this.createMessage("error", res.message);
                return;
            }
            this.whArr = res.data.records;
            let state = [];

            for (let index = 0; index < this.whArr.length; index++) {
                if (this.whArr[index].state == 1) {
                    state.push(this.whArr[index]);
                }
            }

            this.whArr = state;
        }, err => {
        });
    }

    provinceChange(): void {
        for (let index = 0; index < this.tableData.length; index++) {
            const element = this.tableData[index];
            // if (element.whPutId == null || element.whPutId == "") {
            element.whPutId = this.defaultWhPutId;
            // }
            console.log(element.whPutName);
        }
    }

    // 表格删除
    crossDel(whGoodsId: any) {
        for (let i = 0; i < this.tableData.length; i++) {
            if (this.tableData[i].temp != 0 && this.tableData[i].whGoodsId == whGoodsId) {
                this.tableData[i].purchasePlanId = 0;
                this.tableData[i].isDelete = 1;
                this.tableDelData.push(this.tableData[i]);
                break;
            }
        }
        this.tableData = this.tableData.filter((d: any) => d.whGoodsId !== whGoodsId);
    }

    // 申请已选商品
    sendRequest() {
        if (this.selectGoodsArr.length == 0) {
            return this.createMessage('warning', '请至少选择1件商品');
        }
        let sumNum = 0;
        let addNum = 0;
        this.tableData = [];
        for (let index = 0; index < this.selectGoodsArr.length; index++) {
            const element = this.selectGoodsArr[index];
            sumNum++;
            let goodsIndex = this.tableData.findIndex((obj: any, i: any) => {
                return obj.whGoodsId == element.whGoodsId;
            });
            if (goodsIndex == -1) {
                addNum++;
                this.tableData.push(element);
            }
        }
        this.setStorageTotal()
        return this.createMessage('success', '勾选' + sumNum + "件商品，成功添加" + addNum + "件商品");
    }

    // item单选
    onItemChecked(id: number, checked: boolean): void {
        console.log("id:" + id + ",checked:" + checked);
        const index = this.listOfData.records.findIndex((item: { id: number; }) => item.id === id);
        // this.listOfData.records[index].checked = checked;
        let element = this.listOfData.records[index];
        element.checked = checked;
        if (checked) {
            this.selectGoodsArr.push({
                // id: element.id,
                // 采购计划id
                purchasePlanId: this.id,
                // 计划数量
                planNumber: element.planNumber,
                // 仓库id
                whPutId: this.defaultWhPutId,
                // 状态 (0 部分采购 1 已关闭 2 采购完成 3 采购中)
                state: 0,
                // 期望交货日期
                deliveryTime: element.deliveryTime,
                // 最迟交货日志
                endDeliveryTime: element.endDeliveryTime,
                // 仓库商品id
                whGoodsId: element.id,
                // 完成或关闭时间
                endTime: element.endTime,
                // 审核意见
                auditDesc: element.auditDesc,
                // 商品名称
                name: element.name,
                // 69码
                code: element.code,
                // 商品规格
                attr: element.attr,
                //标准采购价 (含税)
                standardCostPrice: element.standardCostPrice,
                // 临时
                temp: 0,
                // 是否删除删除(0表示不删除 1表示删除)
                isDelete: 0,
            })
        } else {
            this.selectGoodsArr = this.selectGoodsArr.filter((item: any) => item.whGoodsId !== id);
        }
        this.updateCheckAll();
    }
    // 全选
    onAllChecked(value: boolean): void {
        let listsData = this.listOfData.records;
        listsData.forEach((item: { checked: boolean; }) => item.checked = value);
        for (let index = 0; index < listsData.length; index++) {
            const element = listsData[index];
            this.selectGoodsArr = this.selectGoodsArr.filter((item: any) => item.whGoodsId !== element.id)
        }
        for (let index = 0; index < listsData.length; index++) {
            const element = listsData[index];
            if (element.checked) {
                this.selectGoodsArr.push({
                    // id: element.id,
                    // 采购计划id
                    purchasePlanId: this.id,
                    // 计划数量
                    planNumber: element.planNumber,
                    // 仓库id
                    whPutId: this.defaultWhPutId,
                    // 状态 (0 部分采购 1 已关闭 2 采购完成 3 采购中)
                    state: 3,
                    // 期望交货日期
                    deliveryTime: element.deliveryTime,
                    // 最迟交货日志
                    endDeliveryTime: element.endDeliveryTime,
                    // 仓库商品id
                    whGoodsId: element.id,
                    // 完成或关闭时间
                    endTime: element.endTime,
                    // 审核意见
                    auditDesc: element.auditDesc,
                    // 商品名称
                    name: element.name,
                    // 69码
                    code: element.code,
                    // 商品规格
                    attr: element.attr,
                    //标准采购价 (含税)
                    standardCostPrice: element.standardCostPrice,
                    // 临时
                    temp: 0,
                    // 是否删除删除(0表示不删除 1表示删除)
                    isDelete: 0,
                });
            }
        }
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

    /**
     * 页码改变
     * @param index 页码数
     */
    onPageIndexChange(index: Number) {
        console.log(index);
        this.queryForm.page = index;
        this.getWhGoodsList();
    }
    /**
     * 每页条数改变的回调
     * @param index 页码数
     */
    onPageSizeChange(index: Number) {
        this.queryForm.pageSize = index;
        this.getWhGoodsList();
        console.log(index);
    }


    handleFileInput(files: any) {
        let fileArr = files.target.files;
        if (this.fileList.length == 1) {
            files.target.value = "";
            return this.createMessage('success', "仅允许上传一个文件")
        }

        for (let index = 0; index < fileArr.length; index++) {
            const element = fileArr[index];
            this.postFile(element, (res: any) => {
                if (res.code != 0) {
                    return;
                }

                this.fileList.push({
                    id: res.data,
                    url: res.data,
                    name: files.target.files[0].name,
                })
                files.target.value = "";
                this.createMessage('success', "附件上传成功");
            })
        }
    }

    /**
     * 上传文件
     * @param su 上传完成回调函数
     */
    postFile(file: any, su: any) {
        this.PurchasePlanApplyService.postFile(file).subscribe(data => {
            if (su) su(data);
        }, error => {

        });
    }
    fileDown(url: any) {
        window.location.href = url;
    }
    deleteFile(id: any) {
        this.fileList = this.fileList.filter((d: any) => d.id !== id);
    }

    /**
    * 全局展示操作反馈信息
    * @param type 其他提示类型 success:成功 error:失败 warning:警告
    */
    createMessage(type: any, str: any): void {
        this.message.create(type, str);
    }
    // 在这里做入库数量总合计算
    onBlurStoragenNum() {
        this.setStorageTotal()
    }
    // 入库数量累加
    setStorageTotal() {
        this.cacheDate.storageTotal = 0
        this.tableData && this.tableData.forEach((item: any) => {
            const { planNumber } = item
            if (planNumber) {
                this.cacheDate.storageTotal += ~~planNumber
            }
        });
    }
}
