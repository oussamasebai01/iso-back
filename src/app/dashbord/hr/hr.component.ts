import { HttpClient } from '@angular/common/http';
import { Component, OnInit } from '@angular/core';
import { ChartConfiguration, ChartData, ChartType } from 'chart.js';
import { DashboardData } from 'src/app/services/dashboard.service';
import { DashboardService } from '../../services/dashboard.service';
interface Role {
  id?: string;
  name: string;
  users?: any[];
}
@Component({
  selector: 'app-hr',
  templateUrl: './hr.component.html',
  styleUrls: ['./hr.component.css']
})
export class HrComponent implements OnInit{
  dashboardData: DashboardData | null = null;
  startDate = '2023-01-01';
  endDate = '2023-12-31';

  // Chart configurations
  barChartType: ChartType = 'bar';
  barChartOptions: ChartConfiguration['options'] = {
    responsive: true,
    scales: {
      y: {
        beginAtZero: true,
        max: 100
      }
    }
  };

  turnoverChartData: ChartData<'bar'> = { labels: [], datasets: [] };
  trainingChartData: ChartData<'bar'> = { labels: [], datasets: [] };
  performanceChartData: ChartData<'bar'> = { labels: [], datasets: [] };
  roles: Role[] = [];
  currentRole: Role = { name: '' };
  editMode: boolean = false;
  private apiUrl = 'http://localhost:8070/api/roles';  // URL de votre API

  constructor(private http: HttpClient,private dashboardService: DashboardService) { }

  ngOnInit(): void {
    this.loadRoles();
    this.loadDashboardData();
  }

  // Charger tous les rôles
  loadRoles(): void {
    this.http.get<Role[]>(this.apiUrl).subscribe(
      (data: Role[]) => this.roles = data,
      (error: any) => console.error('Erreur lors du chargement des rôles', error)
    );
  }
  loadDashboardData(): void {
    this.dashboardService.getDashboardData(this.startDate, this.endDate).subscribe({
      next: (data) => {
        this.dashboardData = data;
        this.updateCharts();
      },
      error: (err) => {
        console.error('Error fetching dashboard data:', err);
      }
    });
  }
  

  // Soumettre le formulaire (ajout ou mise à jour)
  onSubmit(): void {
    if (this.editMode) {
      this.updateRole();
    } else {
      this.createRole();
    }
  }
  updateCharts(): void {
    if (!this.dashboardData) return;

    const departments = Object.keys(this.dashboardData.departments);

    // Turnover Chart
    this.turnoverChartData = {
      labels: departments,
      datasets: [
        {
          label: 'Turnover Rate (%)',
          data: departments.map(dept => this.dashboardData!.departments[dept].turnoverRate),
          backgroundColor: 'rgba(255, 99, 132, 0.5)'
        }
      ]
    }
    this.trainingChartData = {
      labels: departments,
      datasets: [
        {
          label: 'Training Completion Rate (%)',
          data: departments.map(dept => this.dashboardData!.departments[dept].trainingCompletionRate),
          backgroundColor: 'rgba(54, 162, 235, 0.5)'
        }
      ]
    };

    // Performance Chart (average per department)
    this.performanceChartData = {
      labels: departments,
      datasets: [
        {
          label: 'Average Performance Score',
          data: departments.map(dept => {
            const metrics = this.dashboardData!.departments[dept].performanceMetrics;
            const scores = Object.values(metrics);
            return scores.length > 0 ? scores.reduce((a, b) => a + b, 0) / scores.length : 0;
          }),
          backgroundColor: 'rgba(75, 192, 192, 0.5)'
        }
      ]
    };
  }

  // Créer un rôle
  createRole(): void {
    this.http.post<Role>(this.apiUrl, this.currentRole).subscribe(
      (role: any) => {
        this.roles.push(role);
        this.resetForm();
      },
      (error: any) => console.error('Erreur lors de la création du rôle', error)
    );
  }

  // Mettre à jour un rôle
  updateRole(): void {
    if (this.currentRole.id) {
      this.http.put<Role>(`${this.apiUrl}/${this.currentRole.id}`, this.currentRole).subscribe(
        (updatedRole) => {
          const index = this.roles.findIndex(r => r.id === updatedRole.id);
          if (index !== -1) this.roles[index] = updatedRole;
          this.resetForm();
        },
        (error) => console.error('Erreur lors de la mise à jour du rôle', error)
      );
    }
  }

  // Supprimer un rôle
  deleteRole(id: string): void {
    if (confirm('Voulez-vous vraiment supprimer ce rôle ?')) {
      this.http.delete<void>(`${this.apiUrl}/${id}`).subscribe(
        () => this.roles = this.roles.filter(role => role.id !== id),
        (error) => console.error('Erreur lors de la suppression du rôle', error)
      );
    }
  }

  // Préparer la mise à jour d'un rôle
  editRole(role: Role): void {
    this.currentRole = { ...role };
    this.editMode = true;
  }

  // Réinitialiser le formulaire
  resetForm(): void {
    this.currentRole = { name: '' };
    this.editMode = false;
  }
}
