import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup } from '@angular/forms';
import { Router } from '@angular/router';
import { NzMessageService } from 'ng-zorro-antd/message';
import { LoginService } from './login.service';

@Component({
  selector: 'app-login',
  templateUrl: './login.component.html',
  styleUrls: ['./login.component.scss']
})
export class LoginComponent implements OnInit {
  validateForm!: FormGroup;

  messageId: string = "";
  constructor(
    private fb: FormBuilder,
    private message: NzMessageService,
    private router: Router,
    private loginService: LoginService
  ) { }

  ngOnInit(): void {
    this.validateForm = this.fb.group({
      account: null,
      password: null,
      // 系统
      // system: null,
      // 浏览器
      // browser: null,
    });
  }

  submitForm() {
    if (this.messageId != "") {
      return
    }

    if (!this.validateForm.value.account) {
      return this.createMessage('warning', '请输入账号');
    }
    if (!this.validateForm.value.password) {
      return this.createMessage('warning', '请输入密码');
    }

    this.createBasicMessage();
    this.loginService.login(this.validateForm.value).subscribe((res: any) => {
      this.removeBasicMessage();
      if (res.status == 200) {
        this.router.navigate(['home']);
        return this.createMessage('success', '登录成功');
      }

      return this.createMessage('error', res.msg);

    }, err => {
      this.removeBasicMessage();
      this.createMessage('error', err.msg);
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

