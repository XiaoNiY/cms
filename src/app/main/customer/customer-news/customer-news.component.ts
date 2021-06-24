import { Component, OnInit } from '@angular/core';

@Component({
  selector: 'app-customer-news',
  templateUrl: './customer-news.component.html',
  styleUrls: ['./customer-news.component.scss']
})
export class CustomerNewsComponent implements OnInit {

  isVisible: boolean = false;
  constructor() { }

  ngOnInit() {
  }

  onPageIndexChange(index: number) {
    console.log(index);
  }

  onPageSizeChange(index: number) {
    console.log(index);
  }

  detailsModal() {
    this.isVisible = true;
  }

  handleCancel() {
    this.isVisible = false;
  }
}
