import { Component, OnInit, Output, EventEmitter,  Input } from '@angular/core';
import {  Router } from '@angular/router';

import { HomeComponent } from '../../main/home/home.component';
@Component({
  selector: 'app-bt-group',
  templateUrl: './bt-group.component.html',
  styleUrls: ['./bt-group.component.scss']
})
export class BtGroupComponent implements OnInit {
  // 定位到热门评论
  @Output() btClick = new EventEmitter();

  // 按钮类型
  @Input() btType: any = 'default';
  // 按钮类文字
  @Input() btText: any = "按钮";
  // 是否可点击
  @Input() btDisabled: boolean = false;

  constructor(
    private router: Router,
    private homeComponent: HomeComponent
  ) { }

  ngOnInit(): void {
  }
  /**
   * 按钮触发
   */
  submit() {
    this.btClick.emit();
  }
  /**
   * 返回上一页
   */
  back() {
    this.router.navigate([this.homeComponent.breadcrumbs.backPath]);
  }

}
