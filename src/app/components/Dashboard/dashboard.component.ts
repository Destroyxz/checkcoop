//Importamos los componentes necesarios
import { Component, OnInit, AfterViewInit, ViewChild, ElementRef } from '@angular/core';
import Chart from 'chart.js/auto';
import { MetricasService } from '../../services/metricas.service';
import { UserStorageService } from '../../services/UserStorage.service';

// Interfaces reflejando la respuesta real de la API
type UserMetricPeriod = { period: string; new_users: number; };
type LoginMetricPeriod = { period: string; logins: number; };
type CompanyMetricPeriod = { period: string; new_companies: number; };
type RateMetricPeriod = { period: string; late_rate?: number; compliance_rate?: number; total_minutes?: number; };
interface DurationBucket { bucket: number; count: number; }
interface ProductStock { id: number; nombre: string; cantidad: number; unidad: string; }
interface CategoryStock { categoria: string; total_quantity: number; total_value: number; }

@Component({
  selector: 'app-dashboard',
  templateUrl: './dashboard.component.html',
  styleUrls: ['./dashboard.component.scss'],
})
export class DashboardComponent implements OnInit, AfterViewInit {
  // Indicador de carga
  loadingSummary = true;

  // Referencias a los elementos del DOM para los gráficos
  @ViewChild('usersChart', { static: false }) usersChartRef?: ElementRef<HTMLCanvasElement>;
  @ViewChild('durationChart', { static: false }) durationChartRef?: ElementRef<HTMLCanvasElement>;
  @ViewChild('newUsersChart', { static: false }) newUsersChartRef?: ElementRef<HTMLCanvasElement>;
  @ViewChild('loginsChart', { static: false }) loginsChartRef?: ElementRef<HTMLCanvasElement>;
  @ViewChild('lateChart', { static: false }) lateChartRef?: ElementRef<HTMLCanvasElement>;
  @ViewChild('complianceChart', { static: false }) complianceChartRef?: ElementRef<HTMLCanvasElement>;

  userData: any;

  // Variables de datos para métricas
  tabs = [
    { key: 'summary', label: 'Resumen' },
    { key: 'users', label: 'Usuarios' },
    { key: 'jornadas', label: 'Jornadas' },
    { key: 'inventory', label: 'Inventario' },
    { key: 'companies', label: 'Empresas' }
  ];
  selectedTab = 'summary';
  isSuperAdmin = false;
  currentMonth = this.getCurrentMonth();
  newCompaniesThisMonth = 0;
  totalUsers = 0;
  activeUsers = 0;
  newUsers: UserMetricPeriod[] = [];
  lastLogins: LoginMetricPeriod[] = [];
  totalCompanies = 0;
  newCompanies: CompanyMetricPeriod[] = [];
  averageDuration = 0;
  lateRates: RateMetricPeriod[] = [];
  complianceRates: RateMetricPeriod[] = [];
  totalMinutes: RateMetricPeriod[] = [];
  averageTramosCount = 0;
  durationDistribution: DurationBucket[] = [];
  stockLevels: ProductStock[] = [];
  totalStockValue = 0;
  productsByCategory: CategoryStock[] = [];

  newUsersThisMonth = 0;
  loginsThisMonth = 0;
  lateRatesThisMonth = 0;
  complianceRatesThisMonth = 0;
  totalMinutesThisMonth = 0;
  lowStockCount = 0;
  criticalStockCount = 0;

  // Datos mostrados en tarjetas del dashboard 
  userCards: Array<{ title: string; value: any; sub: string; isPositive?: boolean }> = [];
  jornadaCards: Array<{ title: string; value: any; sub: string }> = [];
  inventoryCards: Array<{ title: string; value: any; sub: string }> = [];

  // Instancias de los gráficos
  private usersChart?: Chart;
  private durationChart?: Chart;
  private newUsersChart?: Chart;
  private loginsChart?: Chart;
  private lateChart?: Chart;
  private complianceChart?: Chart;

  constructor(
    private metricasService: MetricasService,
    private userStorageService: UserStorageService
  ) { }

  // Carga de datos inicial 
  ngOnInit(): void {
    this.userData = this.userStorageService.getUser();
    this.isSuperAdmin = this.userData.role === 'superadmin';
    this.loadAllMetrics();
  }

  // Inicialización de los gráficos tras cargar la vista
  ngAfterViewInit(): void {
    if (this.usersChartRef && this.durationChartRef) {
      this.usersChart = this.initChart(this.usersChartRef.nativeElement, 'line', 'Usuarios Activos');
      this.durationChart = this.initChart(this.durationChartRef.nativeElement, 'pie', 'Duración Tramos');
    }
  }

  // Permite cambiar entre pestañas
  selectTab(key: string): void {
    this.selectedTab = key;
    setTimeout(() => {
      if (key === 'users') {
        if (this.newUsersChartRef && !this.newUsersChart) {
          this.newUsersChart = this.initChart(this.newUsersChartRef.nativeElement, 'bar', 'Nuevos Usuarios');
          this.updateChart(this.newUsersChart, this.newUsers.map(d => d.period), this.newUsers.map(d => d.new_users));
        }
        if (this.loginsChartRef && !this.loginsChart) {
          this.loginsChart = this.initChart(this.loginsChartRef.nativeElement, 'line', 'Logins');
          this.updateChart(this.loginsChart, this.lastLogins.map(d => d.period), this.lastLogins.map(d => d.logins));
        }
      }
      if (key === 'jornadas') {
        if (this.lateChartRef && !this.lateChart) {
          this.lateChart = this.initChart(this.lateChartRef.nativeElement, 'line', 'Llegadas Tarde');
          this.updateChart(this.lateChart, this.lateRates.map(d => d.period), this.lateRates.map(d => d.late_rate ?? 0));
        }
        if (this.complianceChartRef && !this.complianceChart) {
          this.complianceChart = this.initChart(this.complianceChartRef.nativeElement, 'line', 'Cumplimiento');
          this.updateChart(this.complianceChart, this.complianceRates.map(d => d.period), this.complianceRates.map(d => d.compliance_rate ?? 0));
        }
      }
    });
  }

  //Super funcion que carga todas las metricas 
  private loadAllMetrics(): void {
    const { empresaId, from, to, groupBy } = this.userData;

    this.metricasService.getTotalUsers(empresaId)
      .subscribe(res => { this.totalUsers = res.total_users; this.updateUserCards(); });

    this.metricasService.getActiveUsers(empresaId, from, to)
      .subscribe(res => { this.activeUsers = res.active_users; this.updateUserCards(); });

    this.metricasService.getNewUsers(empresaId, from, to, groupBy)
      .subscribe((data: UserMetricPeriod[]) => {
        this.newUsers = data;
        this.newUsersThisMonth = data.find(d => d.period === this.currentMonth)?.new_users || 0;
        this.updateChart(this.newUsersChart, data.map(d => d.period), data.map(d => d.new_users));
        this.updateUserCards();
      });

    this.metricasService.getLastLogin(empresaId, from, to, groupBy)
      .subscribe((data: LoginMetricPeriod[]) => {
        this.lastLogins = data;
        this.loginsThisMonth = data.find(d => d.period === this.currentMonth)?.logins || 0;
        this.updateChart(this.loginsChart, data.map(d => d.period), data.map(d => d.logins));
        this.updateUserCards();
      });

    this.metricasService.getTotalCompanies()
      .subscribe(res => this.totalCompanies = res.total_companies);

    this.metricasService.getNewCompanies(from, to, groupBy)
      .subscribe((data: CompanyMetricPeriod[]) => {
        this.newCompanies = data;
        this.newCompaniesThisMonth = data.find(d => d.period === this.currentMonth)?.new_companies || 0;
      });

    this.metricasService.getAverageDuration(empresaId, from, to)
      .subscribe(res => { this.averageDuration = res.average_duration; this.updateJornadaCards(); });

    this.metricasService.getLateRate(empresaId, from, to, groupBy)
      .subscribe((data: RateMetricPeriod[]) => {
        this.lateRates = data;
        this.lateRatesThisMonth = data.find(d => d.period === this.currentMonth)?.late_rate || 0;
        this.updateChart(this.lateChart, data.map(d => d.period), data.map(d => d.late_rate ?? 0));
        this.updateJornadaCards();
      });

    this.metricasService.getComplianceRate(empresaId, from, to, groupBy)
      .subscribe((data: RateMetricPeriod[]) => {
        this.complianceRates = data;
        this.complianceRatesThisMonth = data.find(d => d.period === this.currentMonth)?.compliance_rate || 0;
        this.updateChart(this.complianceChart, data.map(d => d.period), data.map(d => d.compliance_rate ?? 0));
        this.updateJornadaCards();
      });

    this.metricasService.getTotalMinutes(empresaId, from, to, groupBy)
      .subscribe((data: RateMetricPeriod[]) => {
        this.totalMinutes = data;
        this.totalMinutesThisMonth = data.find(d => d.period === this.currentMonth)?.total_minutes || 0;
        this.updateJornadaCards();
      });

    this.metricasService.getAverageTramosCount(empresaId, from, to)
      .subscribe(res => { this.averageTramosCount = res.average_count; this.updateJornadaCards(); });

    this.metricasService.getDurationDistribution(empresaId, from, to)
      .subscribe((data: DurationBucket[]) => {
        this.durationDistribution = data;
        this.updateChart(this.durationChart, data.map(d => d.bucket.toString()), data.map(d => d.count));
      });

    const LOW_THRESHOLD = 10;
    const CRITICAL_THRESHOLD = 3;

    this.metricasService.getStockLevels(empresaId)
      .subscribe((data: ProductStock[]) => {
        this.stockLevels = data;
        this.lowStockCount = data.filter(p => p.cantidad < LOW_THRESHOLD).length;
        this.criticalStockCount = data.filter(p => p.cantidad < CRITICAL_THRESHOLD).length;
        this.updateInventoryCards();
      });

    this.metricasService.getTotalStockValue(empresaId)
      .subscribe(res => { this.totalStockValue = res.inventory_value; this.updateInventoryCards(); });

    this.metricasService.getProductsByCategory(empresaId)
      .subscribe((data: CategoryStock[]) => {
        this.productsByCategory = data;
        this.updateInventoryCards();
      });

    this.loadingSummary = false;
  }

  private updateChart(chart: Chart | undefined, labels: string[], data: number[]): void {
    if (!chart) { return; }
    chart.data.labels = labels;
    chart.data.datasets![0].data = data;
    chart.update();
  }

  private updateUserCards(): void {
    if (!this.totalUsers) { return; }
    this.userCards = [
      { title: 'Usuarios Activos', value: this.activeUsers, sub: `${(this.activeUsers / this.totalUsers * 100).toFixed(1)}%`, isPositive: true },
      { title: 'Nuevos Usuarios', value: this.newUsersThisMonth, sub: 'Este mes' },
      { title: 'Últimos Logins', value: this.loginsThisMonth, sub: 'Este mes' },
      { title: 'Retención', value: `${((this.loginsThisMonth / this.totalUsers) * 100).toFixed(1)}%`, sub: '' }
    ];
  }

  private updateJornadaCards(): void {
    const late = this.lateRatesThisMonth ?? 0;
    const comp = this.complianceRatesThisMonth ?? 0;
    const mins = this.totalMinutesThisMonth ?? 0;
    const trams = this.averageTramosCount ?? 0;

    this.jornadaCards = [
      { title: 'Puntualidad', value: `${(100 - late).toFixed(1)}%`, sub: `${late.toFixed(1)}% tarde` },
      { title: 'Cumplimiento', value: `${comp.toFixed(1)}%`, sub: '' },
      { title: 'Minutos Totales', value: `${mins}`, sub: 'Este mes' },
      { title: 'Tramos/Jornada', value: `${trams.toFixed(2)}`, sub: 'Promedio' }
    ];
  }

  private updateInventoryCards(): void {
    this.inventoryCards = [
      { title: 'Valor Inventario', value: `$${(this.totalStockValue / 1e6).toFixed(1)}M`, sub: '' },
      { title: 'Productos', value: this.stockLevels.length, sub: 'En inventario' },
      { title: 'Stock Bajo', value: this.lowStockCount, sub: '' },
      { title: 'Stock Crítico', value: this.criticalStockCount, sub: '' }
    ];
  }

  private initChart(canvas: HTMLCanvasElement, type: any, label: string): Chart {
    return new Chart(canvas, {
      type,
      data: { labels: [], datasets: [{ label, data: [] }] },
      options: { responsive: true }
    });
  }

  private getCurrentMonth(): string {
    const now = new Date();
    return `${now.getFullYear()}-${String(now.getMonth() + 1).padStart(2, '0')}-01`;
  }
}
