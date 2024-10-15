import { ComponentFixture, TestBed } from '@angular/core/testing';

import { SubmitLearningComponent } from './submit-learning.component';

describe('SubmitLearningComponent', () => {
  let component: SubmitLearningComponent;
  let fixture: ComponentFixture<SubmitLearningComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [SubmitLearningComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(SubmitLearningComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
