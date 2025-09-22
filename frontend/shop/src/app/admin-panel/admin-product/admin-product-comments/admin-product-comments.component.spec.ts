import { ComponentFixture, TestBed } from '@angular/core/testing';

import { AdminProductCommentsComponent } from './admin-product-comments.component';

describe('AdminProductCommentsComponent', () => {
  let component: AdminProductCommentsComponent;
  let fixture: ComponentFixture<AdminProductCommentsComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [AdminProductCommentsComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(AdminProductCommentsComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
