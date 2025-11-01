import { ComponentFixture, TestBed } from '@angular/core/testing';

import { AdminShopsEditComponent } from './admin-shops-edit.component';

describe('AdminShopsEditComponent', () => {
  let component: AdminShopsEditComponent;
  let fixture: ComponentFixture<AdminShopsEditComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [AdminShopsEditComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(AdminShopsEditComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
