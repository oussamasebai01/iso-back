import { HttpClient } from '@angular/common/http';
import { Component } from '@angular/core';

@Component({
  selector: 'app-features',
  templateUrl: './features.component.html',
  styleUrls: ['./features.component.css']
})
export class FeaturesComponent {
  nonConformances: any[] = [];
  images: string[] = [
    'assets/imgs/features-01.jpg',
    'assets/imgs/features-02.jpg',
    'assets/imgs/features-03.jpg'
  ];
  boxClasses: string[] = ['quality', 'time', 'passion'];

  constructor(private http: HttpClient) {}

  ngOnInit() {
    this.loadNonConformances();
  }

  loadNonConformances() {
    this.http.get<any[]>('http://localhost:8070/api/non-conformances').subscribe(
      (res) => {
        // Attribution successive d’images
        this.nonConformances = res.map((nc, i) => ({
          ...nc,
          image: this.images[i % this.images.length],
          class: this.boxClasses[i % this.boxClasses.length]
        }));
      },
      (err) => {
        console.error('Erreur lors du chargement des non-conformités :', err);
      }
    );
  }
}
