// scoreboard-list.component.ts
import { Component, OnInit } from '@angular/core';
import { ScoreboardItemComponent } from './scoreboard-item/scoreboard-item.component';
import { CommonModule } from '@angular/common';
import { AuthService } from '../services/auth.service';
import { User } from './user.model';




@Component({
  selector: 'app-scoreboard-list',
  standalone: true,
  imports: [ScoreboardItemComponent, CommonModule],
  templateUrl: './scoreboard-list.component.html',
  styleUrls: ['./scoreboard-list.component.css']
})
export class ScoreboardListComponent implements OnInit{
  users: User[] = [];

  
constructor(private authService: AuthService) {}

async ngOnInit() {
  await this.authService.retrieveUserLearning();
  this.users = this.authService.users;
}



}