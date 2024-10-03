import { ComponentFixture, TestBed } from '@angular/core/testing';

import { BoosterFormComponent } from './booster-form.component';

describe('BoosterFormComponent', () => {
  let component: BoosterFormComponent;
  let fixture: ComponentFixture<BoosterFormComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [BoosterFormComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(BoosterFormComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
