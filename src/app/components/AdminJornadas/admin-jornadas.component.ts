import { Component, OnInit } from '@angular/core';
import { JornadaService } from '../../services/jornada.service';
import { NgModule } from '@angular/core';
import { Modal } from 'bootstrap';

@Component({
  selector: 'app-admin-jornadas',
  templateUrl: './admin-jornadas.component.html'
})
export class AdminJornadasComponent implements OnInit {
  jornadas: any[] = [];
  jornadasFiltradas: any[] = [];
  trabajadores: any[] = []; // ✅ solucionado

  filtroTrabajador: string = ''; 
  filtroFecha: string = '';

  jornadaSeleccionada: any = null;
  tramosSeleccionados: any[] = [];

  constructor(private jornadaService: JornadaService) {}

  ngOnInit(): void {
    this.cargarDatos();
  }

  cargarDatos() {
    this.jornadaService.obtenerTodasLasJornadas().subscribe(data => {
      this.jornadas = data;
      this.jornadasFiltradas = [...data];
    });

    this.jornadaService.obtenerTrabajadores().subscribe(data => {
      this.trabajadores = data;
    });
  }

  filtrar() {
    this.jornadasFiltradas = this.jornadas.filter(j => {
      const coincideTrabajador = this.filtroTrabajador ? j.usuario_id == this.filtroTrabajador : true;
      const coincideFecha = this.filtroFecha ? j.fecha === this.filtroFecha : true;
      return coincideTrabajador && coincideFecha;
    });
  }

  verTramos(jornada: any) {
    this.jornadaSeleccionada = jornada;
  
    this.jornadaService.obtenerTramosPorJornada(jornada.id).subscribe({
      next: (data) => {
        this.tramosSeleccionados = data;
  
        const modalEl = document.getElementById('modalDetalleJornada');
        if (modalEl) {
          const modal = new Modal(modalEl); // 👈 usa Modal directamente
          modal.show();
        }
      },
      error: (err) => {
        console.error('Error al cargar tramos:', err);
      }
    });
  }

  


  editarJornada(jornada: any) {
    // Próximo paso
  }

  eliminarJornada(id: number) {
    if (confirm('¿Eliminar esta jornada?')) {
      this.jornadaService.eliminarJornada(id).subscribe(() => {
        this.cargarDatos();
      });
    }
  }
  calcularDuracionTramo(inicio: string, fin: string): string {
    const ini = new Date(inicio);
    const f = new Date(fin);
    const ms = f.getTime() - ini.getTime();
    const h = Math.floor(ms / 3600000);
    const m = Math.floor((ms % 3600000) / 60000);
    return `${h}h ${m}m`;
  }
  
}
