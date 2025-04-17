import { ComponentFixture, TestBed } from '@angular/core/testing';

import { CartProductComponentComponent } from './cart-product-component.component';

describe('CartProductComponentComponent', () => {
  let component: CartProductComponentComponent;
  let fixture: ComponentFixture<CartProductComponentComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [CartProductComponentComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(CartProductComponentComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
