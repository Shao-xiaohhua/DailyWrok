import { NgModule }             from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
 
import { HeroDetailComponent  }  from '../compTwo/aT.component'; // 这也是一个组件
import { DashboardComponent  }  from '../dashboard/dashboard.component';
import { HeroesComponent }     from '../heroComp/heroes.component';
 
const routes: Routes = [
  { path: '', redirectTo: '/dashboard', pathMatch: 'full' },
  { path: 'dashboard',  component: DashboardComponent },
  { path: 'detail/:id', component: HeroDetailComponent },
  { path: 'heroes',     component: HeroesComponent }
];
 
@NgModule({
  imports: [ RouterModule.forRoot(routes) ],
  exports: [ RouterModule ]
})
export class AppRoutingModule {}