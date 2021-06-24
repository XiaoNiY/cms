import { Component, OnInit } from '@angular/core';

@Component({
  selector: 'app-goods-brand',
  templateUrl: './goods-brand.component.html',
  styleUrls: ['./goods-brand.component.scss']
})
export class GoodsBrandComponent implements OnInit {
  listOfData = [
    {
      name: '1',
      nameEn: 'John Brown',
      code: 32,
      sort: 32,
      createTime: 'New York No. 1 Lake Park',
      status: 1
    },
    {
      name: '1',
      nameEn: 'John Brown',
      code: 32,
      sort: 32,
      createTime: 'New York No. 1 Lake Park',
      status: 1
    }
  ];

  isVisible: boolean = false;
  constructor() { }

  ngOnInit(): void {
  }

  query() {

  }

  showAddressModal() {
    this.isVisible = true;
  }

  handleCancel() {
    this.isVisible = false;
  }

  onPageIndexChange(index: number) {
    console.log(index);
  }

  onPageSizeChange(index: number) {
    console.log(index);
  }

}
