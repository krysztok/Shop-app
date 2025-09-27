import { ComponentFixture, TestBed } from '@angular/core/testing';

import { RecentlyViewedTabComponent } from './recently-viewed-tab.component';

describe('RecentlyViewedTabComponent', () => {
  let component: RecentlyViewedTabComponent;
  let fixture: ComponentFixture<RecentlyViewedTabComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [RecentlyViewedTabComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(RecentlyViewedTabComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
