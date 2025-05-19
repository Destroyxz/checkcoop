
//Librerias Angular
import { NgModule }                from '@angular/core';
import { BrowserModule }           from '@angular/platform-browser';
import { FormsModule, ReactiveFormsModule} from '@angular/forms';
import { HttpClientModule, HTTP_INTERCEPTORS } from '@angular/common/http';
import { MatMenuModule } from '@angular/material/menu';
import { MatButtonModule } from '@angular/material/button';
import { AdminJornadasComponent } from './components/AdminJornadas/admin-jornadas.component';
import { CookieService } from 'ngx-cookie-service';
import { CommonModule } from '@angular/common';
import { provideAnimationsAsync } from '@angular/platform-browser/animations/async';
import { InventarioComponent } from './components/Inventario/inventario.component';

//Componentes
import { AppComponent }            from './app.component';
import { DashboardComponent } from './components/Dashboard/dashboard.component';
import { LoginComponent } from './components/Login/login.component';
import { JornadaComponent } from './components/Jornada/jornada.component'; 
import { formulariosComponent } from './components/Formularios/formularios.component';

//Autenticators
import { AuthGuard }               from './guards/auth.guard';
import { AuthInterceptor }         from './interceptor/auth.interceptor';


import { SidebarComponent } from './shared/sidebar/sidebar.component';
import { HeaderComponent } from './shared/header/header.component';


import { AppRoutingModule }        from './app-routing.module';

//Pipes
import { FilterByTextPipe } from '../pipes/filterbytext.pipe';
import { FilterByCompanyPipe } from '../pipes/filterbycompany.pipe';
@NgModule({
  declarations: [
    
    //Componentes
    AppComponent,
    LoginComponent,
    DashboardComponent,
    JornadaComponent,
    formulariosComponent,
    AdminJornadasComponent,
    InventarioComponent,
    //Shared componentes
    SidebarComponent,
    HeaderComponent,

    //Pipes
    FilterByTextPipe,
    FilterByCompanyPipe
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