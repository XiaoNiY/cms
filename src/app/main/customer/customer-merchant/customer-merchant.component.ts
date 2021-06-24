import { Component, OnInit } from '@angular/core';

@Component({
  selector: 'app-customer-merchant',
  templateUrl: './customer-merchant.component.html',
  styleUrls: ['./customer-merchant.component.scss']
})
export class CustomerMerchantComponent implements OnInit {
  listOfData = [
    {
      id: 1,
      nickname: '1',
      phone: 32,
      storeName: 1,
      temUserTypeText: 32,
      userType: '3',
      statusText: 1, 
      lastLoginTime: 1, 
      regTime: 1, 
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

  copy() {

  }
}
