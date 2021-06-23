import { Component, OnInit } from '@angular/core';


@Component({
  selector: 'app-address',
  templateUrl: './address.component.html',
  styleUrls: ['./address.component.scss']
})
export class AddressComponent implements OnInit {
  listOfData = [
    {
      abbreviation: '1',
      contacts: 'John Brown',
      phoneNumber: 32,
      area: 32,
      address: 'New York No. 1 Lake Park',
      status: 1
    },
    {
      abbreviation: '1',
      contacts: 'John Brown',
      phoneNumber: 32,
      area: 32,
      address: 'New York No. 1 Lake Park',
      status: 1
    },
    {
      abbreviation: '1',
      contacts: 'John Brown',
      phoneNumber: 32,
      area: 32,
      address: 'New York No. 1 Lake Park',
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

