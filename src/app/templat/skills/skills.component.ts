import { Component, OnInit, ViewChild, ViewChildren, QueryList, ElementRef, HostListener } from '@angular/core';

@Component({
  selector: 'app-skills',
  templateUrl: './skills.component.html',
  styleUrls: ['./skills.component.css']
})
export class SkillsComponent implements OnInit {
  @ViewChild('skillsSection') skillsSection: ElementRef | undefined;
  @ViewChildren('progressSpans') progressSpans: QueryList<ElementRef> | undefined;
  private started = false; // Pour éviter de redémarrer l'animation des skills

  ngOnInit(): void {
    // Initialisation, rien à faire pour le moment
  }

  @HostListener("window:scroll", [])
  onScroll() {
    const section = this.skillsSection?.nativeElement;
    const progressSpans = this.progressSpans?.toArray(); // Récupère le tableau d'éléments

    if (section && window.scrollY >= section.offsetTop - 250) {
      // Vérifie si la section skills est visible et si l'animation n'a pas encore démarré
      if (!this.started) {
        this.started = true;
        // Vérifie si progressSpans est défini avant d'essayer de l'utiliser
        if (progressSpans) {
          progressSpans.forEach((span: ElementRef) => {
            span.nativeElement.style.width = span.nativeElement.dataset.width;
          });
        }
      }
    }
  }
}
