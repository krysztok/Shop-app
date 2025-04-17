import { ComponentFixture, TestBed } from '@angular/core/testing';

import { OrderSubmitedComponent } from './order-submited.component';

describe('OrderSubmitedComponent', () => {
  let component: OrderSubmitedComponent;
  let fixture: ComponentFixture<OrderSubmitedComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [OrderSubmitedComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(OrderSubmitedComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
