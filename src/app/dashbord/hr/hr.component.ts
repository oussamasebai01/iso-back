import { HttpClient } from '@angular/common/http';
import { Component, OnInit } from '@angular/core';
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
  roles: Role[] = [];
  currentRole: Role = { name: '' };
  editMode: boolean = false;
  private apiUrl = 'http://localhost:8070/api/roles';  // URL de votre API

  constructor(private http: HttpClient) { }

  ngOnInit(): void {
    this.loadRoles();
  }

  // Charger tous les rôles
  loadRoles(): void {
    this.http.get<Role[]>(this.apiUrl).subscribe(
      (data: Role[]) => this.roles = data,
      (error: any) => console.error('Erreur lors du chargement des rôles', error)
    );
  }

  // Soumettre le formulaire (ajout ou mise à jour)
  onSubmit(): void {
    if (this.editMode) {
      this.updateRole();
    } else {
      this.createRole();
    }
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
