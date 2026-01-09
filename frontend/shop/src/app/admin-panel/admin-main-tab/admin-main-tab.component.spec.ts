import { ComponentFixture, TestBed } from '@angular/core/testing';

import { AdminMainTabComponent } from './admin-main-tab.component';

describe('AdminMainTabComponent', () => {
  let component: AdminMainTabComponent;
  let fixture: ComponentFixture<AdminMainTabComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [AdminMainTabComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(AdminMainTabComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
