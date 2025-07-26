import { ComponentFixture, TestBed } from '@angular/core/testing';

import { AdminFilterAddComponent } from './admin-filter-add.component';

describe('AdminFilterAddComponent', () => {
  let component: AdminFilterAddComponent;
  let fixture: ComponentFixture<AdminFilterAddComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [AdminFilterAddComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(AdminFilterAddComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
