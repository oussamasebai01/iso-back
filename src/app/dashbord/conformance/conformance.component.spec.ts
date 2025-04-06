import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ConformanceComponent } from './conformance.component';

describe('ConformanceComponent', () => {
  let component: ConformanceComponent;
  let fixture: ComponentFixture<ConformanceComponent>;

  beforeEach(() => {
    TestBed.configureTestingModule({
      declarations: [ConformanceComponent]
    });
    fixture = TestBed.createComponent(ConformanceComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
