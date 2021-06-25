import { Component, OnInit } from '@angular/core';
import { RecycleBrandService } from './recycle-brand.service';

@Component({
    selector: 'app-recycle-brand',
    templateUrl: './recycle-brand.component.html',
    styleUrls: ['./recycle-brand.component.scss']
})
export class RecycleBrandComponent implements OnInit {

    //列表源数据
    listOfData?: any;
    // 当前是否在搜索
    searchHint = false;
    // 当前搜索name
    searchName = "";
    /**
     * 表格按钮的加载
     */
    tableLoading: boolean = false;
    queryForm: any = {
        // 品牌名称
        name: '',
        // 类型 1：手机 2：平板
        type: '',
        // 每页多少条
        pageSize: 20,
        // 第几页
        pageNum: 1
    }
    constructor(
        private recycleBrandService: RecycleBrandService,
    ) { }

    ngOnInit() {
        this.getBrandList();
    }
    query() {
        if (this.queryForm.name != "" || this.queryForm.type != "") {
            this.searchHint = true;
        } else {
            this.searchHint = false;
        }

        this.getBrandList();
    }

    /**
     * 类型
     */
     type_to_text(type: any) {
        let text = "";
        switch (type) {
            case 1:
                text = "手机";
                break;
            case 2:
                text = "平板";
                break;
            case 3:
                text = "笔记本";
                break;
            case 4:
                text = "其他";
                break;
            default:
                text = "-";
                break;
        }
        return text;
    }

    /**
     * 返回搜索列表
     */
    backList() {
        this.queryForm.name = "";
        this.queryForm.type = "";
        this.queryForm.pageNum = 1;
        this.searchHint = false;
        this.getBrandList();
    }

    /**
     * 重置
     */
    reset() {
        this.queryForm.name = "";
        this.queryForm.type = "";
        this.queryForm.pageNum = 1;
        this.searchHint = false;
        this.getBrandList();
    }

    getBrandList() {
        this.recycleBrandService.getList(this.queryForm).subscribe((res: any) => {
            this.listOfData = res.data;
            this.searchName = this.queryForm.name;
            this.tableLoading = false;
        }, error => {
            this.tableLoading = false;
        })
    }
    /**
     * 页码改变
     * @param index 页码数
     */
    onPageIndexChange(index: number) {
        console.log(index);
        this.queryForm.pageNum = index;
        this.getBrandList();
    }
    /**
     * 每页条数改变的回调
     * @param index 页码数
     */
    onPageSizeChange(index: number) {
        console.log(index);
        this.queryForm.pageSize = index;
        this.getBrandList();
    }
}
