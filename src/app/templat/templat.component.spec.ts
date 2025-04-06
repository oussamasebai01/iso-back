import { ComponentFixture, TestBed } from '@angular/core/testing';

import { TemplatComponent } from './templat.component';

describe('TemplatComponent', () => {
  let component: TemplatComponent;
  let fixture: ComponentFixture<TemplatComponent>;

  beforeEach(() => {
    TestBed.configureTestingModule({
      declarations: [TemplatComponent]
    });
    fixture = TestBed.createComponent(TemplatComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
