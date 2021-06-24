import { Component, OnInit } from '@angular/core';

@Component({
  selector: 'app-customer-collection',
  templateUrl: './customer-collection.component.html',
  styleUrls: ['./customer-collection.component.scss']
})
export class CustomerCollectionComponent implements OnInit {

  constructor() { }

  ngOnInit() {
  }

  onPageIndexChange(index: number) {
    console.log(index);
  }

  onPageSizeChange(index: number) {
    console.log(index);
  }
}
