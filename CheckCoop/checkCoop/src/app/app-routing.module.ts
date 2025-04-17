import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { LoginComponent } from './pages/login/login.component';
import { DashboardComponent } from './pages/dashboard/dashboard.component';
import { FicharComponent } from './pages/fichar/fichar.component';
import { HistorialComponent } from './pages/historial/historial.component';
import { InventarioComponent } from './pages/inventario/inventario.component';
import { PuestosComponent } from './pages/puestos/puestos.component';
import { RegistroComponent } from './pages/registro/registro.component';
import { Verificacion2faComponent } from './pages/verificacion2fa/verificacion2fa.component';
//import { AuthGuard } from './guards/auth.guard';

const routes: Routes = [  
  { path: '', component: LoginComponent },  
  { path: 'dashboard', component: DashboardComponent, /*canActivate: [AuthGuard]*/ },  
  { path: 'fichar', component: FicharComponent, /*canActivate: [AuthGuard]*/ },  
  { path: 'historial', component: HistorialComponent,/*canActivate: [AuthGuard]*/ },  
  { path: 'inventario', component: InventarioComponent, /*canActivate: [AuthGuard]*/ },  
  { path: 'puestos', component: PuestosComponent, /*canActivate: [AuthGuard]*/ },  
  { path: 'registro', component: RegistroComponent },  
  { path: 'verificacion-2fa', component: Verificacion2faComponent },  
  { path: '**', redirectTo: '' }  
];

@NgModule({  
  imports: [RouterModule.forRoot(routes)],  
  exports: [RouterModule]
})
export class AppRoutingModule {}