import { Component, OnInit } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';

@Component({
    selector: 'app-customer-tabs',
    templateUrl: './customer-tabs.component.html',
    styleUrls: ['./customer-tabs.component.scss']
})
export class CustomerTabsComponent implements OnInit {
    /**
     * 是否显示骨架屏
     */
    skeletonActive = true;
    /**
     * 服务器发生了错误。结果页
     */
    resultError: any = false;
    /**
     * 当前激活 tab 面板的 序列号，可双向绑定
     */
    selectedIndex: any = 0;
    //详情ID
    id: any = 0;
    tabArr = [
        {
            name: "基本信息", path: "basics", disabled: false
        },
        {
            name: "店铺信息", path: "shop", disabled: false
        },
        {
            name: "积分记录", path: "integral", disabled: true
        },
        {
            name: "成长值记录", path: "growth", disabled: true
        },
        {
            name: "客户行为", path: "customerBehavior", disabled: true
        },
        {
            name: "用户优惠券", path: "userCoupon", disabled: true
        },
        {
            name: "用户标签", path: "userTags", disabled: true
        },
        {
            name: "提现记录", path: "withdraw", disabled: true
        },
    ]

    constructor(
        private router: Router,
        private activatedRoute: ActivatedRoute,
    ) { }

    ngOnInit(): void {
        this.activatedRoute.params.subscribe(params => {
            this.id = params.id;
            this.selectedIndex = params.tabIndex;
            console.log(this.selectedIndex);
        });
        // if (this.id != 0) {
        // } else {
        // }
        this.skeletonActive = false;
        this.resultError = false;
        this.toTabs(this.tabArr[this.selectedIndex].path);
    }
    resetTab() {
        for (let index = 1; index < this.tabArr.length; index++) {
            const element = this.tabArr[index];
            element.disabled = false;
        }
    }

    /**
     * 跳转tabs子路由
     * @param path 路由地址
     */
    toTabs(path: any) {
        console.log(!this.skeletonActive && !this.resultError);
        if (!this.skeletonActive && !this.resultError) {
            this.router.navigate([path, this.id], {
                relativeTo: this.activatedRoute,
                skipLocationChange: true
            });
        }
    }

}
