import { ComponentFixture, TestBed } from '@angular/core/testing';

import { SubmittedCareerPackageComponent } from './submitted-career-package.component';

describe('SubmittedCareerPackageComponent', () => {
  let component: SubmittedCareerPackageComponent;
  let fixture: ComponentFixture<SubmittedCareerPackageComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [SubmittedCareerPackageComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(SubmittedCareerPackageComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
