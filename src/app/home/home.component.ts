import { Component } from '@angular/core';
import { ScoreboardListComponent } from '../scoreboard-list/scoreboard-list.component';

@Component({
  selector: 'app-home',
  standalone: true,
  imports: [ScoreboardListComponent],
  templateUrl: './home.component.html',
  styleUrl: './home.component.css'
})
export class HomeComponent {

}
