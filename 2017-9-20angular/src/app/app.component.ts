import { Component, OnInit } from '@angular/core';

@Component({
  selector: 'app',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.scss']
})
export class AppComponent implements OnInit {
  private title: string;

  constructor () {}

  ngOnInit (): void {
    this.title = '我的队伍'
  }
}
