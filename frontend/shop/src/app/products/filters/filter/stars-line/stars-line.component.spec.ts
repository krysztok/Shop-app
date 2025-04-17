import { ComponentFixture, TestBed } from '@angular/core/testing';

import { StarsLineComponent } from './stars-line.component';

describe('StarsLineComponent', () => {
  let component: StarsLineComponent;
  let fixture: ComponentFixture<StarsLineComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [StarsLineComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(StarsLineComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
