import { ComponentFixture, TestBed } from '@angular/core/testing';

import { AdminBackComponent } from './admin-back.component';

describe('AdminBackComponent', () => {
  let component: AdminBackComponent;
  let fixture: ComponentFixture<AdminBackComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [AdminBackComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(AdminBackComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
