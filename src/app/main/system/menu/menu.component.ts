import { Component, OnInit } from '@angular/core';
import { NzMessageService } from 'ng-zorro-antd/message';
import { MenuService } from './menu.service';



@Component({
  selector: 'app-menu',
  templateUrl: './menu.component.html',
  styleUrls: ['./menu.component.scss']
})
export class MenuComponent implements OnInit {
  listOfData?:any;

  messageId: string = "";
  constructor(
    private MenuService: MenuService,
    private message: NzMessageService
  ) { }

  ngOnInit(): void {
    this.getMenuList();
  }

  getMenuList() {
    this.MenuService.menuList({name: ''}).subscribe((res: any) => {
      this.listOfData = res.data;
      this.createMessage('error', res.msg);
    }, err => {

    })
  }

   /**
   * 提示信息
   * @param type 
   * @param message warning警告 error错误 success成功
   */
    createMessage(type: string, message: string): void {
      this.message.create(type, message);
    }
  
    /**
     * 进行全局 loading
     */
    createBasicMessage(): void {
      this.messageId = this.message.loading('正在加载中...', { nzDuration: 0 }).messageId;
    }
  
    /**
     * 移除loading
     */
    removeBasicMessage(): void {
      this.message.remove(this.messageId);
      this.messageId = "";
    }
}
