import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ScoreboardListComponent } from './scoreboard-list.component';

describe('ScoreboardListComponent', () => {
  let component: ScoreboardListComponent;
  let fixture: ComponentFixture<ScoreboardListComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [ScoreboardListComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(ScoreboardListComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
