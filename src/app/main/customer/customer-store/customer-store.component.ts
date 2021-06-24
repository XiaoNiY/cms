import { Component, OnInit } from '@angular/core';

@Component({
  selector: 'app-customer-store',
  templateUrl: './customer-store.component.html',
  styleUrls: ['./customer-store.component.scss']
})
export class CustomerStoreComponent implements OnInit {
  listOfData = [
    {
      id: 1,
      nickname: '1',
      storeName: 1,
      status: 32,
      businessArea: '3',
      createTime: 1, 
    },
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

}
