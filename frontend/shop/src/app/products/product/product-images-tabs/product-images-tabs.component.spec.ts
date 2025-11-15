import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ProductImagesTabsComponent } from './product-images-tabs.component';

describe('ProductImagesTabsComponent', () => {
  let component: ProductImagesTabsComponent;
  let fixture: ComponentFixture<ProductImagesTabsComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ProductImagesTabsComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(ProductImagesTabsComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
