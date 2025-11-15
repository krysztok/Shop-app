import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ProductImagesTabComponent } from './product-images-tab.component';

describe('ProductImagesTabComponent', () => {
  let component: ProductImagesTabComponent;
  let fixture: ComponentFixture<ProductImagesTabComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ProductImagesTabComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(ProductImagesTabComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
