import { Component, OnInit } from '@angular/core';
import { Router, ActivatedRoute, PRIMARY_OUTLET, NavigationEnd } from '@angular/router';

import { NzMessageService } from 'ng-zorro-antd/message';
import { Global } from './shared/global';

import { ConfigDictService } from './main/config/config-dict/config-dict.service';
import { filter } from 'rxjs/operators';
@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.scss'],
})
export class AppComponent implements OnInit{
  constructor(
    private message: NzMessageService,
    private router: Router,
    private ConfigDictService: ConfigDictService
  ) { }

  ngOnInit(): void {
    // 订阅NavigationEnd事件
    // this.router.events.pipe(filter(event => event instanceof NavigationEnd))
    //   .subscribe((event:any) => {
    //     console.log(event);
    //     if(Global.UP == null && event.url != "/login"){
    //       this.createMessage("warning", "请登录");
    //       this.router.navigate(["login"]);
    //     }
    //     console.log(1);
    //   });
    // this.getDictList();
  }
  /**
   * 获取字典列表
   */
  getDictList() {
    this.ConfigDictService.getDictList({name: "",pageNum: 1,pageSize: 99}).subscribe((res: any) => {
      Global.dictData = res.data.list;
    }, err => {
    });
  }
  /**
   * 全局展示操作反馈信息
   * @param type 其他提示类型 success:成功 error:失败 warning：警告
   */
  createMessage(type: any, str: any): void {
    this.message.create(type, str);
  }
}
