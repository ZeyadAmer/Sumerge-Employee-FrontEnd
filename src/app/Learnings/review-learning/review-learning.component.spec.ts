import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ReviewLearningComponent } from './review-learning.component';

describe('ReviewLearningComponent', () => {
  let component: ReviewLearningComponent;
  let fixture: ComponentFixture<ReviewLearningComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [ReviewLearningComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(ReviewLearningComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
