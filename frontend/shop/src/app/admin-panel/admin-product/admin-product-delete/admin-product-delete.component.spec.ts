import { ComponentFixture, TestBed } from '@angular/core/testing';

import { AdminProductDeleteComponent } from './admin-product-delete.component';

describe('AdminProductDeleteComponent', () => {
  let component: AdminProductDeleteComponent;
  let fixture: ComponentFixture<AdminProductDeleteComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [AdminProductDeleteComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(AdminProductDeleteComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
