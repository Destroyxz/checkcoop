// src/app/app.module.ts
import { NgModule }                from '@angular/core';
import { BrowserModule }           from '@angular/platform-browser';
import { FormsModule, ReactiveFormsModule} from '@angular/forms';
import { HttpClientModule, HTTP_INTERCEPTORS } from '@angular/common/http';
import { AppRoutingModule }        from './app-routing.module';
import { AppComponent }            from './app.component';
import { MatMenuModule } from '@angular/material/menu';
import { MatButtonModule } from '@angular/material/button';
import { AdminJornadasComponent } from './components/AdminJornadas/admin-jornadas.component';
import { CookieService } from 'ngx-cookie-service';
import { CommonModule } from '@angular/common';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';

import { LoginComponent } from './components/Login/login.component';
import { JornadaComponent } from './components/Jornada/jornada.component'; 
import { formulariosComponent } from './components/Formularios/formularios.component';

import { DashboardComponent } from './components/Dashboard/dashboard.component';
import { AuthGuard }               from './guards/auth.guard';
import { AuthInterceptor }         from './interceptor/auth.interceptor';


import { SidebarComponent } from './shared/sidebar/sidebar.component';
import { HeaderComponent } from './shared/header/header.component';
import { provideAnimationsAsync } from '@angular/platform-browser/animations/async';
//import { PerfilComponent } from './components/Perfil/perfil.component';
@NgModule({
  declarations: [
    AppComponent,
    LoginComponent,
    DashboardComponent,
    JornadaComponent,
    formulariosComponent,
//    PerfilComponent,

    SidebarComponent,
    HeaderComponent,
    AdminJornadasComponent
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

    
     
  ],
  providers: [
    AuthGuard,
    { provide: HTTP_INTERCEPTORS, useClass: AuthInterceptor, multi: true },
    provideAnimationsAsync()
  ,    CookieService ,

  ],
  bootstrap: [AppComponent]
})
export class AppModule {}