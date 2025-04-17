import { ComponentFixture, TestBed } from '@angular/core/testing';

import { SubSubCategoryTabComponent } from './sub-sub-category-tab.component';

describe('SubSubCategoryTabComponent', () => {
  let component: SubSubCategoryTabComponent;
  let fixture: ComponentFixture<SubSubCategoryTabComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [SubSubCategoryTabComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(SubSubCategoryTabComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
