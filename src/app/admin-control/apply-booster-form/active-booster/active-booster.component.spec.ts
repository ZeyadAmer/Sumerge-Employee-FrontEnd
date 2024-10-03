import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ActiveBoosterComponent } from './active-booster.component';

describe('ActiveBoosterComponent', () => {
  let component: ActiveBoosterComponent;
  let fixture: ComponentFixture<ActiveBoosterComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [ActiveBoosterComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(ActiveBoosterComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
