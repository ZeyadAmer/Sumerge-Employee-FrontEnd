import { Component } from '@angular/core';
import { ScoreboardItemComponent } from './scoreboard-item/scoreboard-item.component';

@Component({
  selector: 'app-scoreboard-list',
  standalone: true,
  imports: [ScoreboardItemComponent],
  templateUrl: './scoreboard-list.component.html',
  styleUrl: './scoreboard-list.component.css'
})
export class ScoreboardListComponent {

}
