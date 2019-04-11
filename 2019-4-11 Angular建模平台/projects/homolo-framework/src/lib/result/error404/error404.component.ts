import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';

@Component({
  selector: 'hf-error404',
  templateUrl: './error404.component.html',
  styleUrls: ['../../../assets/scss/homolo-framework.scss']
})
export class Error404Component implements OnInit {
  constructor(private router: Router) {}

  ngOnInit() {}
  toIndex() {
    this.router.navigateByUrl('workbench');
  }
}
