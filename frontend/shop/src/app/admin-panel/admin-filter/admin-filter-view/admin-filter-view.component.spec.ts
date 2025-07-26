import { ComponentFixture, TestBed } from '@angular/core/testing';

import { AdminFilterViewComponent } from './admin-filter-view.component';

describe('AdminFilterViewComponent', () => {
  let component: AdminFilterViewComponent;
  let fixture: ComponentFixture<AdminFilterViewComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [AdminFilterViewComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(AdminFilterViewComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
