import { Component, OnInit } from '@angular/core';
import { HttpClient } from '@angular/common/http';

@Component({
  selector: 'app-conformance',
  templateUrl: './conformance.component.html',
  styleUrls: ['./conformance.component.css']
})
export class ConformanceComponent implements OnInit {
  nonConformances: any[] = []; // Liste des non-conformités
  nonConformance: any = {
    title: '',
    description: '',
    status: 'OPEN',
    createdAt: '',
    updatedAt: '',
    assignedTo: ''
  };
  isEditMode: boolean = false;
  selectedNonConformanceId: string | null = null;

  constructor(private http: HttpClient) {}

  ngOnInit() {
    this.loadNonConformances(); // Charger les non-conformités au démarrage
  }

  // Charger toutes les non-conformités
  loadNonConformances() {
    this.http.get<any[]>('http://localhost:8070/api/non-conformances').subscribe(
      (res) => {
        this.nonConformances = res;
      },
      (err) => {
        console.error('Erreur lors du chargement des non-conformités :', err);
      }
    );
  }

  // Soumettre le formulaire (ajout ou mise à jour)
  onSubmit(formData: any) {
    // Ajuster les dates au format ISO pour correspondre à LocalDateTime
    formData.createdAt = formData.createdAt ? new Date(formData.createdAt).toISOString() : null;
    formData.updatedAt = formData.updatedAt ? new Date(formData.updatedAt).toISOString() : null;

    if (this.isEditMode) {
      // Mise à jour
      this.http.put(`http://localhost:8070/api/non-conformances/${this.selectedNonConformanceId}`, formData).subscribe(
        (response: any) => {
          console.log('Non-conformité mise à jour :', response);
          // Mettre à jour la liste localement
          const index = this.nonConformances.findIndex(nc => nc.id === this.selectedNonConformanceId);
          if (index !== -1) {
            this.nonConformances[index] = { ...response }; // Remplacer l'élément modifié
          }
          this.resetForm();
        },
        (error) => {
          console.error('Erreur lors de la mise à jour :', error);
          // Optionnel : Recharger si erreur pour rester synchronisé
          this.loadNonConformances();
        }
      );
    } else {
      // Ajout
      this.http.post('http://localhost:8070/api/non-conformances', formData).subscribe(
        (response: any) => {
          console.log('Non-conformité ajoutée :', response);
          // Ajouter la nouvelle non-conformité à la liste localement
          this.nonConformances.push(response);
          this.resetForm();
        },
        (error) => {
          console.error('Erreur lors de l’ajout :', error);
          // Optionnel : Recharger si erreur pour rester synchronisé
          this.loadNonConformances();
        }
      );
    }
  }

  editNonConformance(nonConformance: any) {
    this.isEditMode = true;
    this.selectedNonConformanceId = nonConformance.id;
    this.nonConformance = { ...nonConformance };
    this.nonConformance.createdAt = nonConformance.createdAt ? nonConformance.createdAt.slice(0, 16) : '';
    this.nonConformance.updatedAt = nonConformance.updatedAt ? nonConformance.updatedAt.slice(0, 16) : '';
  }

  // Supprimer une non-conformité
  deleteNonConformance(id: string) {
    if (confirm('Voulez-vous vraiment supprimer cette non-conformité ?')) {
      this.http.delete(`http://localhost:8070/api/non-conformances/${id}`).subscribe(
        (response) => {
          console.log('Non-conformité supprimée :', response);
          // Mettre à jour la liste localement
          this.nonConformances = this.nonConformances.filter(nc => nc.id !== id);
        },
        (error) => {
          console.error('Erreur lors de la suppression :', error);
          // Optionnel : Recharger si erreur pour rester synchronisé
          this.loadNonConformances();
        }
      );
    }
  }

  resetForm() {
    this.isEditMode = false;
    this.selectedNonConformanceId = null;
    this.nonConformance = {
      title: '',
      description: '',
      status: 'OPEN',
      createdAt: '',
      updatedAt: '',
      assignedTo: ''
    };
  }
}