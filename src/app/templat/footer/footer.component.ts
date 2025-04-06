import { Component, OnInit, ViewChild, ElementRef, HostListener } from '@angular/core';

@Component({
  selector: 'app-footer',
  templateUrl: './footer.component.html',
  styleUrls: ['./footer.component.css']
})
export class FooterComponent implements OnInit {
  @ViewChild('scrollToTopButton') scrollToTopButton: ElementRef | undefined;

  ngOnInit() {
    // L'initialisation est vide, tout est géré via le scroll
  }

  // Utilisation de HostListener pour détecter le scroll
  @HostListener('window:scroll', [])
  onScroll() {
    // Vérifie si le scroll dépasse 400px
    if (window.scrollY > 400) {
      this.scrollToTopButton?.nativeElement.classList.add('show');
    } else {
      this.scrollToTopButton?.nativeElement.classList.remove('show');
    }
  }

  // Fonction pour faire défiler la page jusqu'en haut
  scrollToTop() {
    window.scrollTo({
      top: 0,
      behavior: 'smooth'
    });
  }
}
