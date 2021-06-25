import { Component, OnInit } from '@angular/core';
import { NzMessageService } from 'ng-zorro-antd/message';

import { NewAdjustOrderService } from './new-adjust-order.service';
@Component({
    selector: 'app-new-adjust-order',
    templateUrl: './new-adjust-order.component.html',
    styleUrls: ['./new-adjust-order.component.scss']
})
export class NewAdjustOrderComponent implements OnInit {

    /**
     * 查询售后列表参数格式
     */
    queryForm: any = {
        //  根据售后单号模糊查询
        returnNum: '',
        // 当前页码
        current: '1',
        // 分页大小
        size: '20',
    }
    /**
     * 新建调节单参数
     */
    AdjustParam: any = {
        // 调节订单类型：1-换货、2-补货
        adjustType: "",
        // 售后单id
        refundId: 0,
        // 跟进备注
        followText: "",
        // 收货人
        consignee: "",
        // 电话
        tel: "",
        // 详细地址
        address: "",
        // 地址库ID
        districtId: [],
        // 商品列表
        order: [],
    }
    /**
     * 售后单选择器
     */
    selectParam: { list: Array<{ id: string, returnNum: string }>, isLoading: boolean } = {
        list: [],
        isLoading: false,
    }
    /**
     * 区域选择
     */
    nzOptions: any = [];
    /**
     * 地区区域数据
     */
    areaData: any = [];
    /**
     * 全局 loading
     */
    messageId: any = null;
    /**
     * 加载失败显示图像占位符
     */
    fallback =
        'data:image/png;base64,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';

    constructor(
        private NewAdjustOrderService: NewAdjustOrderService,
        private message: NzMessageService
    ) { }

    ngOnInit() {
        this.loadMore();
        this.getArea();
    }
    /**
     * 	文本框值变化时回调
     * @param value 
     */
    onSearch(value: string): void {
        console.log(value);
    }
    /**
     * 获取地区数据
     */
    getArea() {
        this.NewAdjustOrderService.area().subscribe((res: any) => {
            // 地区
            let area = res;
            this.areaData = area;
            this.nzOptions = [];
            // 省
            for (const key in area.province) {
                let province = area.province[key];
                let obj: any = {
                    value: province.id,
                    label: province.name,
                    children: []
                };
                // 市
                for (const k in area.city[province.id]) {
                    let city = area.city[province.id][k];
                    let cityObj: any = {
                        value: city.id,
                        label: city.name,
                        children: []
                    }
                    // 区
                    for (const s in area.county[city.id]) {
                        let county = area.county[city.id][s];
                        cityObj.children.push({
                            value: county.id,
                            label: county.name,
                            isLeaf: true,
                        })
                    }
                    obj.children.push(cityObj);
                }
                this.nzOptions.push(obj);
            }
        }, err => {
        });
    }
    /**
     * 根据售后单号获取订单相关信息
     */
    getSaleInfo() {
        if(!this.AdjustParam.refundId){
            this.resetObj();
            return;
        }
        this.NewAdjustOrderService.getSaleInfo(this.AdjustParam.refundId).subscribe((res: any) => {
            this.resetObj();
            if (res.code != 0) {
                this.createMessage("error", res.message);
                return;
            }
            let obj = res.data;
            this.AdjustParam.refundId = obj.refundId;
            this.AdjustParam.consignee = obj.consignee;
            this.AdjustParam.tel = obj.tel;
            this.AdjustParam.address = obj.address;
            this.AdjustParam.order = obj.list;

            let item: any = this.selectParam.list.filter((item: any, i: any) => {
                return item.id == this.AdjustParam.refundId;
            })[0];
            this.AdjustParam.adjustType = item.type == 5 ? "2" : "1";
            // 省
            for (const key in this.areaData.province) {
                let province = this.areaData.province[key];
                // 市
                for (const k in this.areaData.city[province.id]) {
                    let city = this.areaData.city[province.id][k];
                    // 区
                    for (let index = 0; index < this.areaData.county[city.id].length; index++) {
                        const county = this.areaData.county[city.id][index];
                        if (county.id == obj.districtId) {
                            this.AdjustParam.districtId.push(province.id);
                            this.AdjustParam.districtId.push(city.id);
                            this.AdjustParam.districtId.push(county.id);
                            break;
                        }
                    }
                }
            }

        }, err => {
            this.createMessage("error", err.message);
        });
    }
    /**
     * 加载单号列表
     */
    loadMore() {
        this.NewAdjustOrderService.numList(this.queryForm).subscribe((res: any) => {
            if (res.code != 0) {
                this.createMessage("error", res.message);
                return;
            }
            this.selectParam.list = ([...this.selectParam.list, ...res.data.records] as []);
            if (res.data.records.length != 0) {
                this.queryForm.current++;
            }
        }, err => {
            this.createMessage("error", err.message);
        });
    }
    /**
     * 保存调节单
     */
    save() {
        if (this.AdjustParam.refundId == 0) {
            return this.createMessage("warning", "请选择售后单号");
        }
        if (!this.AdjustParam.followText) {
            return this.createMessage("warning", "请输入跟进备注");
        }
        if (!this.AdjustParam.consignee) {
            return this.createMessage("warning", "请输入收货人");
        }
        if (!this.AdjustParam.tel) {
            return this.createMessage("warning", "请输入联系方式");
        }
        if (this.AdjustParam.districtId.length == 0) {
            return this.createMessage("warning", "请选择地址");
        }
        if (!this.AdjustParam.address) {
            return this.createMessage("warning", "请输入详细地址");
        }
        this.NewAdjustOrderService.save(this.AdjustParam).subscribe((res: any) => {
            if (res.code != 0) {
                this.createMessage("error", res.message);
                return;
            }
            this.createMessage("success", "新建调节单成功");
            this.resetObj();
        }, err => {
            this.createMessage("error", err.message);
        });
    }
    /**
     * 重置数据
     */
    resetObj() {
        this.AdjustParam = {
            // 调节订单类型：1-换货、2-补货
            adjustType: "",
            // 售后单id
            refundId: 0,
            // 跟进备注
            followText: "",
            // 收货人
            consignee: "",
            // 电话
            tel: "",
            // 详细地址
            address: "",
            // 地址库ID
            districtId: [],
            // 商品列表
            order: [],
        }
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
