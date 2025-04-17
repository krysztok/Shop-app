import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ProductCompareDialogComponent } from './product-compare-dialog.component';

describe('ProductCompareDialogComponent', () => {
  let component: ProductCompareDialogComponent;
  let fixture: ComponentFixture<ProductCompareDialogComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ProductCompareDialogComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(ProductCompareDialogComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
