import { Component, OnInit } from '@angular/core';

@Component({
  selector: 'app-customer-browse',
  templateUrl: './customer-browse.component.html',
  styleUrls: ['./customer-browse.component.scss']
})
export class CustomerBrowseComponent implements OnInit {

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
