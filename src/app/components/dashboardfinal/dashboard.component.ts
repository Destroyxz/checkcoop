
import { Component, OnInit } from '@angular/core';
import { UserStorageService } from '../../services/UserStorage.service';
import { dashboardService } from '../../services/dashboard.service';

// Importar Color y ScaleType de ngx-charts para tipar correctamente el esquema de color
import { Color, ScaleType } from '@swimlane/ngx-charts';
import { DatePipe } from '@angular/common';

interface UsuarioDia {
  fecha: string;
  cantidad: number;
}

@Component({
  selector: 'app-dashboard',
  templateUrl: './dashboard.component.html',
  styleUrls: ['./dashboard.component.scss'],
  providers: [DatePipe]
})
export class DashboardComponentFinal implements OnInit {
  userData: any;

  // Métricas simples
  totalUsuariosGlobal: number | null = null;
  totalUsuariosEmpresa: number | null = null;
  totalEmpresas: number | null = null;

  // Datos sin transformar 
  usuariosPorDiaGlobal: UsuarioDia[] = [];
  usuariosPorDiaEmpresa: UsuarioDia[] = [];
  productosBajoStock: Array<{ nombre: string; cantidad: number }> = [];

  // Flags de carga
  loadingUsuariosTotal = true;
  loadingUsuariosPorDia = true;
  loadingEmpresasTotal = true;
  loadingProductosBajoStock = true;

  //Formato ngx-charts
  chartDataUsuarios: Array<{ name: string; value: number }> = [];
  chartDataProductos: Array<{ name: string; value: number }> = [];

  // Opciones comunes de los gráficos (ancho x alto en píxeles)
  viewUsuarios: [number, number] = [700, 300];
  viewProductos: [number, number] = [700, 300];

  // Opciones de ejes, leyenda, etc.
  showXAxis = true;
  showYAxis = true;
  showLegend = false;
  showXAxisLabel = true;
  showYAxisLabel = true;

  //Esquemas de color
  colorSchemeUsuarios: Color = {
    name: 'usuariosScheme',
    selectable: true,
    group: ScaleType.Ordinal,
    domain: ['#047857']
  };
  colorSchemeProductos: Color = {
    name: 'productosScheme',
    selectable: true,
    group: ScaleType.Ordinal,
    domain: ['#03503a']
  };

  constructor(
    private userStorage: UserStorageService,
    private metricsService: dashboardService,
    private datePipe: DatePipe
  ) { }

  ngOnInit(): void {
    this.userData = this.userStorage.getUser();

    //  TOTAL Usuarios
    if (this.userData?.rol === 'superadmin') {
      this.metricsService.getTotalUsuarios().subscribe({
        next: (res) => {
          this.totalUsuariosGlobal = res.totalUsuarios;
          this.loadingUsuariosTotal = false;
        },
        error: (err) => {
          console.error('Error total usuarios global:', err);
          this.loadingUsuariosTotal = false;
        }
      });
    } else {
      const empId = this.userData.empresa_id;
      this.metricsService.getTotalUsuariosPorEmpresa(empId).subscribe({
        next: (res) => {
          this.totalUsuariosEmpresa = res.totalUsuarios;
          this.loadingUsuariosTotal = false;
        },
        error: (err) => {
          console.error('Error total usuarios empresa:', err);
          this.loadingUsuariosTotal = false;
        }
      });
    }

    //  TOTAL Empresas (solo superadmin)
    if (this.userData?.rol === 'superadmin') {
      this.metricsService.getTotalEmpresas().subscribe({
        next: (res) => {
          this.totalEmpresas = res.totalEmpresas;
          this.loadingEmpresasTotal = false;
        },
        error: (err) => {
          console.error('Error total empresas:', err);
          this.loadingEmpresasTotal = false;
        }
      });
    } else {
      this.loadingEmpresasTotal = false;
    }

    // Usuarios por Día
    if (this.userData?.rol === 'superadmin') {
      this.metricsService.getUsuariosPorDia().subscribe({
        next: (arr: UsuarioDia[]) => {
          this.usuariosPorDiaGlobal = arr;
          this.loadingUsuariosPorDia = false;
          this.transformUsuariosParaChart();
        },
        error: (err) => {
          console.error('Error usuarios por día global:', err);
          this.loadingUsuariosPorDia = false;
        }
      });
    } else {
      const empId = this.userData.empresa_id;
      this.metricsService.getUsuariosPorDiaPorEmpresa(empId).subscribe({
        next: (res: { empresa_id: number; data: UsuarioDia[] }) => {
          this.usuariosPorDiaEmpresa = res.data;
          this.loadingUsuariosPorDia = false;
          this.transformUsuariosParaChart();
        },
        error: (err) => {
          console.error('Error usuarios por día empresa:', err);
          this.loadingUsuariosPorDia = false;
        }
      });
    }

    // Productos con Stock < 100
    if (this.userData?.rol !== 'usuario') {
      const empIdForProducts = this.userData.empresa_id;
      this.metricsService.getProductosBajoStockPorEmpresa(empIdForProducts).subscribe({
        next: (list) => {
          this.productosBajoStock = list;
          this.loadingProductosBajoStock = false;
          this.transformProductosParaChart();
        },
        error: (err) => {
          console.error('Error productos bajo stock:', err);
          this.loadingProductosBajoStock = false;
        }
      });
    } else {
      this.loadingProductosBajoStock = false;
    }
  }

  // Convierte los datos de Usuarios por Día al formato 

  private transformUsuariosParaChart(): void {
    let source: UsuarioDia[] = [];
    if (this.userData?.rol === 'superadmin') {
      source = this.usuariosPorDiaGlobal;
    } else {
      source = this.usuariosPorDiaEmpresa;
    }

    this.chartDataUsuarios = source.map(u => {

      const formattedDate: string | null = this.datePipe.transform(u.fecha, 'dd/MM/yyyy');
      return {
        name: formattedDate || u.fecha,  
        value: u.cantidad
      };
    });
  }

  // Convierte los datos de Productos con Stock al formato

  private transformProductosParaChart(): void {
    this.chartDataProductos = this.productosBajoStock.map(p => ({
      name: p.nombre,
      value: p.cantidad
    }));
  }


}


