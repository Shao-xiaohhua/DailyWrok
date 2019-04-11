import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';

@Component({
  selector: 'hf-error403',
  templateUrl: './error403.component.html',
  styleUrls: ['../../../assets/scss/homolo-framework.scss']
})
export class Error403Component implements OnInit {
  constructor(private router: Router) {}

  ngOnInit() {}
  toIndex() {
    this.router.navigateByUrl('workbench');
  }
}
