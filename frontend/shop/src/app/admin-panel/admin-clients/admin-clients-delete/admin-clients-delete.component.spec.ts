import { ComponentFixture, TestBed } from '@angular/core/testing';

import { AdminClientsDeleteComponent } from './admin-clients-delete.component';

describe('AdminClientsDeleteComponent', () => {
  let component: AdminClientsDeleteComponent;
  let fixture: ComponentFixture<AdminClientsDeleteComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [AdminClientsDeleteComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(AdminClientsDeleteComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
