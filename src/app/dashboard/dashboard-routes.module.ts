import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { DashboardComponent } from './dashboard.component';
import { dashboardRoutes } from './dasboard.routes';
//import { AuthGuard } from '../services/auth.guard';

const rutasHijas: Routes = [
  { 
    path: '', 
    component: DashboardComponent, 
    children: dashboardRoutes,
    //canActivate: [ AuthGuard ]
  }
];

@NgModule({
  declarations: [],
  imports: [
    RouterModule.forRoot(rutasHijas)
  ],
  exports: [
    RouterModule
  ]
})
export class DashboardRoutesModule { }
