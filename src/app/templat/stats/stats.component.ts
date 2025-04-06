import { Component, OnInit, HostListener, ElementRef } from '@angular/core';

@Component({
  selector: 'app-stats',
  templateUrl: './stats.component.html',
  styleUrls: ['./stats.component.css']
})
export class StatsComponent implements OnInit {
  days: string = '00';
  hours: string = '00';
  minutes: string = '00';
  seconds: string = '00';
  showScrollButton: boolean = false;
  private started = false; // Pour éviter de redémarrer l'animation des stats

  constructor(private el: ElementRef) {}

  ngOnInit() {
    this.startCountdown();
  }

  startCountdown() {
    const countDownDate = new Date("Dec 31, 2025 23:59:59").getTime();

    setInterval(() => {
      let dateNow = new Date().getTime();
      let dateDiff = countDownDate - dateNow;

      let days = Math.floor(dateDiff / (1000 * 60 * 60 * 24));
      let hours = Math.floor((dateDiff % (1000 * 60 * 60 * 24)) / (1000 * 60 * 60));
      let minutes = Math.floor((dateDiff % (1000 * 60 * 60)) / (1000 * 60));
      let seconds = Math.floor((dateDiff % (1000 * 60)) / 1000);

      this.days = days < 10 ? `0${days}` : days.toString();
      this.hours = hours < 10 ? `0${hours}` : hours.toString();
      this.minutes = minutes < 10 ? `0${minutes}` : minutes.toString();
      this.seconds = seconds < 10 ? `0${seconds}` : seconds.toString();
    }, 1000);
  }

  @HostListener("window:scroll", [])
  onScroll() {
    const statsSection = this.el.nativeElement.querySelector(".stats");
    const progressSpans = this.el.nativeElement.querySelectorAll(".the-progress span");
    const scrollToTopButton = this.el.nativeElement.querySelector("#scrollToTop");

    if (window.scrollY > 400) {
      this.showScrollButton = true;
    } else {
      this.showScrollButton = false;
    }

    if (!this.started && statsSection && window.scrollY >= statsSection.offsetTop - 300) {
      this.animateStats();
      this.started = true;
    }

    if (progressSpans && window.scrollY >= statsSection.offsetTop - 250) {
      progressSpans.forEach((span: HTMLElement) => {
        span.style.width = span.dataset['width']!;
      });
    }
  }

  animateStats() {
    const nums = this.el.nativeElement.querySelectorAll(".stats .number");
    nums.forEach((num: HTMLElement) => {
      let goal = parseInt(num.dataset['goal']!, 10);  // Correction ici avec `['goal']`
      let count = 0;
      let increment = goal / 100;

      let interval = setInterval(() => {
        count += increment;
        num.textContent = Math.floor(count).toString();
        if (count >= goal) {
          num.textContent = goal.toString();
          clearInterval(interval);
        }
      }, 20);
    });
  }

  scrollToTop() {
    window.scrollTo({ top: 0, behavior: "smooth" });
  }
}
