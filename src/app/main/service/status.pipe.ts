import { Pipe, PipeTransform } from '@angular/core';

/**
 * 售后方式转换文字
 */
@Pipe({ name: 'saleTypeStatus' })
export class saleTypeStatusPipe implements PipeTransform {
    transform(value: Number, exponent?: number): String {
        let str: String = "";
        switch (value) {
            case 1:
                str = "退货退款";
                break;
            case 2:
                str = "换货";
                break;
            case 3:
                str = "取消订单";
                break;
            case 4:
                str = "退款";
                break;
            case 5:
                str = "补货";
                break;
            default:
                str = "-";
                break;
        }
        return str;
    }
}
/**
 * 售后状态转换文字
 */
@Pipe({
    name: 'saleStatus',
    pure: false
})
export class saleStatusPipe extends saleTypeStatusPipe {
    transform(value: Number, exponent?: number): String {
        let str: String = "";
        switch (value) {
          case 0:
            str = "用户提交申请（待审核）";
            break;
          case 1:
            str = "审核通过（待买家退货）";
            break;
          case 2:
            str = "退货超时";
            break;
          case 3:
            str = "商品已寄出";
            break;
          case 4:
            str = "待平台审核";
            break;
          case 6:
            str = "售后成功";
            break;
          case 7:
            str = "售后失败";
            break;
          case 8:
            str = "已取消";
            break;
          default:
            str = "-";
            break;
        }
        return str;
    }
}
/**
 * 售后退款状态转换文字
 */
@Pipe({
    name: 'saleRefundStatus',
    pure: false
})
export class saleRefundStatusPipe extends saleTypeStatusPipe {
    transform(value: Number, exponent?: number): String {
        let str: String = "";
        switch (value) {
          case 0:
            str = "未退款";
            break;
          case 1:
            str = "等待中";
            break;
          case 2:
            str = "退款成功";
            break;
          case 3:
            str = "退款失败";
            break;
          default:
            str = "-";
            break;
        }
        return str;
    }
}
/**
 * 订单类型转换文字
 */
 @Pipe({
    name: 'orderTypeStatus',
    pure: false
})
export class orderTypeStatusPipe extends saleTypeStatusPipe {
    transform(value: Number, exponent?: number): String {
        let str: String = "";
        switch (value) {
          case 1:
            str = "配件订单";
            break;
          case 2:
            str = "回收订单";
            break;
          case 3:
            str = "二手订单";
            break;
          case 4:
            str = "新机订单";
            break;
          default:
            str = "-";
            break;
        }
        return str;
    }
}
/**
 * 订单状态转换文字
 */
 @Pipe({
    name: 'orderStatus',
    pure: false
})
export class orderStatusPipe extends saleTypeStatusPipe {
    transform(value: Number, exponent?: number): String {
        let str: String = "";
        switch (value) {
          case 0:
            str = "有效";
            break;
          case 1:
            str = "无效";
            break;
          case 2:
            str = "待付款";
            break;
          case 3:
            str = "待审核";
            break;
          case 4:
            str = "审核不通过";
            break;
          case 5:
            str = "审核通过";
            break;
          case 6:
            str = "排队发货";
            break;
          case 7:
            str = "待发货";
            break;
          case 8:
            str = "待收货（已发货）";
            break;
          case 9:
            str = "交易完成";
            break;
          case 10:
            str = "支付超时";
            break;
          case 11:
            str = "客服取消";
            break;
          case 12:
            str = "客户取消";
            break;
          case 13:
            str = "售后中";
            break;
          case 14:
            str = "全部退货";
            break;
          default:
            str = "-";
            break;
        }
        return str;
    }
}
/**
 * 物流状态转换文字
 */
 @Pipe({
    name: 'expressStatus',
    pure: false
})
export class expressStatusPipe extends saleTypeStatusPipe {
    transform(value: Number, exponent?: number): String {
        let str: String = "";
        switch (value) {
          case 0:
            str = "无轨迹";
            break;
          case 1:
            str = "已揽收";
            break;
          case 2:
            str = "在途中";
            break;
          case 201:
            str = "到达派件城市";
            break;
          case 202:
            str = "派件中";
            break;
          case 211:
            str = "已放入快递柜或驿站";
            break;
          case 3:
            str = "已签收";
            break;
          case 311:
            str = "已取出快递柜或驿站";
            break;
          case 4:
            str = "问题件";
            break;
          case 401:
            str = "发货无信息";
            break;
          case 402:
            str = "超时未签收";
            break;
          case 403:
            str = "超时未更新";
            break;
          case 404:
            str = "拒收（退件）";
            break;
          case 412:
            str = "快递柜或驿站超时未取";
            break;
          default:
            str = "-";
            break;
        }
        return str;
    }
}

