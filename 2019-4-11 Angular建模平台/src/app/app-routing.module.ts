import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';
import { TestpageComponent } from './testpage/testpage.component';

const routes: Routes = [
  {
    path: '',
    redirectTo: 'workbench', pathMatch: 'full'
  },
  {
    path: 'testpage', // 动态建模测试页
    component: TestpageComponent
  }
];

@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule]
})
export class AppRoutingModule {}
