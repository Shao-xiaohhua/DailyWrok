import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';

@Component({
  selector: 'hf-error500',
  templateUrl: './error500.component.html',
  styleUrls: ['../../../assets/scss/homolo-framework.scss']
})
export class Error500Component implements OnInit {
  constructor(private router: Router) {}

  ngOnInit() {}
  toIndex() {
    this.router.navigateByUrl('workbench');
  }
}
