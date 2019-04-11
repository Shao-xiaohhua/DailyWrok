import { Component, OnInit } from '@angular/core';

@Component({
  selector: 'app-testpage',
  templateUrl: './testpage.component.html',
})
export class TestpageComponent implements OnInit {
  business = {
    renderer: 'com.homolo.datamodel.ui.page.renderers.SearchRenderer',
  };
  constructor() { }

  ngOnInit() {
  }

}
