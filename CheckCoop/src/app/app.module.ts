// src/app/app.module.ts
import { NgModule }                from '@angular/core';
import { BrowserModule }           from '@angular/platform-browser';
import { FormsModule, ReactiveFormsModule} from '@angular/forms';
import { HttpClientModule, HTTP_INTERCEPTORS } from '@angular/common/http';
import { AppRoutingModule }        from './app-routing.module';

import { AppComponent }            from './app.component';
import { LoginComponent } from './components/Login/login.component';
import { RegistroComponent } from './components/Registro/registro.component';

import { HeaderComponent }         from './shared/header/header.component';
import { FooterComponent }         from './shared/footer/footer.component';
import { DashboardComponent } from './components/Dashboard/dashboard.component';
import { AuthGuard }               from './guards/auth.guard';
import { AuthInterceptor }         from './interceptor/auth.interceptor';

@NgModule({
  declarations: [
    AppComponent,
    LoginComponent,
    RegistroComponent,
    DashboardComponent,

  ],
  imports: [
    BrowserModule,
    FormsModule,
    ReactiveFormsModule,
    HttpClientModule,
    AppRoutingModule,

    HeaderComponent,
    FooterComponent
  ],
  providers: [
    AuthGuard,
    { provide: HTTP_INTERCEPTORS, useClass: AuthInterceptor, multi: true }
  ],
  bootstrap: [AppComponent]
})
export class AppModule {}