import { ComponentFixture, TestBed } from '@angular/core/testing';

import { AdminCategoryImageComponent } from './admin-category-image.component';

describe('AdminCategoryImageComponent', () => {
  let component: AdminCategoryImageComponent;
  let fixture: ComponentFixture<AdminCategoryImageComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [AdminCategoryImageComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(AdminCategoryImageComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
