import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';
import { DefaultLayoutComponent } from 'homolo-framework';
import { AuthGuardService } from 'homolo-framework';
import { BusinessComponent } from './business.component';
const routes: Routes = [
  {
    path: '',
    component: DefaultLayoutComponent,
    /* canActivate: [AuthGuardService], */
    children: [
      { path: 'business/:name', component: BusinessComponent }
    ]
  }
];

@NgModule({
  imports: [RouterModule.forRoot(routes)]
})
export class DatamodelRoutingModule {}
