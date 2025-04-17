import { ComponentFixture, TestBed } from '@angular/core/testing';

import { SubCategoriesTabsComponent } from './sub-categories-tabs.component';

describe('SubCategoriesTabsComponent', () => {
  let component: SubCategoriesTabsComponent;
  let fixture: ComponentFixture<SubCategoriesTabsComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [SubCategoriesTabsComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(SubCategoriesTabsComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
