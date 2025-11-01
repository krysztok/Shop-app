import { ComponentFixture, TestBed } from '@angular/core/testing';

import { AdminShopsDeleteComponent } from './admin-shops-delete.component';

describe('AdminShopsDeleteComponent', () => {
  let component: AdminShopsDeleteComponent;
  let fixture: ComponentFixture<AdminShopsDeleteComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [AdminShopsDeleteComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(AdminShopsDeleteComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
