import { Component, OnInit } from '@angular/core';

@Component({
  selector: 'app-dictionaries',
  templateUrl: './dictionaries.component.html',
  styleUrls: ['./dictionaries.component.scss']
})
export class DictionariesComponent implements OnInit {
  listOfData = [
    {
      sex: 1,
      dictKey: 1,
      parentKey: 32,
      content: 32,
      status: 1,
      optionType: 0,
      field1: 1,
      field2: 1,
      field3: 1,
      remark: '',
    },
    {
      sex: 1,
      dictKey: 1,
      parentKey: 32,
      content: 32,
      status: 1,
      optionType: 0,
      field1: 1,
      field2: 1,
      field3: 1,
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
}
