import { ComponentFixture, TestBed } from '@angular/core/testing';

import { AdminClientsViewComponent } from './admin-clients-view.component';

describe('AdminClientsViewComponent', () => {
  let component: AdminClientsViewComponent;
  let fixture: ComponentFixture<AdminClientsViewComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [AdminClientsViewComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(AdminClientsViewComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
