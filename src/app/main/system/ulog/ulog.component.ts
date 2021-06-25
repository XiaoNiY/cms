import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { UlogService } from './ulog.service';
@Component({
  selector: 'app-ulog',
  templateUrl: './ulog.component.html',
  styleUrls: ['./ulog.component.scss']
})
export class ULogComponent implements OnInit {

  /**
   * 列表查询条件
   */
  queryForm: any = {
    // 姓名
    realName: '',
    // 当前页
    page: 1,
    // 每页数量
    pageSize: 20,
  }
  /**
   * 列表数据源
   */
  listOfData?: any;
  /**
   * 表格是否加载中
   */
  tableLoading: any = false;
  /**
  * 当前是否在搜索
  */
  searchHint = false;
  /**
   * 当前搜索name
   */
  searcName = "";
  constructor(
    private fb: FormBuilder,
    private UlogService: UlogService,
  ) { }

  ngOnInit(): void {
    this.list();
  }
  /**
   * 查询
   */
  query(): void {
    // 判断是否
    if (this.queryForm.inputVal != "") {
      this.searchHint = true;
    } else {
      this.searchHint = false;
    }
    this.queryForm.page = 1;
    this.list();
  }
  /**
   * 刷新列表
   */
  refresh() {
    this.listOfData = [];
    this.list();
  }
  /**
   * 搜索返回原列表
   */
  backList() {
    this.queryForm.realName = "";
    this.queryForm.page = 1;
    this.searchHint = false;
    this.list();
  }
  /**
   * 页码改变
   * @param index 
   */
  onPageIndexChange(index: number) {
    console.log(index);
    this.queryForm.page = index;
    this.list();
  }
  /**
   * 每页条数改变的回调
   * @param index 
   */
  onPageSizeChange(index: number) {
    console.log(index);
    this.queryForm.pageSize = index;
    this.list();
  }
  /**
   * 查询列表
   */
  list() {
    if (this.tableLoading) { return; }
    this.tableLoading = true;
    this.UlogService.list(this.queryForm).subscribe((res: any) => {
      this.searcName = this.queryForm.realName;
      this.listOfData = res.data;
      this.tableLoading = false;
    }, err => {
      this.tableLoading = false;
    });
  }
}
