import { ChangeDetectorRef, Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { ActivatedRoute, Router } from '@angular/router';
import { NzMessageService } from 'ng-zorro-antd/message';
import { createNonNullExpression } from 'typescript';
import { SqeAddService } from './sqe-add.service';

import { ConfigDictListService } from '../../config/config-dict-list/config-dict-list.service';
@Component({
    selector: 'app-sqe-add',
    templateUrl: './sqe-add.component.html',
    styleUrls: ['./sqe-add.component.scss']
})
export class SqeAddComponent implements OnInit {
    id: any;
    /**
     * 供应商详情数据(公共)
     */
    detailsData: any = null;
    /**
     * 模态框表单
     */
    validateForm!: FormGroup;
    /**
     * 保存 加载中状态
    */
    isLoading = false;
    /**
     * 合同文件
     */
    fileList: any[] = [];
    /**
     * 附件
     */
    fileList2: any[] = [];
    /**
     * 合同生效日期
     */
    createTime: any = null;
    /**
     * 合同失效日期
     */
    time: any = null;
    /**
     * 供应商类型
     */
    supplier_type: any = [];
    /**
     * 供应商结算方式
     */
    supplier_settlement_type: any = [];

    state: any = "0";
    /**
     * 草稿
     */
    draft: any = false;
    /**
     * 正常
     */
    normal: any = true;
    /**
     * 冻结
     */
    frozen: any = true;
    /**
     * 合作结束
     */
    endOfCooperation: any = true;
    /**
     * 合同过期
     */
    contractExpired: any = true;
    constructor(
        private ConfigDictListService: ConfigDictListService,
        private router: Router,
        private fb: FormBuilder,
        private sqeAddService: SqeAddService,
        private activatedRoute: ActivatedRoute,
        private message: NzMessageService,
    ) { }

    ngOnInit() {
        // 获取字典的 供应商类型
        this.ConfigDictListService.getDictList({
            // 名称或者编码搜索
            parentKey: "supplier_type",
            // 多少页，默认1
            pageNum: 1,
            // 每页多少条，默认10
            pageSize: 999
        }).subscribe((res: any) => {
            for (const key in res.data.list.records) {
                const element = res.data.list.records[key];
                this.supplier_type.push({
                    label: element.name,
                    value: element.content
                });
            }
            console.log(res);
        }, err => {
        });

        // 获取字典的 供应商结算方式
        this.ConfigDictListService.getDictList({
            // 名称或者编码搜索
            parentKey: "supplier_settlement_type",
            // 多少页，默认1
            pageNum: 1,
            // 每页多少条，默认10
            pageSize: 999
        }).subscribe((res: any) => {
            for (const key in res.data.list.records) {
                const element = res.data.list.records[key];
                this.supplier_settlement_type.push({
                    label: element.name,
                    value: element.content
                });
            }
            console.log(res);
        }, err => {
        });


        this.validateForm = this.fb.group({
            // id
            id: [null],
            // 简称
            abbreviation: [null],
            // 全称
            name: [null],
            //类型
            type: [null],
            // 状态
            state: [null],
            // 联系人
            contacts: [null],
            // 联系方式
            phoneNumber: [null],
            // 入库单备注
            remark: [null],
            // 合同文件
            contractFile: [null],
            // 合同生效日期
            createTime: [null],
            // 合同失效日期
            endTime: [null],
            // 合同附件 
            contractEnclosure: [null],
            // 结算方式
            settlementType: [null],
            // 公司名称 
            companyName: [null],
            // 税号
            tax: [null],
            // 单位地址
            address: [null],
            // 电话
            telephone: [null],
            // 开户行
            bank: [null],
            // 银行账号
            bankAccount: [null],
        })

        this.activatedRoute.params.subscribe(params => {
            this.id = params.id;
            if (this.id != 0) {
                this.getDetails();
            }
        })
    }

    /**
     * 初始化数据
     */
    initData(obj: any) {
        if (this.detailsData) {
            this.validateForm.get('id')!.setValue(obj.id);
            this.validateForm.get('abbreviation')!.setValue(obj.abbreviation);
            this.validateForm.get('name')!.setValue(obj.name);
            this.validateForm.get('type')!.setValue(obj.type + "");
            this.validateForm.get('state')!.setValue(obj.state + "");
            this.validateForm.get('contacts')!.setValue(obj.contacts);
            this.validateForm.get('phoneNumber')!.setValue(obj.phoneNumber);
            this.validateForm.get('remark')!.setValue(obj.remark);
            this.validateForm.get('contractFile')!.setValue(obj.contractFile);
            this.validateForm.get('createTime')!.setValue(obj.createTime);
            this.validateForm.get('endTime')!.setValue(obj.endTime);
            this.validateForm.get('contractEnclosure')!.setValue(obj.contractEnclosure);
            this.validateForm.get('settlementType')!.setValue(obj.settlementType + "");
            this.validateForm.get('companyName')!.setValue(obj.companyName);
            this.validateForm.get('tax')!.setValue(obj.tax);
            this.validateForm.get('address')!.setValue(obj.address);
            this.validateForm.get('telephone')!.setValue(obj.telephone);
            this.validateForm.get('bank')!.setValue(obj.bank);
            this.validateForm.get('bankAccount')!.setValue(obj.bankAccount);

            // this.fileList2 = obj.contractEnclosure.split(',');

            if (obj.contractFile) {
                this.fileList = obj.contractFile.split(',').map((item: any) => {
                    return {
                        url: item,
                        id: item,
                        name: (item.match(/[^\\/]+\.[^\\/]+$/) || []).pop(),
                        status: 'done',
                    }
                })
            }
            if (obj.contractEnclosure) {
                this.fileList2 = obj.contractEnclosure.split(',').map((item: any) => {
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

    /**
     * 详情
     */
    getDetails() {
        this.sqeAddService.details(this.id).subscribe((res: any) => {
            this.detailsData = res.data;
            this.initData(res.data);
            this.isLoading = false;

            if (this.fileList.length > 0) {
                // 草稿
                this.normal = false;
                // 正常
                this.frozen = false;
                // 合作结束
                this.endOfCooperation = false;
                // 合同过期
                this.contractExpired = false;
            }
        }, err => {
            this.isLoading = false;
        })
    }

    submitForm(): void {
        if (!this.validateForm.value.abbreviation) {
            return this.createMessage('warning', '请输入简称');
        } else if (!this.validateForm.value.type) {
            return this.createMessage('warning', '请输入类型');
        } else if (!this.validateForm.value.state) {
            return this.createMessage('warning', '请输入状态');
        }
        for (const i in this.validateForm.controls) {
            this.validateForm.controls[i].markAsDirty();
            this.validateForm.controls[i].updateValueAndValidity();
        }

        // 合同文件
        const contractFileList = [];
        console.log(this.fileList)
        for (let index = 0; index < this.fileList.length; index++) {
            contractFileList.push(this.fileList[index].url);
        }
        this.validateForm.value.contractFile = contractFileList.toString();

        if (this.fileList.length > 0) {
            if (!this.createTime) {
                return this.createMessage('warning', '合同生效日期');
            }
            if (!this.time) {
                return this.createMessage('warning', '请输入合同失效日期');
            }
        }
        if(this.createTime || this.time) {
            if (!(this.fileList.length > 0)) {
                return this.createMessage('warning', '请输入上传合同');
            }
        }

        // 附件
        const contractEnclosureList = [];
        console.log(this.fileList2)
        for (let index = 0; index < this.fileList2.length; index++) {
            contractEnclosureList.push(this.fileList2[index].url);
        }
        this.validateForm.value.contractEnclosure = contractEnclosureList.toString();

        if (this.validateForm.value.id == null) {
            this.sqeAddService.add(this.validateForm.value).subscribe((res: any) => {
                this.isLoading = false;
                if (res.code != 0) {
                    this.createMessage('error', res.message);
                    return;
                }
                this.createMessage('success', '添加成功');
                this.router.navigate(['stock/sqe']);
            }, err => {
                this.isLoading = false;
            })
        } else {
            this.sqeAddService.update(this.validateForm.value).subscribe((res: any) => {
                this.isLoading = false;
                if (res.code != 0) {
                    this.createMessage('error', res.message);
                    return;
                }
                this.createMessage('success', '修改成功');
                this.router.navigate(['stock/sqe'])
            }, err => {
                this.createMessage('error', '请求出错');
                this.isLoading = false;
            })
        }
    }

    /**
     * 合同文件
     * @param file 
     * @returns 
     */
    beforeUpload = (file: any): boolean => {
        this.fileList = this.fileList.concat(file);
        this.validateForm.get('contractFile')!.setValue(this.fileList[0].name);
        return false;
    }
    /**
     * 上传图片
     * @param e 
     */
    onUpload(e: MouseEvent): void {
        e.preventDefault();
    }

    /**
     * 文件上传完成回调
     * @param files 
     * @param type  
     */
    handleFileInput(files: any, type: any) {
        let fileArr = files.target.files;
        if (type == 1 && this.fileList.length == 1) {
            // 此处也需要清空，不然第二次无法上传相同的问题件
            files.target.value = "";
            this.createMessage('warning', '仅允许上传一个文件');
            return;
        }
        for (let index = 0; index < fileArr.length; index++) {
            const element = fileArr[index];
            this.postFile(element, (res: any) => {
                if (res.code != 0) {
                    return;
                }
                // 合同文件
                if (type == 1) {
                    this.fileList.push({
                        url: res.data,
                        id: res.data,
                        name: files.target.files[0].name,
                    })
                    // 草稿
                    this.normal = false;
                    // 正常
                    this.frozen = false;
                    // 合作结束
                    this.endOfCooperation = false;
                    // 合同过期
                    this.contractExpired = false;
                    files.target.value = "";
                    this.createMessage('success', '合同文件上传成功');
                } else if (type == 2) {   // 附件
                    this.fileList2.push({
                        url: res.data,
                        id: res.data,
                        name: files.target.files[index].name,
                    });
                    this.createMessage('success', '附件上传成功');
                }
            });
        }
    }

    stateInfo() {
        if (this.fileList.length > 0) {
            return "";
        }
        return "请先选择合同文件才可以改变状态";
    }

    /**
     * 上传文件
     * @param su 上传完成回调函数
     */
    postFile(file: any, su: any) {
        this.sqeAddService.postFile(file).subscribe(data => {
            if (su) su(data);
        }, error => {

        });
    }
    fileDown(url: any) {
        window.location.href = url;
    }
    deleteFile(id: any) {
        for (let i = 0; i < this.fileList2.length; i++) {
            if (this.fileList2[i].id == id) {
                this.fileList2.splice(i, 1);
            }
        }
    }

    contractFileDown(url: any) {
        window.location.href = url;
    }
    deleteContractFile(id: any) {
        // 草稿
        this.normal = true;
        // 正常
        this.frozen = true;
        // 合作结束
        this.endOfCooperation = true;
        // 合同过期
        this.contractExpired = true;

        this.state = "0";
        this.fileList = this.fileList.filter((d: any) => d.id !== id);
        if (this.fileList.length == 0) {
            this.validateForm.value.state = 0;
            this.createTime = null;
            this.time = null;
            this.createMessage('warning', '无合同文件的情况下，状态已变回草稿');
        }

    }

    // onChange(e: MouseEvent): void {
    //     e.preventDefault();
    // }

    /**
    * 全局展示操作反馈信息
    * @param type 其他提示类型 success:成功 error:失败 warning:警告
    */
    createMessage(type: any, str: any): void {
        this.message.create(type, str);
    }
}

