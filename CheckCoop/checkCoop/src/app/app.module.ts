import { BrowserModule } from '@angular/platform-browser';
import { NgModule } from '@angular/core';
import { ReactiveFormsModule } from '@angular/forms';
import { HttpClientModule } from '@angular/common/http';
import { AppRoutingModule } from './app-routing.module';
import { AppComponent } from './app.component';
import { HeaderComponent } from './shared/header/header.component';
import { FooterComponent } from './shared/footer/footer.component';
import { LoginComponent } from './pages/login/login.component';
import { DashboardComponent } from './pages/dashboard/dashboard.component';
import { FicharComponent } from './pages/fichar/fichar.component';
import { HistorialComponent } from './pages/historial/historial.component';
import { InventarioComponent } from './pages/inventario/inventario.component';
import { PuestosComponent } from './pages/puestos/puestos.component';
import { RegistroComponent } from './pages/registro/registro.component';
import { Verificacion2faComponent } from './pages/verificacion2fa/verificacion2fa.component';
import { ApiService } from './services/api.service';
//import { AuthGuard } from './guards/auth.guard';

@NgModule({  
  declarations: [    

  ],
  imports: [    
    BrowserModule,    
    AppRoutingModule,    
    ReactiveFormsModule,    
    HttpClientModule,

    AppComponent,    
    HeaderComponent,    
    FooterComponent,    
    LoginComponent,    
    DashboardComponent,    
    FicharComponent,    
    HistorialComponent,    
    InventarioComponent,    
    PuestosComponent,    
    RegistroComponent,    
    Verificacion2faComponent  
  ],
  providers: [ApiService, /*AuthGuard*/],
  bootstrap: [],
})
export class AppModule {}