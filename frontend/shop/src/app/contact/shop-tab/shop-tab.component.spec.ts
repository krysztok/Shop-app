import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ShopTabComponent } from './shop-tab.component';

describe('ShopTabComponent', () => {
  let component: ShopTabComponent;
  let fixture: ComponentFixture<ShopTabComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ShopTabComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(ShopTabComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
