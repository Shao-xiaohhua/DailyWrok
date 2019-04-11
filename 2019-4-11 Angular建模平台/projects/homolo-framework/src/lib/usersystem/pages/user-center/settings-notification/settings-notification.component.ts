import { Component, OnInit } from '@angular/core';

@Component({
  selector: 'hf-settings-notification',
  templateUrl: './settings-notification.component.html',
  styleUrls: ['../../../../../assets/scss/homolo-framework.scss']
})
export class SettingsNotificationComponent implements OnInit {
  switchCount = true;
  switchMessage = true;
  switchTask = true;

  constructor() {}

  ngOnInit() {}
}
