import { ComponentFixture, TestBed } from '@angular/core/testing';

import { SelectGridComponent } from './select-grid.component';

describe('SelectGridComponent', () => {
  let component: SelectGridComponent;
  let fixture: ComponentFixture<SelectGridComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [SelectGridComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(SelectGridComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
