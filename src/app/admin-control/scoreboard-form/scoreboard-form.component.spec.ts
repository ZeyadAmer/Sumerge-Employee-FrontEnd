import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ScoreboardFormComponent } from './scoreboard-form.component';

describe('ScoreboardFormComponent', () => {
  let component: ScoreboardFormComponent;
  let fixture: ComponentFixture<ScoreboardFormComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [ScoreboardFormComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(ScoreboardFormComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
