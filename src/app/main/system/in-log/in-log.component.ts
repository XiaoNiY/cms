import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { InLogService } from './in-log.service';
@Component({
    selector: 'app-in-log',
    templateUrl: './in-log.component.html',
    styleUrls: ['./in-log.component.scss']
})
export class InLogComponent implements OnInit {
    /**
     * 模态框表单
     */
    modalForm!: FormGroup;
    /*
    * 模态框新建 or 保存 加载中状态
    */
    modalLoading = false;
    /**
     * 模态框显示 or 隐藏
     */
    isVisible = false;
    /**
     * 查询load动画
     */
    isLoadingOne = false;
    /**
     * 是否全选
     */
    checked = false;
    /**
     * 列表查询条件
     */
    queryForm: any = {
        // 姓名
        realName: '',
        // 多少页，默认1
        page: '1',
        // 每页多少条，默认10
        pageSize: '10'
    }
    /**
     * 当前是否在搜索
     */
    searchHint = false;
    /**
     * 表格是否加载中
     */
    tableLoading: any = false;
    /**
     * 当前搜索name
     */
     searchName = "";
    /**
     * 列表数据源
     */
    listOfData?: any;
    constructor(
        private fb: FormBuilder,
        private inLogService: InLogService,
    ) { }

    ngOnInit(): void {
        this.getInLogList();
        this.modalForm = this.fb.group({
            id: [null],
            // 当前分类
            name: [null],
            icon: [null],
            // 第三方链接
            url: [null],
            // 上一分类
            pid: ['0'],
            // 分类方式
            type: ['0'],
            // 排序
            sort: [null],
            // 状态
            status: ['1'],
        });
    }
    /**
     * 查询
     */
    query(): void {
        this.isLoadingOne = true;
        if (this.queryForm.realName != "") {
            this.searchHint = true;
        } else {
            this.searchHint = false;
        }
        this.queryForm.page = 1;
        this.getInLogList();
    }
    /**
     * 搜索返回原列表
     */
    backList() {
      this.queryForm.realName = "";
      this.queryForm.page = 1;
      this.searchHint = false;
      this.getInLogList();
    }
    /**
     * 刷新列表
     */
    refresh() {
      this.listOfData = [];
      this.getInLogList();
    }
    /**
     * item单选
     * @param id 
     * @param checked 
     */
    onItemChecked(id: number, checked: boolean): void {
    }
    /**
     * 全选
     * @param value 
     */
    onAllChecked(value: boolean): void {
    }
    /**
     * 判断item是否全部选择
     */
    updataCheckAll() {
    }
    /**
     * 页码改变
     * @param index 
     */
    onPageIndexChange(index: number) {
        console.log(index);
        this.queryForm.page = index;
        this.getInLogList();
    }
    /**
     * 每页条数改变的回调
     * @param index 
     */
    onPageSizeChange(index: number) {
        console.log(index);
        this.queryForm.pageSize = index;
        this.getInLogList();
    }

    /**
     * 获取登录日志列表
     * @param id 
     */
    getInLogList() {
        if (this.tableLoading) { return; }
        this.tableLoading = true;
        this.inLogService.getInLogList(this.queryForm).subscribe(
            (res: any) => {
                this.listOfData = res.data;

                this.searchName = this.queryForm.realName;
                this.isLoadingOne = true;
                this.tableLoading = false;
            }, err => {
                this.isLoadingOne = false;
                this.tableLoading = false;
            }
        )
    }
}
