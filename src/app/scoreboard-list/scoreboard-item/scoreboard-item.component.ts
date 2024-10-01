// scoreboard-item.component.ts
import { Component, Input } from '@angular/core';

@Component({
  selector: 'app-scoreboard-item',
  standalone: true,
  imports: [],
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
}
