import { Component, OnInit } from '@angular/core';

@Component({
  selector: 'app-goods-all',
  templateUrl: './goods-all.component.html',
  styleUrls: ['./goods-all.component.scss']
})
export class GoodsAllComponent implements OnInit {
  listOfData = [
    {
      id: 1,
      brandName: '1',
      typeName: 'John Brown',
      shopPriceB: 32,
      shopPriceC: 32,
      salesVolume: 'New York No. 1 Lake Park',
      stockNum: 1,
      frozenStockNum: 1, 
      skuGroupName: 1, 
      createTime: 1, 
      status: 1,
    },
    {
      id: 1,
      brandName: '1',
      typeName: 'John Brown',
      shopPriceB: 32,
      shopPriceC: 32,
      salesVolume: 'New York No. 1 Lake Park',
      stockNum: 1,
      frozenStockNum: 1, 
      skuGroupName: 1, 
      createTime: 1,
      status: 1,
    }
  ];

  isVisible: boolean = false;

  checked: boolean = false;
  loading: boolean = false;
  constructor() { }

  ngOnInit(): void {
  }

  query() {

  }

  onPageIndexChange(index: number) {
    console.log(index);
  }

  onPageSizeChange(index: number) {
    console.log(index);
  }


  updateCheckedSet(id: number, checked: boolean): void {
  }


  // id: number, checked: boolean
  onItemChecked(): void {
    // this.updateCheckedSet(id, checked);
  }

  onAllChecked(checked: boolean): void {
  }

  sendRequest(): void {
    this.loading = true;
  }

}
