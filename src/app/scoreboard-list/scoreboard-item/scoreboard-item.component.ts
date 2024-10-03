// scoreboard-item.component.ts
import { CommonModule } from '@angular/common';
import { Component, Input } from '@angular/core';

@Component({
  selector: 'app-scoreboard-item',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './scoreboard-item.component.html',
  styleUrls: ['./scoreboard-item.component.css']
})
export class ScoreboardItemComponent {
  @Input() rank!: number;
  @Input() profilePicture!: string;
  @Input() name!: string;
  @Input() position!: string;
  @Input() score!: number;
  @Input() scoreLevel!: string;

  getGradient(scoreLevel: string): string {
    if (scoreLevel === 'Explorer') {
      return 'linear-gradient(to left, rgba(50,42,125,255), rgb(255, 255, 255) 35%)';
    }
    else if(scoreLevel === 'Dynamo'){
      return 'linear-gradient(to left, rgba(71,189,163,255), rgb(255, 255, 255) 35%)';
    }
    else if(scoreLevel === 'Pioneer'){
      return 'linear-gradient(to left, rgba(82,193,236,255), rgb(255, 255, 255) 35%)';   
    }
    else if(scoreLevel === 'Legend'){
      return 'linear-gradient(to left, rgba(227,23,144,255), rgb(255, 255, 255) 35%)';   
    }
    else{
      return 'linear-gradient(to left, rgba(246,180,24,255), rgb(255, 255, 255) 35%)';
    }
    
  }
}
