import { ComponentFixture, TestBed } from '@angular/core/testing';

import { AdminProductShowImageComponent } from './admin-product-show-image.component';

describe('AdminProductShowImageComponent', () => {
  let component: AdminProductShowImageComponent;
  let fixture: ComponentFixture<AdminProductShowImageComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [AdminProductShowImageComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(AdminProductShowImageComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
