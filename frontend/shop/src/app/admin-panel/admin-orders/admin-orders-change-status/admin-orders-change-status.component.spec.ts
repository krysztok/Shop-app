import { ComponentFixture, TestBed } from '@angular/core/testing';

import { AdminOrdersChangeStatusComponent } from './admin-orders-change-status.component';

describe('AdminOrdersChangeStatusComponent', () => {
  let component: AdminOrdersChangeStatusComponent;
  let fixture: ComponentFixture<AdminOrdersChangeStatusComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [AdminOrdersChangeStatusComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(AdminOrdersChangeStatusComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
