//Importamos los modulos que se van a enrutar
import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { AdminTareasComponent } from './components/AdminTareas/admin-tareas.component';

import { LoginComponent } from './components/Login/login.component';
import { DashboardComponent } from './components/Dashboard/dashboard.component';
import { AuthGuard } from './guards/auth.guard';
import { JornadaComponent } from './components/Jornada/jornada.component';
import { AdminJornadasComponent } from './components/AdminJornadas/admin-jornadas.component';
import { formulariosComponent } from './components/Formularios/formularios.component';
import { InventarioComponent } from './components/Inventario/inventario.component';
import { TareasUsuarioComponent } from './components/TareasUsuario/tareas-usuario.component';
//import { PerfilComponent } from './components/Perfil/perfil.component';

//Hacemos que nuestra constante guarde las rutas de los componentes con los nombre que pusimos
const routes: Routes = [
  { path: 'login', component: LoginComponent },
  { path: 'dashboard', component: DashboardComponent, canActivate: [AuthGuard] },
  { path: 'inventario', component: InventarioComponent, canActivate: [AuthGuard] },
  { path: 'jornada', component: JornadaComponent, canActivate: [AuthGuard] },
  { path: 'adminjornadas', component: AdminJornadasComponent, canActivate: [AuthGuard] },
  { path: 'admintareas', component: AdminTareasComponent, canActivate: [AuthGuard] },
  { path: 'tareas', component: TareasUsuarioComponent, canActivate: [AuthGuard] },

  { path: 'new', component: formulariosComponent, canActivate: [AuthGuard] },

  //  { path: 'perfil', component: PerfilComponent},
  { path: '*', redirectTo: 'dashboard', pathMatch: 'full' },
  { path: '**', redirectTo: 'dashboard', pathMatch: 'full' }
];

@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule]
})
export class AppRoutingModule { }
