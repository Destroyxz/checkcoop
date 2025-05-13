// src/app/app-routing.module.ts
import { NgModule }             from '@angular/core';
import { RouterModule, Routes } from '@angular/router';

import { LoginComponent }     from './components/Login/login.component';
import { DashboardComponent } from './components/Dashboard/dashboard.component';
import { AuthGuard }          from './guards/auth.guard';
import { JornadaComponent } from './components/Jornada/jornada.component';
import { AdminJornadasComponent } from './components/AdminJornadas/admin-jornadas.component';
//import { PerfilComponent } from './components/Perfil/perfil.component';
const routes: Routes = [
  { path: 'login',     component: LoginComponent },
  { path: 'dashboard', component: DashboardComponent, canActivate: [AuthGuard] },
  { path: 'jornada', component: JornadaComponent },
  { path: 'adminjornadas', component: AdminJornadasComponent },

//  { path: 'perfil', component: PerfilComponent},
  { path: '',           redirectTo: 'dashboard', pathMatch: 'full' },
  { path: '**',         redirectTo: 'dashboard', pathMatch: 'full' }
];

@NgModule({
  imports: [ RouterModule.forRoot(routes) ],
  exports: [ RouterModule ]
})
export class AppRoutingModule {}
