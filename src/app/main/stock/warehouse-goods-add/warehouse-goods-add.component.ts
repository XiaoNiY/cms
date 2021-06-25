import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { ActivatedRoute, Router } from '@angular/router';
import { WarehouseGoodsAddService } from './warehouse-goods-add.service';
import { ConfigDictListService } from '../../config/config-dict-list/config-dict-list.service';

import { NzMessageService } from 'ng-zorro-antd/message';
@Component({
    selector: 'app-warehouse-goods-add',
    templateUrl: './warehouse-goods-add.component.html',
    styleUrls: ['./warehouse-goods-add.component.scss']
})
export class WarehouseGoodsAddComponent implements OnInit {
    id: any;
    isVisible = false;
    /**
    * 仓库商品详情数据
    */
    detailsData: any = null;
    /**
     * 表单
     */
    validateForm!: FormGroup;
    /**
     * 模态框表单
     */
    modalForm!: FormGroup;
    /**
     * 当前是否在搜索
     */
    searchHint = false;
    /**
     * 当前搜索name
     */
    searchName = "";
    /**
     * 商品分类下拉
     */
    GoodsTypeList: any = null;
    /**
     * 品牌下拉
     */
    BrandList: any = null;
    /**
     * 仓库管理列表
     */
    WhPutList: any = null;

    /**
     * 全局 loading
     */
    messageId: any = null;
    /**
     * 仓库商品单位
     */
    wh_goods_stock_unit: any = [];
    /**
     * 确认商品的含税成本价和税点不一致 是否显示
     */
    hintCode = false;
    /**
     * 加载失败显示图像占位符
     */
    fallback =
        'data:image/png;base64,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';
    constructor(
        private router: Router,
        private fb: FormBuilder,
        private activatedRoute: ActivatedRoute,
        private message: NzMessageService,
        private warehouseGoodsAddService: WarehouseGoodsAddService,
        private ConfigDictListService: ConfigDictListService,
    ) { }

    ngOnInit() {


        // 获取字典的 仓库商品单位
        this.ConfigDictListService.getDictList({
            // 名称或者编码搜索
            parentKey: "wh_goods_stock_unit",
            // 多少页，默认1
            pageNum: 1,
            // 每页多少条，默认10
            pageSize: 999
        }).subscribe((res: any) => {
            for (const key in res.data.list.records) {
                const element = res.data.list.records[key];
                this.wh_goods_stock_unit.push({
                    label: element.name,
                    value: element.content
                });
            }
            console.log(res);
        }, err => {
        });
        this.validateForm = this.fb.group({
            // id
            id: null,
            // 全称
            fullName: null,
            // 简称
            name: null,
            // 69码
            code: null,
            // 仓库编码
            whCode: null,
            // 备注
            remark: null,
            // 分类
            type: null,
            // 供应商
            supId: null,
            // 品牌
            brandId: null,
            // 单位
            stockUnit: null,
            // 保质期
            shelfLife: null,
            // 重量
            weight: null,
            // 默认仓库
            whId: null,
            // 属性描述
            attr: null,
            // 商品图片
            img: [''],
            // 备用图片
            spareImg: [''],
            // 附件
            enclosure: [''],
            // 进货周期
            purchaseDuration: null,
            // 税率
            taxRate: null,
            // 成本价(不含税)
            costPrice: null,
            // 标准成本价(含税)
            standardCostPrice: null,
            // 最高成本价(含税)
            highestCostPrice: null,
            // 预警值
            earlyWarning: null,
            // 最大超卖量
            max_single: null,
            // 确认商品
            readCheck: false,
            // 审核意见
            auditDesc: null,
            // 状态 (0 草稿 1 待审核 2正常 3审核不通过)
            state: 0,
        })
        this.modalForm = this.fb.group({
            // 审核意见
            auditDesc: null,
        })

        this.activatedRoute.params.subscribe((params) => {
            this.id = params.id;
            if (this.id != 0) {
                this.getDetails();
            }
        })
        this.getBrandList();
        this.getGoodsTypeList();
        this.getWhPutList();
    }
    /**
     * 设置数据
     */
    setData() {
        if (this.detailsData) {
            this.validateForm.get('id')!.setValue(this.detailsData.id);
            this.validateForm.get('fullName')!.setValue(this.detailsData.fullName);
            this.validateForm.get('name')!.setValue(this.detailsData.name);
            this.validateForm.get('code')!.setValue(this.detailsData.code);
            this.validateForm.get('whCode')!.setValue(this.detailsData.whCode);
            this.validateForm.get('remark')!.setValue(this.detailsData.remark);
            this.validateForm.get('type')!.setValue(this.detailsData.type + "");
            this.validateForm.get('supId')!.setValue(this.detailsData.supId + "");
            this.validateForm.get('brandId')!.setValue(this.detailsData.brandId + "");
            this.validateForm.get('stockUnit')!.setValue(this.detailsData.stockUnit + "");
            this.validateForm.get('shelfLife')!.setValue(this.detailsData.shelfLife);
            this.validateForm.get('weight')!.setValue(this.detailsData.weight);
            this.validateForm.get('whId')!.setValue(this.detailsData.whId + "");
            this.validateForm.get('attr')!.setValue(this.detailsData.attr);
            this.validateForm.get('img')!.setValue(this.detailsData.img);
            this.validateForm.get('spareImg')!.setValue(this.detailsData.spareImg);
            this.validateForm.get('enclosure')!.setValue(this.detailsData.enclosure);
            this.validateForm.get('purchaseDuration')!.setValue(this.detailsData.purchaseDuration);
            this.validateForm.get('taxRate')!.setValue(this.detailsData.taxRate);
            this.validateForm.get('costPrice')!.setValue(this.detailsData.costPrice);
            this.validateForm.get('standardCostPrice')!.setValue(this.detailsData.standardCostPrice);
            this.validateForm.get('highestCostPrice')!.setValue(this.detailsData.highestCostPrice);
            this.validateForm.get('earlyWarning')!.setValue(this.detailsData.earlyWarning);
            this.validateForm.get('max_single')!.setValue(this.detailsData.max_single);
            this.validateForm.get('readCheck')!.setValue(true);
            this.validateForm.get('state')!.setValue(this.detailsData.state);
        }
    }
    /**
     * 输入框回调
     */
    inputFun(s: any = null) {
        let obj = this.validateForm.value;
        let val = 0;
        if (obj.taxRate && obj.costPrice) {
            val = (obj.costPrice * obj.taxRate / 100) + obj.costPrice;
        }
        if (val != 0 && s != -1) {
            this.validateForm.get('standardCostPrice')!.setValue(val);
        }
        if (s == -1 && obj.standardCostPrice != val) {
            this.hintCode = true;
        } else {
            this.hintCode = false;
        }
    }
    /**
     * 详情
     */
    getDetails() {
        this.warehouseGoodsAddService.details(this.id).subscribe((res: any) => {
            this.detailsData = res.data;
            this.setData();
        }, err => {
        })
    }
    /**
     * 保存
     */
    submitForm(state: any): void {
        let obj = this.validateForm.value;
        if (this.messageId != null) {
            return;
        }
        if (!obj.name) {
            return this.createMessage("warning", "请输入简称");;
        }
        // if (!obj.name) {
        //     return this.createMessage("warning", "请输入全称");;
        // }
        // if (!obj.whCode) {
        //     return this.createMessage("warning", "请输入仓库编码");;
        // }
        if (!obj.type) {
            return this.createMessage("warning", "请选择分类");;
        }
        // if (!obj.supId) {
        //     return this.createMessage("warning", "请选择供应商");;
        // }
        if (!obj.brandId) {
            return this.createMessage("warning", "请选择品牌");;
        }
        if (!obj.stockUnit) {
            return this.createMessage("warning", "请选择单位");;
        }
        if (!obj.shelfLife) {
            return this.createMessage("warning", "请输入保质期");;
        }
        if (!obj.whId) {
            return this.createMessage("warning", "请选择默认仓库");;
        }
        if (!obj.taxRate) {
            return this.createMessage("warning", "请输入税率");;
        }
        if (!obj.readCheck && this.hintCode) {
            return this.createMessage("warning", "请确认商品的含税成本价和税点不一致");;
        }
        this.validateForm.value.state = state;
        this.validateForm.value.auditDesc = this.modalForm.value.auditDesc;

        this.createBasicMessage();
        if (this.validateForm.value.id == null) {
            this.warehouseGoodsAddService.save(this.validateForm.value).subscribe((res: any) => {
                this.removeBasicMessage();
                if (res.code != 0) {
                    this.createMessage("error", res.message);
                    return;
                }
                this.createMessage("success", "添加成功");
                this.router.navigate(['stock/warehouseGoods']);
            }, err => {
                this.removeBasicMessage();
                this.createMessage("error", err.message);
            })
        } else {
            this.warehouseGoodsAddService.update(this.validateForm.value).subscribe((res: any) => {
                this.removeBasicMessage();
                if (res.code != 0) {
                    this.createMessage("error", res.message);
                    return;
                }
                this.createMessage("success", "保存成功");
                this.router.navigate(['stock/warehouseGoods']);
            }, err => {
                this.removeBasicMessage();
                this.createMessage("error", err.message);
            })
        }
    }
    /**
     * 审核保存
     */
    auditSave(state: any) {
        if (this.messageId != null) {
            return;
        }
        let obj = this.validateForm.value;
        obj.state = state;
        obj.auditDesc = this.modalForm.value.auditDesc;
        this.createBasicMessage();
        this.warehouseGoodsAddService.update(this.validateForm.value).subscribe((res: any) => {
            this.removeBasicMessage();
            if (res.code != 0) {
                this.createMessage("error", res.message);
                return;
            }
            this.createMessage("success", "审核成功");
            this.router.navigate(['stock/warehouseGoods']);
        }, err => {
            this.removeBasicMessage();
            this.createMessage("error", err.message);
        })
    }
    /**
     * 打开模态框
     */
    showModal() {
        this.isVisible = true;
    }
    /**
     * 关闭模态框
     */
    handleCancel() {
        this.isVisible = false;
    }
    /**
     * 商品分类下拉
     */
    getGoodsTypeList() {
        this.warehouseGoodsAddService.getGoodsTypeList().subscribe((res: any) => {
            if (res.code != 0) {
                this.createMessage("error", res.message);
                return;
            }
            this.GoodsTypeList = res.data;
        }, err => {
        })
    }
    /**
     * 商品 品牌下拉
     */
    getBrandList() {
        this.warehouseGoodsAddService.getBrandList().subscribe((res: any) => {
            if (res.code != 0) {
                this.createMessage("error", res.message);
                return;
            }
            this.BrandList = res.data;
        }, err => {

        })
    }
    /**
     * 文件上传完成回调
     * @param files 
     * @param type  1:图片信息 2:视频文件 3:视频封面
     */
    handleFileInput(files: any, type: any) {
        let fileArr = files.target.files;
        console.log(files.target.files);
        for (let index = 0; index < fileArr.length; index++) {
            const element = fileArr[index];
            this.postFile(element, (res: any) => {
                if (res.code != 0) {
                    return;
                }
                // 只获取文件名加后缀
                let url =  res.data.substr(res.data.lastIndexOf('/')+1);
                // 上传类型
                if (type == 1) {
                    this.validateForm.get('img')!.setValue(res.data);
                } else if (type == 2) {
                    this.validateForm.get('spareImg')!.setValue(res.data);
                } else if (type == 3) {
                    this.validateForm.get('enclosure')!.setValue(res.data);
                }
            });
        }
    }
    /**
     * 删除文件
     * @param type 1:图片 2:备用图片 3:附件
     */
    deleteVideoImg(type: any) {
        if (type == 1) {
            this.validateForm.get('img')!.setValue('');
        } else if (type == 2) {
            this.validateForm.get('spareImg')!.setValue('');
        } else if (type == 3) {
            this.validateForm.get('enclosure')!.setValue('');
        }
    }

    /**
     * 仓库管理列表
     */
    getWhPutList() {
        this.warehouseGoodsAddService.getWhPutList().subscribe(res => {
            this.WhPutList = res.data.records.filter(function (item: any) { return item.state == 1; })
        }, error => {

        });
    }
    /**
     * 上传文件
     * @param su 上传完成回调函数
     */
    postFile(file: any, su: any) {
        this.warehouseGoodsAddService.postFile(file).subscribe(data => {
            if (su) su(data);
        }, error => {

        });
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
