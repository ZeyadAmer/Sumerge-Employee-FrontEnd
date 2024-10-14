import { ComponentFixture, TestBed } from '@angular/core/testing';

import { BlogsApprovalComponent } from './blogs-approval.component';

describe('BlogsApprovalComponent', () => {
  let component: BlogsApprovalComponent;
  let fixture: ComponentFixture<BlogsApprovalComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [BlogsApprovalComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(BlogsApprovalComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
