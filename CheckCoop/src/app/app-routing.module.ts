// src/app/app-routing.module.ts
import { NgModule }             from '@angular/core';
import { RouterModule, Routes } from '@angular/router';

import { LoginComponent }     from './components/Login/login.component';
import { DashboardComponent } from './components/Dashboard/dashboard.component';
import { AuthGuard }          from './guards/auth.guard';

const routes: Routes = [
  { path: 'login',     component: LoginComponent },
  { path: 'dashboard', component: DashboardComponent, canActivate: [AuthGuard] },
  { path: '',           redirectTo: 'dashboard', pathMatch: 'full' },
  { path: '**',         redirectTo: 'dashboard', pathMatch: 'full' }
];

@NgModule({
  imports: [ RouterModule.forRoot(routes) ],
  exports: [ RouterModule ]
})
export class AppRoutingModule {}
