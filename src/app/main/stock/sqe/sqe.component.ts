import { Component, OnInit } from '@angular/core';
import { SqeService } from './sqe.service';

import { ConfigDictListService } from '../../config/config-dict-list/config-dict-list.service';
import { NzMessageService } from 'ng-zorro-antd/message';
@Component({
    selector: 'app-sqe',
    templateUrl: './sqe.component.html',
    styleUrls: ['./sqe.component.scss']
})
export class SqeComponent implements OnInit {
    // 列表数据源
    listOfData?: any;
    // 表格是否加载中
    tableLoading: any = false;
    // 查询load动画
    isLoadingOne = false;
    // 当前是否在搜索
    searchHint = false;
    // 当前搜索name
    searchName = "";
    // 查询表格初始化
    queryForm: any = {
        name: '',
        type: '',
        // 状态(0草稿、1正常、2冻结、3合作结束、4合同过期)
        state: '',
        page: '1',
        pageSize: '20',
    }
    startTime: any = null;
    endTime: any = null;
    currentTime: any = null;
    /**
     * 供应商类型
     */
    supplier_type: any = [];
    /**
     * 路由缓存恢复时
     */
    static updateCache: any = null;
    /**
     * 全局 loading
     */
    messageId: any = null;
    constructor(
        private sqeService: SqeService,
        private message: NzMessageService,
        private ConfigDictListService: ConfigDictListService,
    ) { }

    ngOnInit(): void {
        SqeComponent.updateCache = () => {
            this.tableLoading = false;
            this.getSqeList();
        }
        this.getSqeList();
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
    }

    query() {
        this.isLoadingOne = true;
        if (this.queryForm.name != "" || this.queryForm.type != "" || this.queryForm.state != "") {
            this.searchHint = true;
        } else {
            this.searchHint = false;
        }
        this.getSqeList();
    }

    backList() {
        this.queryForm.name = "";
        this.queryForm.type = "";
        this.queryForm.state = "";
        this.queryForm.page = 1;
        this.searchHint = false;
        this.getSqeList();
    }

    /**
     * 页码改变
     * @param index 页码数
     */
    onPageIndexChange(index: Number) {
        console.log(index);
        this.queryForm.page = index;
        this.getSqeList();
    }
    /**
     * 每页条数改变的回调
     * @param index 页码数
     */
    onPageSizeChange(index: Number) {
        this.queryForm.pageSize = index;
        this.getSqeList();
        console.log(index);
    }

    getSqeList() {
        this.tableLoading = true;
        this.sqeService.getList(this.queryForm).subscribe((res: any) => {
            this.listOfData = res.data;
            this.isLoadingOne = false;
            this.searchName = this.queryForm.name;
            // for (let index = 0; index < this.listOfData.records.length; index++) {
            //     const element = this.listOfData.records[index];
            //     element.stateText = this.state_To_text(element.state);
            // }

            this.tableLoading = false;
        }, err => {
            this.tableLoading = false;
        })
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
                text = "正常";
                break;
            case 2:
                text = "冻结";
                break;
            case 3:
                text = "合作结束";
                break;
            case 4:
                text = "合同过期";
                break;
        }
        return text;
    }

    /**
     * 类型转文字
     * @param state 
    */
    type_To_text(state: any) {
        let text = "";
        switch (state) {
            case 0:
                text = "配件供应商";
                break;
            case 1:
                text = "工厂";
                break;
            case 2:
                text = "整机供应商";
                break;
        }
        return text;
    }

    flagTime(time: any) {
        if (time != null) {
            this.currentTime = new Date();
            this.endTime = new Date(time);
            // let day = (this.currentTime - this.endTime) / (24 * 3600 * 1000);
            let day = (this.endTime - this.currentTime) / (24 * 3600 * 1000);

            if (day < 90) {
                return true;
            }
        }

        return false;
    }

    /**
     * 开启loading
     */
    createBasicMessage(): void {
        this.messageId = this.message.loading('正在登录...', { nzDuration: 0 }).messageId;
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
