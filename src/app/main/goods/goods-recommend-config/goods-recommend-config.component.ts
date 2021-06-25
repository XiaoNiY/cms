import { templateJitUrl } from '@angular/compiler';
import { Component, OnInit } from '@angular/core';
import { NzMessageService } from 'ng-zorro-antd/message';
import { GoodsRecommendConfigService } from './goods-recommend-config.service';

@Component({
    selector: 'app-goods-recommend-config',
    templateUrl: './goods-recommend-config.component.html',
    styleUrls: ['./goods-recommend-config.component.scss']
})
export class GoodsRecommendConfigComponent implements OnInit {

    /**
     * 数据源
     */
    listOfData?: any;
    /**
     * 商品列表数据源
     */
    detailsData?: any;
    isVisible: boolean = false;
    /**
     * 当前是否在搜索
     */
    searchHint = false;
    /**
     * 当前搜索name
     */
    searchName: string = "";
    /**
    * 查询load动画
    */
    isLoadingOne: boolean = false;
    /**
     * 表格是否加载中
     */
    tableLoading: boolean = false;
    /**
     * 全局 loading
     */
    messageId: any = null;

    /**
     * 类型下拉
     */
    GoodsTypeList: any = [];
    /**
     * 品牌下拉
     */
    BrandTypeList: any = [];
    /**
     * 本地列表数据
     */
    tableData: any = [];
    /**
     * 保存添加对象
     */
    recommendGoodsList: any = [];
    /**
     * 保存删除对象
     */
    deleteIdList: any = [];

    defaultColor: any;
    queryForm: any = {
        // 商品编号或名称
        name: "",
        // 商品类型id
        typeId: "",
        // 品牌id
        brandId: "",
        // 当前页码
        current: "1",
        // 分页大小
        size: "10",
    }
    /**
     * 加载失败显示图像占位符
     */
    fallback =
        'data:image/png;base64,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';
    constructor(
        private goodsRecommendConfigService: GoodsRecommendConfigService,
        private message: NzMessageService,
    ) { }

    ngOnInit() {
        this.getRecommendList();
        this.getGoodsTypeList();
        this.getBrandTypeList();
    }

    showModal() {
        this.isVisible = true;
        this.goodsList();
    }

    handleCancel() {
        this.isVisible = false;
    }

    /**
     * 列表
     */
    getRecommendList() {
        if (this.tableLoading) { return; }
        this.tableLoading = true;
        this.goodsRecommendConfigService.recommend().subscribe((res: any) => {
            this.deleteIdList = [];
            this.listOfData = res.data;
            this.jxStatus();
            this.tableLoading = false;
        }, err => {
            this.tableLoading = false;
            this.createMessage('error', err.message);
        })
    }

    /**
     * 初始化精选状态
     */
    jxStatus() {
        for (let index = 0; index < this.listOfData.length; index++) {
            const element = this.listOfData[index];
            if (element.labelColor && element.labelText) {
                element.jxStatus = true;
            }
        }
    }

    /**
     * 保存
     */
    save() {
        const json: any = {
            deleteIdList: this.deleteIdList,
            recommendGoodsList: this.listOfData,
        }

        // 通用
        let selectUserTypeNum: number = 0;
        // B端
        let selectUserTypeB: number = 0;
        // C端
        let selectUserTypeC: number = 0;
        for (let index = 0; index < json.recommendGoodsList.length; index++) {
            const element = json.recommendGoodsList[index];
            // 通用
            if (element.userType == 0) {
                selectUserTypeNum++;
            }
            // c端
            if (element.userType == 1) {
                selectUserTypeC++;
            }
            // b端
            if (element.userType == 2) {
                selectUserTypeB++;
            }
        }

        if (selectUserTypeNum + selectUserTypeC + selectUserTypeB === 0) {
            // 一个商品都没有
            this.createMessage('warning', '请至少选择6个商品');
            return;
        } else if (!selectUserTypeC && !selectUserTypeB && selectUserTypeNum) {
            // 只有通用
            if (selectUserTypeNum < 6) {
                this.createMessage('warning', '请至少选择6个适用B端商品');
                return;
            }
        } else if (!selectUserTypeC && selectUserTypeB && !selectUserTypeNum) {
            // 只有B端商品
            if (selectUserTypeB < 6) {
                this.createMessage('warning', '请至少选择6个适用B端商品');
                return;
            }
        } else if (selectUserTypeC && !selectUserTypeB && !selectUserTypeNum) {
            // 只有C端商品
            if (selectUserTypeC < 6) {
                this.createMessage('warning', '请至少选择6个适用C端商品');
                return;
            }
        } else if (!selectUserTypeC && selectUserTypeB && selectUserTypeNum) {
            // 只有B端商品 + 通用商品
            if (selectUserTypeB + selectUserTypeNum < 6) {
                this.createMessage('warning', '请至少选择6个适用B端商品');
                return;
            }
        } else if (!selectUserTypeB && selectUserTypeC && selectUserTypeNum) {
            // 只有C端商品 + 通用商品
            if (selectUserTypeC + selectUserTypeNum < 6) {
                this.createMessage('warning', '请至少选择6个适用C端商品');
                return;
            }
        } else if (selectUserTypeB && selectUserTypeC && !selectUserTypeNum) {
            // 只有B端商品 + C端商品
            if (selectUserTypeB < 6) {
                this.createMessage('warning', '请至少选择6个适用B端商品');
            } else if (selectUserTypeC < 6) {
                this.createMessage('warning', '请至少选择6个适用C端商品');
            }
            return;
        } else {
            // B、C、通用都有
            if (selectUserTypeB + selectUserTypeNum < 6) {
                this.createMessage('warning', '请至少选择6个适用B端商品');
                return;
            } else if (selectUserTypeC + selectUserTypeNum < 6) {
                this.createMessage('warning', '请至少选择6个适用C端商品');
                return;
            }
        }

        this.goodsRecommendConfigService.save(json).subscribe((res: any) => {
            if (res.code != 0) {
                this.createMessage('error', res.message);
                return;
            }
            this.getRecommendList();
        })
    }

    /**
     * 删除
     */
    confirm(data: any) {
        this.deleteIdList.push(data.id);
        this.listOfData = this.listOfData.filter((d: any) => d.code !== data.code);
    }

    inputChange(data: any) {
        let flag = false;
        if (data.labelColor && data.labelText) {
            flag = true;
        }
        for (let index = 0; index < this.listOfData.length; index++) {
            const element = this.listOfData[index];
            if (element.code == data.code) {
                element.jxStatus = flag;
            }
        }
    }

    /**
     * 查询
     */
    query() {
        if (this.queryForm.name != "" || this.queryForm.typeId != "" || this.queryForm.brandId != "") {
            this.searchHint = true;
        } else {
            this.searchHint = false;
        }

        this.goodsList();
    }

    /**
     * 返回搜索列表
     */
    backList() {
        this.queryForm.name = "";
        this.queryForm.typeId = "";
        this.queryForm.brandId = "";
        this.queryForm.current = 1;
        this.searchHint = false;
        this.goodsList();
    }

    /**
     * 商品列表
     */
    goodsList() {
        if (this.tableLoading) { return; }
        this.tableLoading = true;
        this.goodsRecommendConfigService.goodsList(this.queryForm).subscribe((res: any) => {
            this.detailsData = res.data;
            this.searchName = this.queryForm.name;
            this.tableLoading = false;
        }, err => {
            this.tableLoading = false;
            this.createMessage('error', err.message);
        })
    }

    disableGoods(code: any): Boolean {
        for (let index = 0; index < this.listOfData.length; index++) {
            const element = this.listOfData[index];
            if (element.code == code) {
                return true;
            }
        }
        return false;
    }

    /**
     * 选择
     */
    sendGoods(data: any) {
        // for (let index = 0; index < this.listOfData.length; index++) {
        //     const element = this.listOfData[index];
        //     if (element.code == data.code) {
        //         return this.createMessage('warning', '该商品已存在');
        //     }
        // }
        this.listOfData.push({
            goodsId: data.id,
            code: data.code,
            name: data.name,
            shortName: data.shortName,
            goodsType: data.typeName,
            stockNum: data.stockNum,
            icon: data.icon,
            userType: data.userType,
            labelColor: "#ffffff"
        });
    }

    /**
     * 默认颜色
     */
    selectColor() {
        for (let index = 0; index < this.listOfData.length; index++) {
            const element = this.listOfData[index];
            if (element.labelColor) {
                element.labelColor = this.defaultColor;
            }
        }
    }

    /**
     * 分类下拉
     */
    getGoodsTypeList() {
        this.goodsRecommendConfigService.getGoodsTypeList().subscribe((res: any) => {
            if (res.code != 0) {
                this.createMessage("error", res.message);
                return;
            }
            this.GoodsTypeList = res.data;
        }, err => {
        });
    }
    /**
     * 品牌下拉
     */
    getBrandTypeList() {
        this.goodsRecommendConfigService.getBrandTypeList().subscribe((res: any) => {
            if (res.code != 0) {
                this.createMessage("error", res.message);
                return;
            }
            this.BrandTypeList = res.data;
        }, err => {
        });
    }

    /**
     * 页码改变
     * @param index 
     */
    onPageIndexChange(index: number) {
        console.log(index);
        this.queryForm.current = index;
        this.goodsList();
    }

    /**
     * 每页条数改变的回调
     * @param index 
     */
    onPageSizeChange(index: number) {
        console.log(index);
        this.queryForm.size = index;
        this.goodsList();
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
