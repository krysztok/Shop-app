import { ComponentFixture, TestBed } from '@angular/core/testing';

import { OrderStatusTabComponent } from './order-status-tab.component';

describe('OrderStatusTabComponent', () => {
  let component: OrderStatusTabComponent;
  let fixture: ComponentFixture<OrderStatusTabComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [OrderStatusTabComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(OrderStatusTabComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
