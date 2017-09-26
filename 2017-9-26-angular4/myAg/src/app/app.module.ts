import { NgModule }      from '@angular/core';
import { BrowserModule } from '@angular/platform-browser';
import { FormsModule }   from '@angular/forms'; // <-- 数据双向绑定需要的模块

import { AppComponent }  from './appComppnent/app.component'; // 这是一个组件
import { HeroDetailComponent  }  from './compTwo/aT.component';

@NgModule({
  imports:      [ BrowserModule, FormsModule ],
  declarations: [ AppComponent, HeroDetailComponent ],
  bootstrap:    [ AppComponent ]
})
export class AppModule { }
