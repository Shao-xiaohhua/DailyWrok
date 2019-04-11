import { Component, OnInit, ElementRef, ViewChild } from '@angular/core';
import { UserService } from '../../services/user.service';
import { User } from '../../models/user';

@Component({
  selector: 'hf-user-center',
  templateUrl: './user-center.component.html',
  styleUrls: ['../../../../assets/scss/homolo-framework.scss']
})
export class UserCenterComponent implements OnInit {
  userInfo: User;
  tags = ['专注设计', '大长腿', '程序员'];
  inputVisible = false;
  inputValue = '';
  @ViewChild('inputElement') inputElement: ElementRef;

  constructor(private userService: UserService) {}

  ngOnInit() {
    this.userInfo = this.userService.currentUser;
    console.log(this.userInfo, 'user信息');
  }

  handleClose(removedTag: {}): void {
    this.tags = this.tags.filter(tag => tag !== removedTag);
  }

  sliceTagName(tag: string): string {
    const isLongTag = tag.length > 20;
    return isLongTag ? `${tag.slice(0, 20)}...` : tag;
  }

  showInput(): void {
    this.inputVisible = true;
    setTimeout(() => {
      this.inputElement.nativeElement.focus();
    }, 10);
  }

  handleInputConfirm(): void {
    if (this.inputValue && this.tags.indexOf(this.inputValue) === -1) {
      this.tags = [...this.tags, this.inputValue];
    }
    this.inputValue = '';
    this.inputVisible = false;
  }
}
