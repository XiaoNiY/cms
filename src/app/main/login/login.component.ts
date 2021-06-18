import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup } from '@angular/forms';
import { Router } from '@angular/router';
import { NzMessageService } from 'ng-zorro-antd/message';

@Component({
    selector: 'app-login',
    templateUrl: './login.component.html',
    styleUrls: ['./login.component.scss']
})
export class LoginComponent implements OnInit {
    validateForm!: FormGroup;

    messageId: string | undefined;
    constructor(
        private fb: FormBuilder,
        private message: NzMessageService,
        private router: Router
    ) { }

    ngOnInit(): void {
        this.validateForm = this.fb.group({
            accountNumber: null,
            passWord: null,
            // 系统
            system: null,
            // 浏览器
            browser: null,
        });

    }

    submitForm() {
        if (!this.validateForm.value.accountNumber) {
            return this.createMessage('warning', '请输入账号');
        }
        if (!this.validateForm.value.passWord) {
            return this.createMessage('warning', '请输入密码');
        }

        if(this.validateForm.value.accountNumber == 'xn' && this.validateForm.value.passWord == '123456') {
            this.createMessage('success','登录成功');
            this.router.navigate(['home']);
        } else {
            this.createMessage('error','账号或密码错误，请重新输入');
            return;
        }
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
    createBasicMessage():void {
        this.messageId = this.message.loading('正在加载中...', {nzDuration: 0}).messageId;
    }

    /**
     * 移除loading
     */
    removeBasicMessage(): void {
        this.message.remove(this.messageId);
        this.messageId = "";
    }
}
