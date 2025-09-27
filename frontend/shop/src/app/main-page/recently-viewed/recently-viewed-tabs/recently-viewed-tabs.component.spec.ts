import { ComponentFixture, TestBed } from '@angular/core/testing';

import { RecentlyViewedTabsComponent } from './recently-viewed-tabs.component';

describe('RecentlyViewedTabsComponent', () => {
  let component: RecentlyViewedTabsComponent;
  let fixture: ComponentFixture<RecentlyViewedTabsComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [RecentlyViewedTabsComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(RecentlyViewedTabsComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
