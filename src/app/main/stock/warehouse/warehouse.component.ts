import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { NzMessageService } from 'ng-zorro-antd/message';
import { WarehouseService } from './warehouse.service';

@Component({
    selector: 'app-warehouse',
    templateUrl: './warehouse.component.html',
    styleUrls: ['./warehouse.component.scss']
})
export class WarehouseComponent implements OnInit {
    // 列表数据源
    listOfData: any | null = null;
    // 表格是否加载中
    tableLoading: any = false;
    // 查询load动画
    isLoadingOne = false;
    // 模态框新建 or 保存 加载中状态
    modalLoading = false;
    // 模态框表单
    modalForm!: FormGroup;
    // 当前是否在搜索
    searchHint = false;
    // 当前搜索name
    searchName = "";
    // 查询表格初始化
    queryForm: any = {
        name: '',
        type: '',
        // 多少页，默认1
        page: '1',
        // 每页多少条，默认10
        pageSize: '20',
    }

    isVisible: boolean = false;
    /**
     * 路由缓存恢复时
     */
    static updateCache: any = null;

    constructor(
        private fb: FormBuilder,
        private WarehouseService: WarehouseService,
        private message: NzMessageService,
    ) { }

    ngOnInit() {

        WarehouseComponent.updateCache = () => {
            this.tableLoading = false;
            this.getWarehouseList();
        }
        this.getWarehouseList();
        this.modalForm = this.fb.group({
            // ID
            id: [null],
            // 名称
            name: [null, [Validators.required]],
            // 类型
            type: [null],
            // 联系人
            contacts: [null],
            // 联系方式
            phoneNumber: [null],
            // 地址
            address: [null],
            // 状态
            state: ['1'],
        })
    }

    query(): void {
        this.isLoadingOne = true;
        if (this.queryForm.name != "" || this.queryForm.type != "") {
            this.searchHint = true;
        } else {
            this.searchHint = false;
        }

        this.getWarehouseList();
    }

    backList() {
        this.queryForm.name = "";
        this.queryForm.type = "";
        this.queryForm.page = 1;
        this.searchHint = false;
        this.getWarehouseList();
    }

    /**
     * 页码改变
     * @param index 页码数
     */
    onPageIndexChange(index: Number) {
        console.log(index);
        this.queryForm.page = index;
        this.getWarehouseList();
    }
    /**
     * 每页条数改变的回调
     * @param index 页码数
     */
    onPageSizeChange(index: Number) {
        this.queryForm.pageSize = index;
        this.getWarehouseList();
        console.log(index);
    }

    // 列表
    getWarehouseList() {
        this.tableLoading = true;
        this.WarehouseService.getList(this.queryForm).subscribe(
            (res: any) => {
                this.listOfData = res.data;
                this.tableLoading = false;
                this.searchName = this.queryForm.name;
                for (let index = 0; index < this.listOfData.records.length; index++) {
                    const element = this.listOfData.records[index];
                    element.stateText = this.state_To_text(element.state);
                }
            }, err => {
                this.tableLoading = false;
            }
        )
    }

    // 模态框
    showModal(id: any = null): void {
        this.getWarehouseList();
        this.isVisible = true;
        if (id == null) {
            return;
        }
        this.WarehouseService.getItem(id).subscribe((res: any) => {
            if (res.code != 0) {
                this.createMessage('error', res.message);
                return;
            }
            const tabData = res.data;
            try {
                this.modalForm.get('id')!.setValue(tabData.id);
                this.modalForm.get('name')!.setValue(tabData.name);
                this.modalForm.get('type')!.setValue(tabData.type + "" || '1');
                this.modalForm.get('contacts')!.setValue(tabData.contacts);
                this.modalForm.get('phoneNumber')!.setValue(tabData.phoneNumber);
                this.modalForm.get('address')!.setValue(tabData.address);
                this.modalForm.get('state')!.setValue(tabData.state + "" || '1');
            } catch (error) {

            }
        }, err => {

        })
    }
    /**
   * 模态框关闭触发
   */
    handleCancel() {
        this.isVisible = false;
        this.modalForm.reset();
        this.modalForm.get('type')!.setValue('1');
        this.modalForm.get('state')!.setValue('1');
    }

    /**
     * 新增 or 编辑 模态框提交
     */
    submitForm(): void {
        for (const i in this.modalForm.controls) {
            this.modalForm.controls[i].markAsDirty();
            this.modalForm.controls[i].updateValueAndValidity();
        }

        if (!this.modalForm.value.name) {
            return this.createMessage('warning', "请输入名称");;
        }
        this.modalLoading = true;

        if (this.modalForm.value.id == null) {
            this.WarehouseService.add(this.modalForm.value).subscribe(
                (res: any) => {
                    this.modalLoading = false;
                    if (res.code != 0) {
                        this.createMessage('error', res.message);
                        return;
                    }
                    this.createMessage('success', "添加成功");
                    this.handleCancel();
                    this.getWarehouseList();
                }, err => {
                    this.modalLoading = false;
                }
            )
        } else {
            this.WarehouseService.update(this.modalForm.value).subscribe(
                (res: any) => {
                    this.modalLoading = false;
                    if (res.code != 0) {
                        this.createMessage('error', res.message);
                        return;
                    }
                    this.createMessage('success', "修改成功");
                    this.handleCancel();
                    this.getWarehouseList();
                }, err => {
                    this.modalLoading = false;
                }
            )
        }
    }

    /**
     * 删除
     * @param id 
     */
    confirm(id: any): void {
        this.WarehouseService.del({ id: id }).subscribe(
            (res: any) => {
                if (res.code != 0) {
                    this.createMessage('error', res.message);
                    return;
                }
                this.createMessage('success', "删除成功");
                this.getWarehouseList();
            }, err => {

            }
        )
    }

    /**
     * 状态转文字
     * @param state 
    */
    state_To_text(state: any) {
        let text = "";
        switch (state) {
            case 0:
                text = "禁用";
                break;
            case 1:
                text = "启用";
                break;
        }
        return text;
    }

    /**
    * 全局展示操作反馈信息
    * @param type 其他提示类型 success:成功 error:失败 warning:警告
    */
    createMessage(type: any, str: any): void {
        this.message.create(type, str);
    }
}