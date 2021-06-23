import { Component, OnInit } from '@angular/core';

@Component({
  selector: 'app-dictionaries-list',
  templateUrl: './dictionaries-list.component.html',
  styleUrls: ['./dictionaries-list.component.scss']
})
export class DictionariesListComponent implements OnInit {
  listOfData = [
    {
      name: 1,
      content: 32,
      dictKey: 1,
      field1: 1,
      field2: 1,
      field3: 1,
      sort: 0,
      color: 32,
      status: 1,
      remark: '',
    },
    {
      name: 1,
      content: 32,
      dictKey: 1,
      field1: 1,
      field2: 1,
      field3: 1,
      sort: 0,
      color: 32,
      status: 1,
      remark: '',
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

  confirm() {

  }
}
