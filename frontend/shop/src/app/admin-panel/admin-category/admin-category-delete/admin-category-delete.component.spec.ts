import { ComponentFixture, TestBed } from '@angular/core/testing';

import { AdminCategoryDeleteComponent } from './admin-category-delete.component';

describe('AdminCategoryDeleteComponent', () => {
  let component: AdminCategoryDeleteComponent;
  let fixture: ComponentFixture<AdminCategoryDeleteComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [AdminCategoryDeleteComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(AdminCategoryDeleteComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
