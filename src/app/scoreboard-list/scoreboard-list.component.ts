// scoreboard-list.component.ts
import { Component, OnInit } from '@angular/core';
import { ScoreboardItemComponent } from './scoreboard-item/scoreboard-item.component';
import { User } from './user.model'; // Import the User model
import { CommonModule } from '@angular/common';

@Component({
  selector: 'app-scoreboard-list',
  standalone: true,
  imports: [ScoreboardItemComponent, CommonModule],
  templateUrl: './scoreboard-list.component.html',
  styleUrls: ['./scoreboard-list.component.css']
})
export class ScoreboardListComponent implements OnInit{
  // Dummy user data
  users: User[] = [
    {
      rank: 1,
      profilePicture: 'https://via.placeholder.com/50',
      name: 'Manar Adel',
      position: 'Associate Software Engineer',
      score: 70,
      scoreLevel: 'Beginner'
    },
    {
      rank: 2,
      profilePicture: 'https://via.placeholder.com/50',
      name: 'Zeyad Hesham',
      position: 'Associate Software Engineer',
      score: 89,
      scoreLevel: 'Intermediate'
    },
    {
      rank: 3,
      profilePicture: 'https://via.placeholder.com/50',
      name: 'Jane Smith',
      position: 'Project Manager',
      score: 85,
      scoreLevel: 'Intermediate'
    },
    {
      rank: 4,
      profilePicture: 'https://via.placeholder.com/50',
      name: 'Jane Smith',
      position: 'Project Manager',
      score: 85,
      scoreLevel: 'Intermediate'
    },
    {
      rank: 5,
      profilePicture: 'https://via.placeholder.com/50',
      name: 'Jane Smith',
      position: 'Project Manager',
      score: 85,
      scoreLevel: 'Intermediate'
    },
    {
      rank: 6,
      profilePicture: 'https://via.placeholder.com/50',
      name: 'Jane Smith',
      position: 'Project Manager',
      score: 85,
      scoreLevel: 'Intermediate'
    },
    {
      rank: 7,
      profilePicture: 'https://via.placeholder.com/50',
      name: 'Jane Smith',
      position: 'Project Manager',
      score: 85,
      scoreLevel: 'Intermediate'
    },
    {
      rank: 8,
      profilePicture: 'https://via.placeholder.com/50',
      name: 'Jane Smith',
      position: 'Project Manager',
      score: 85,
      scoreLevel: 'Intermediate'
    },
  ];

  ngOnInit() {
    console.log('ScoreboardListComponent initialized with users:', this.users);
  }
}
