import { Component, OnInit } from '@angular/core';
import { NzMessageService } from 'ng-zorro-antd/message';

import { WarehouseGoodsService } from './warehouse-goods.service';

@Component({
    selector: 'app-warehouse-goods',
    templateUrl: './warehouse-goods.component.html',
    styleUrls: ['./warehouse-goods.component.scss']
})
export class WarehouseGoodsComponent implements OnInit {

    /**
     * 列表数据源
     */
    listOfData?: any;
    /**
     * 查询load动画
     */
    isLoadingOne = false;
    /**
     * 当前是否在搜索
     */
    searchHint = false;
    /**
     * 商品分类下拉
     */
    GoodsTypeList: any = null;
    /**
     * 品牌下拉
     */
    BrandList: any = null;
    /**
     * 当前搜索name
     */
    searchName = "";
    /**
     * 表单load动画
     */
    tableLoading: boolean = false;
    /**
     * 加载失败显示图像占位符
     */
    fallback =
        'data:image/png;base64,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';
    /**
     * 查询参数
     */
    queryForm: any = {
        // 商品名称
        name: '',
        // 商品分类
        type: '',
        // 品牌ID
        brandId: '',
        // 属性
        attr: '',
        // 开始时间
        beginTime: '',
        // 结束时间
        endTime: '',
        // 时间区间
        dateFormat: '',
        // 69码
        code: '',
        page: '1',
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
        private warehouseGoodsService: WarehouseGoodsService,
        private message: NzMessageService
    ) { }

    ngOnInit() {
        WarehouseGoodsComponent.updateCache = () => {
            this.tableLoading = false;
            this.getGoodsList();
        }
        this.getGoodsList();
        this.getBrandList();
        this.getGoodsTypeList();
    }
    /**
     * 查询
    */
    query() {
        this.getGoodsList();
    }
    /**
     * 搜索返回原列表
    */
    backList() {
        this.queryForm.name = "";
        this.queryForm.type = "";
        this.queryForm.brandId = "";
        this.queryForm.code = "";
        this.queryForm.attr = "";
        this.queryForm.dateFormat = "";
        this.queryForm.beginTime = "";
        this.queryForm.endTime = "";
        this.queryForm.page = 1;
        this.searchHint = false;
        this.getGoodsList();
    }
    /**
     * 页码改变
     * @param index 页码数
     */
    onPageIndexChange(index: Number) {
        console.log(index);
        this.queryForm.page = index;
        this.getGoodsList();
    }
    /**
     * 每页条数改变的回调
     * @param index 页码数
     */
    onPageSizeChange(index: Number) {
        this.queryForm.pageSize = index;
        this.getGoodsList();
        console.log(index);
    }
    /**
     * 同步
     */
    synchro() {
        if (this.messageId != null) {
            return;
        }
        this.createBasicMessage();
        this.warehouseGoodsService.itemSynchronize().subscribe((res: any) => {
            this.removeBasicMessage();
            if (res.code != 0) {
                this.createMessage("error", res.message);
                return;
            }
            this.createMessage("success", res.message);
        }, err => {
            this.removeBasicMessage();
            this.createMessage("error", err.message);
        })
    }
    /**
     * 同步商品库存
     */
    synchroStore() {
        if (this.messageId != null) {
            return;
        }
        this.createBasicMessage();
        this.warehouseGoodsService.stockInventoryQuery().subscribe((res: any) => {
            this.removeBasicMessage();
            if (res.code != 0) {
                this.createMessage("error", res.message);
                return;
            }
            this.createMessage("success", "同步商品库存成功");
        }, err => {
            this.removeBasicMessage();
            this.createMessage("error", err.message);
        })
    }
    getGoodsList() {
        if (this.tableLoading) { return; }
        this.listOfData = [];
        this.tableLoading = true;

        this.warehouseGoodsService.getList(this.queryForm).subscribe((res: any) => {
            this.listOfData = res.data;

            let textArr = [];
            if (this.queryForm.name) {
                textArr.push(this.queryForm.name);
            }
            if (this.queryForm.code) {
                textArr.push(this.queryForm.code);
            }
            if (this.queryForm.attr) {
                textArr.push(this.queryForm.attr);
            }
            if (this.queryForm.brandId) {
                textArr.push(this.queryForm.brandId);
            }
            if (this.queryForm.type) {
                textArr.push(this.queryForm.type);
            }
            if (this.queryForm.dateFormat) {
                textArr.push(this.queryForm.dateFormat);
            }
            this.searchName = textArr.join(' | ');

            this.isLoadingOne = false;

            for (let index = 0; index < this.listOfData.records.length; index++) {
                const element = this.listOfData.records[index];
                element.stateText = this.state_To_text(element.state);
            }
            this.tableLoading = false;
        }, err => {
            this.tableLoading = false;
        })
    }

    /**
     * 商品分类下拉
     */
    getGoodsTypeList() {
        this.warehouseGoodsService.getGoodsTypeList().subscribe((res: any) => {
            if (res.code != 0) {
                this.createMessage("error", res.message);
                return;
            }
            this.GoodsTypeList = res.data;
        }, err => {
            this.createMessage("error", "请求失败");

        })
    }
    /**
     * 商品 品牌下拉
     */
    getBrandList() {
        this.warehouseGoodsService.getBrandList().subscribe((res: any) => {
            if (res.code != 0) {
                this.createMessage("error", res.message);
                return;
            }
            this.BrandList = res.data;
        }, err => {

        })
    }
    /**
     * 确认删除
     * @param id 
     */
    confirm(id: any = null) {
        if (this.messageId != null) {
            return;
        }

        this.createBasicMessage();
        this.warehouseGoodsService.del({ id: id }).subscribe((res: any) => {
            this.removeBasicMessage();
            if (res.code != 0) {
                this.createMessage("error", res.message);
                return;
            }
            this.createMessage("success", "删除成功");
            this.getGoodsList();
        }, err => {
            this.isLoadingOne = false;
            this.removeBasicMessage();
            this.createMessage("error", err.message);
        });
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
    * @param type 其他提示类型 success:成功 error:失败 warning:警告
    */
    createMessage(type: any, str: any): void {
        this.message.create(type, str);
    }
}
