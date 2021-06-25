import { Component, OnInit } from '@angular/core';
import { NzMessageService } from 'ng-zorro-antd/message';
import { CustomerStoreService } from './customer-store.service';

@Component({
    selector: 'app-customer-store',
    templateUrl: './customer-store.component.html',
    styleUrls: ['./customer-store.component.scss']
})
export class CustomerStoreComponent implements OnInit {
    /**
     * 数据源
     */
    listOfData?: any;
    /**
     * 表格内的加载
     */
    tableLoading: any = false;
    /**
     * 查询load动画
     */
    isLoadingOne = false;
    /**
     * 当前是否在搜索
     */
    searchHint = false;
    /**
     * 当前搜索name
     */
    searchName = "";
    /**
     * 全局 loading
     */
    messageId: any = null;
    queryForm: any = {
        // 用户
        user: '',
        // 门店状态
        status: '',
        // 门店名称
        storeName: '',
        // id，查询详情时传，列表不传
        id: '',
        //0 表示userId查询 1表示id查询
        type: '0',
        page: '1',
        pageSize: '20',
        beginTime: '',
        endTime: '',
        dateFormat: '',
    }
    /**
     * 路由缓存恢复时
     */
    static updateCache: any = null;
    constructor(
        private message: NzMessageService,
        private customerStoreService: CustomerStoreService,
    ) { }

    ngOnInit() {
        CustomerStoreComponent.updateCache = () => {
            this.tableLoading = false;
            this.getStoreList();
        }
        this.getStoreList();
    }
    /**
     * 刷新列表
     */
    refresh() {
        this.listOfData = [];
        this.getStoreList();
    }

    query() {
        if (this.queryForm.storeName != "" || this.queryForm.user != "" || this.queryForm.status != "" || this.queryForm.dateFormat != "") {
            this.searchHint = true;
        } else {
            this.searchHint = false;
        }

        this.getStoreList();
    }

    backList() {
        this.queryForm.user = "";
        this.queryForm.status = "";
        this.queryForm.storeName = "";
        this.queryForm.dateFormat = "";
        this.queryForm.page = 1;
        this.searchHint = false;
        this.getStoreList();
    }

    getStoreList() {
        if (this.tableLoading) { return; }
        this.listOfData = [];
        this.tableLoading = true;
        this.customerStoreService.getList(this.queryForm).subscribe((res: any) => {
            if (res.code != 0) {
                this.createMessage("error", res.message);
                return;
            }
            let textArr = [];
            if (this.queryForm.storeName) {
                textArr.push(this.queryForm.storeName);
            }
            if (this.queryForm.user) {
                textArr.push(this.queryForm.user);
            }
            if (this.queryForm.status) {
                textArr.push(this.status_to_text(this.queryForm.status));
            }
            if (this.queryForm.dateFormat) {
                
                let strTime =  this.customerStoreService.shiftDate(this.queryForm.dateFormat[0]) ;
                let endTime =  this.customerStoreService.shiftDate(this.queryForm.dateFormat[1]) ;
                let time = strTime + " - " + endTime;
                textArr.push(time);
            }
            this.searchName = textArr.join(' | ');

            this.listOfData = res.data;
            this.tableLoading = false;
        }, err => {
            this.tableLoading = false;
            this.createMessage("error", err.message);
        })
    }
    /**
     * 状态转换颜色
     */
    getStatusColor(s: any) {
      let colorText = "";
      switch (parseInt(s)) {
        // 绿色
        case 3: case 20: 
          colorText = "font1"
          break;
        // 橙色
        case 1: case 2: 
          colorText = "font0"
          break;
        // 红色
        case 4: case 10:
          colorText = "font2"
          break;
  
      }
      return colorText;
    }

    status_to_text(status: any) {
        let text = "";
        switch (parseInt(status)) {
            case 1:
                text = "待完善";
                break;
            case 2:
                text = "待审核";
                break;
            case 3:
                text = "审核通过";
                break;
            case 4:
                text = "审核不通过";
                break;
            case 10:
                text = "暂不认证";
                break;
            case 20:
                text = "审核通过（已读）";
                break;
            default:
                text = "-";
                break;
        }
        return text;
    }

    /**
     * 页数
     * @param index 
     */
    onPageIndexChange(index: number) {
        console.log(index);
        this.queryForm.page = index;
        this.getStoreList();
    }

    /**
     * 页码数
     * @param index 
     */
    onPageSizeChange(index: number) {
        console.log(index);
        this.queryForm.pageSize = index;
        this.getStoreList();
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
