import { ComponentFixture, TestBed } from '@angular/core/testing';

import { AdminFilterDeleteComponent } from './admin-filter-delete.component';

describe('AdminFilterDeleteComponent', () => {
  let component: AdminFilterDeleteComponent;
  let fixture: ComponentFixture<AdminFilterDeleteComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [AdminFilterDeleteComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(AdminFilterDeleteComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
