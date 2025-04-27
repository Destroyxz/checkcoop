import { Component, OnInit } from '@angular/core';

interface StatCard {
  title: string;
  value: number | string;
  icon: string;        // e.g. classname for an icon font
  colorClass: string;  // e.g. 'bg-blue', 'bg-green'
}

@Component({
  selector: 'app-dashboard',
  templateUrl: './dashboard.component.html',
  styleUrls: ['./dashboard.component.scss']
})
export class DashboardComponent implements OnInit {
  public stats: StatCard[] = [];

  constructor() { }

  ngOnInit(): void {
    // Datos simulados; en producción, traérselos de un servicio
    this.stats = [
      { title: 'Usuarios', value: 1280, icon: 'fa fa-users', colorClass: 'bg-blue' },
      { title: 'Expedientes', value: 254, icon: 'fa fa-folder-open', colorClass: 'bg-green' },
      { title: 'Cooperativas', value: 12, icon: 'fa fa-building', colorClass: 'bg-orange' },
      { title: 'Ingresos (€)', value: '12.5k', icon: 'fa fa-euro-sign', colorClass: 'bg-purple' }
    ];
  }
}