
//Librerias Angular
import { NgModule } from '@angular/core';
import { BrowserModule } from '@angular/platform-browser';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { HttpClientModule, HTTP_INTERCEPTORS } from '@angular/common/http';
import { MatMenuModule } from '@angular/material/menu';
import { MatButtonModule } from '@angular/material/button';
import { AdminJornadasComponent } from './components/AdminJornadas/admin-jornadas.component';
import { CookieService } from 'ngx-cookie-service';
import { CommonModule } from '@angular/common';
import { provideAnimationsAsync } from '@angular/platform-browser/animations/async';
import { ModalModule } from 'ngx-bootstrap/modal';
import { InventarioComponent } from './components/Inventario/inventario.component';
import { AdminTareasComponent } from './components/AdminTareas/admin-tareas.component';
import { TareasUsuarioComponent } from './components/TareasUsuario/tareas-usuario.component';
import { DashboardComponentFinal } from './components/dashboardfinal/dashboard.component';
import { Chart } from 'chart.js';
import { NgxChartsModule } from '@swimlane/ngx-charts';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
//Componentes
import { AppComponent } from './app.component';
import { DashboardComponent } from './components/Dashboard/dashboard.component';
import { LoginComponent } from './components/Login/login.component';
import { JornadaComponent } from './components/Jornada/jornada.component';
import { formulariosComponent } from './components/Formularios/formularios.component';
import { EditUserModalComponent } from './components/Formularios/editUser/editUser.component';
import { EditCompanyModalComponent } from './components/Formularios/editCompany/editCompany.component';
//Autenticators
import { AuthGuard } from './guards/auth.guard';
import { AuthInterceptor } from './interceptor/auth.interceptor';


import { SidebarComponent } from './shared/sidebar/sidebar.component';
import { HeaderComponent } from './shared/header/header.component';
import { AppRoutingModule } from './app-routing.module';

//Pipes
import { FilterByTextPipe } from '../pipes/filterbytext.pipe';
import { FilterByCompanyPipe } from '../pipes/filterbycompany.pipe';
import { FixEncodingPipe } from '../pipes/fixencoding.pipe';

@NgModule({
  declarations: [

    //Componentes
    AppComponent,
    LoginComponent,
    DashboardComponent,
    JornadaComponent,
    formulariosComponent,
    AdminJornadasComponent,
    EditCompanyModalComponent,
    EditUserModalComponent,
    AdminTareasComponent,
    InventarioComponent,
    TareasUsuarioComponent,
    DashboardComponentFinal,

    //Shared componentes
    SidebarComponent,
    HeaderComponent,

    //Pipes
    FilterByTextPipe,
    FilterByCompanyPipe,
    FixEncodingPipe
  ],
  imports: [
    BrowserModule,
    FormsModule,
    ReactiveFormsModule,
    HttpClientModule,
    AppRoutingModule,
    MatMenuModule,
    MatButtonModule,
    CommonModule,
    NgxChartsModule,
    BrowserAnimationsModule,
    ModalModule.forRoot(),

  ],
 // Los providers son servicios que estarán disponibles en toda la aplicación mediante inyección de dependencias
  providers: [
    AuthGuard,
    { provide: HTTP_INTERCEPTORS, useClass: AuthInterceptor, multi: true },
    provideAnimationsAsync()
    , CookieService,

  ],
  bootstrap: [AppComponent]
})
export class AppModule { }
