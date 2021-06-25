import { Component, OnInit } from '@angular/core';

@Component({
  selector: 'app-order-parts',
  templateUrl: './order-parts.component.html',
  styleUrls: ['./order-parts.component.scss']
})
export class OrderPartsComponent implements OnInit {

  listOfData = [
    {
      id: 1,
      brandName: '1',
      typeName: '2',
      shopPriceB: 32,
      shopPriceC: 32,
      salesVolume: '3',
      stockNum: 1,
      frozenStockNum: 1, 
      skuGroupName: 1, 
      createTime: 1, 
      status: 1,
      afterSalesState: 1,
      totalPrice: 1,
      realPrice: 1,
    }
  ];

  checked: boolean = false;
  loading: boolean = false;

  constructor() { }

  ngOnInit(): void {
  }

  onPageIndexChange(index: number) {
    console.log(index);
  }

  onPageSizeChange(index: number) {
    console.log(index);
  }


  /**
   * item单选
   * @param id 
   * @param checked 
   */
   onItemChecked(id: number, checked: boolean): void {
    console.log("id:" + id + ",checked:" + checked);
    // const index = this.listOfData.records.findIndex((item: { id: number; }) => item.id === id);
    // this.listOfData.records[index].Checked = checked;
    this.updataCheckAll();
  }
  /**
   * 全选
   * @param value 
   */
  onAllChecked(value: boolean): void {
    // this.listOfData.records.forEach((item: { Checked: boolean; }) => item.Checked = value);
    console.log(value);
  }
  /**
   * 判断item是否全部选择
   */
  updataCheckAll() {
    // const index = this.listOfData.records.findIndex((item: { Checked: boolean; }) => item.Checked == false);
    // console.log(index);

    // if (index != -1) {
    //   this.checked = false;
    // } else {
    //   this.checked = true;
    // }
  }
  /**
   * 全部删除
   */
  onAllDel() {
    // var outMealServicelist = this.listOfData.records.filter(function (item: { Checked: boolean; }) { return item.Checked == true; });
    // for (let index = 0; index < outMealServicelist.length; index++) {
    //   const element = outMealServicelist[index];
    // }
  }
}
