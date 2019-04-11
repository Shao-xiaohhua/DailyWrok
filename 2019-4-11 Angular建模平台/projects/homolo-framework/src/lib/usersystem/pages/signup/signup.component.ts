import { Component, OnInit } from '@angular/core';
import {
  FormBuilder,
  FormControl,
  FormGroup,
  Validators
} from '@angular/forms';

@Component({
  selector: 'hf-sign',
  templateUrl: './signup.component.html',
  styleUrls: ['../../../../assets/scss/homolo-framework.scss']
})
export class SignupComponent implements OnInit {

  validateForm: FormGroup;
  // 验证码
  count = 0;
  interval$: any;

  updateConfirmValidator(): void {
    /** wait for refresh value */
    Promise.resolve().then(() => this.validateForm.controls.checkPassword.updateValueAndValidity());
  }

  confirmationValidator = (control: FormControl): {
    [s: string]: boolean
  } => {
    if (!control.value) {
      return {
        required: true
      };
    } else if (control.value !== this.validateForm.controls.password.value) {
      return {
        confirm: true,
        error: true
      };
    }
  }

  constructor(private fb: FormBuilder) {}

  ngOnInit(): void {
    this.validateForm = this.fb.group({
      email: [null, [Validators.email, Validators.required]],
      password: [null, [Validators.required]],
      checkPassword: [null, [Validators.required, this.confirmationValidator]],
      nickname: [null, [Validators.required]],
      phoneNumberPrefix: ['+86'],
      mobile: [null, [Validators.required]],
      captcha: [null, [Validators.required]],
      agree: [true]
    });
  }

  get email() {
    return this.validateForm.controls.email;
  }
  get password() {
    return this.validateForm.controls.password;
  }
  get checkPassword() {
    return this.validateForm.controls.checkPassword;
  }
  get nickname() {
    return this.validateForm.controls.nickname;
  }
  get phoneNumberPrefix() {
    return this.validateForm.controls.phoneNumberPrefix;
  }
  get mobile() {
    return this.validateForm.controls.mobile;
  }
  get captcha() {
    return this.validateForm.controls.captcha;
  }
  get agree() {
    return this.validateForm.controls.agree;
  }
  // 验证码
  showCaptcha(): void {
    if (this.mobile.invalid) {
      this.mobile.markAsDirty({
        onlySelf: true
      });
      this.mobile.updateValueAndValidity({
        onlySelf: true
      });
      return;
    }
    this.count = 59;
    this.interval$ = setInterval(() => {
      this.count -= 1;
      if (this.count <= 0) { clearInterval(this.interval$);
      }
    }, 1000);
  }

  submitForm(): void {
// tslint:disable-next-line: forin
    for (const i in this.validateForm.controls) {
      this.validateForm.controls[i].markAsDirty();
      this.validateForm.controls[i].updateValueAndValidity();
    }
  }

}
