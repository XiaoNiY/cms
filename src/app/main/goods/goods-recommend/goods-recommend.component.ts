import { Component, OnInit } from '@angular/core';
import { NzMessageService } from 'ng-zorro-antd/message';

@Component({
  selector: 'app-goods-recommend',
  templateUrl: './goods-recommend.component.html',
  styleUrls: ['./goods-recommend.component.scss']
})
export class GoodsRecommendComponent implements OnInit {
  listOfData = [
    {
      id: 1,
      code: 2,
      goodsType: 3,
      name: 4,
      shortName: 5,
      icon: 6,
      userType: 7,
      stockNum: 8,
      labelColor: 9,
      labelText: 10,
    }
  ]
  listOfData1=[
    {
      code: 2,
      name: 4,
      typeName:6,
      brandName:8,
      userType: 10
    }
  ]

  messageId: string = "";

  isVisible: boolean = false;
  constructor(
    private message: NzMessageService
  ) { }

  ngOnInit(): void {
  }

  showModal() {
    this.isVisible = true;
  }
  handleCancel() {
    this.isVisible = false;
  }

  /**
     * 页码改变
     * @param index 
     */
   onPageIndexChange(index: number) {
    console.log(index);
}

/**
 * 每页条数改变的回调
 * @param index 
 */
onPageSizeChange(index: number) {
    console.log(index);
}

/**
* 开启loading
*/
createBasicMessage(): void {
    this.messageId = this.message.loading('正在请求...', { nzDuration: 0 }).messageId;
}
/**
 * 移除loading
 */
removeBasicMessage() {
    this.message.remove(this.messageId);
    this.messageId = "";
}
/**
 * 全局展示操作反馈信息
 * @param type 其他提示类型 success:成功 error:失败 warning：警告
 */
createMessage(type: any, str: any): void {
    this.message.create(type, str);
}
}
