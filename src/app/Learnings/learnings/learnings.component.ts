import { Component, OnInit } from '@angular/core';
import { LearningsService } from '../learnings.service';

@Component({
  selector: 'app-learnings',
  templateUrl: './learnings.component.html',
  styleUrls: ['./learnings.component.css']
})
export class LearningsComponent implements OnInit {
  learnings: any[] = [];

  constructor(private learningsService: LearningsService) {}

  ngOnInit() {
    this.learningsService.getAllLearnings().subscribe(data => {
      this.learnings = data;
    });
  }
}
