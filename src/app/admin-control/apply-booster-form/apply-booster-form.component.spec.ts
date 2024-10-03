import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ApplyBoosterFormComponent } from './apply-booster-form.component';

describe('ApplyBoosterFormComponent', () => {
  let component: ApplyBoosterFormComponent;
  let fixture: ComponentFixture<ApplyBoosterFormComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [ApplyBoosterFormComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(ApplyBoosterFormComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
