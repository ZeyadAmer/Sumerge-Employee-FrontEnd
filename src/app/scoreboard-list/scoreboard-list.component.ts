// scoreboard-list.component.ts
import { Component, OnInit } from '@angular/core';
import { ScoreboardItemComponent } from './scoreboard-item/scoreboard-item.component';
import { User , Score, UserDTO } from './user.model'; // Import the User model
import { CommonModule } from '@angular/common';
import { HttpClient, HttpHeaders } from '@angular/common/http';



@Component({
  selector: 'app-scoreboard-list',
  standalone: true,
  imports: [ScoreboardItemComponent, CommonModule],
  templateUrl: './scoreboard-list.component.html',
  styleUrls: ['./scoreboard-list.component.css']
})
export class ScoreboardListComponent implements OnInit{
  // Dummy user data
  users: User[] = [];
  userScores: Score[] = [];
  rank: number = 1;
  scoreLevel: string="";
  
constructor(private http: HttpClient) {}

async ngOnInit() {
  const token = 'eyJhbGciOiJIUzI1NiJ9.eyJzdWIiOiJhZWxoZW1hbHlAc3VtZXJnZS5jb20iLCJyb2xlIjoiUk9MRV9BRE1JTiIsImV4cCI6MTcyNzk0ODAyMiwidXNlcklkIjo2LCJpYXQiOjE3Mjc4NjE2MjJ9.j9im6VIOj0LcxqySrgMJCAk15GyRmZmGxT0_EnKOzjI';
  const headers = new HttpHeaders({
    'Authorization': `Bearer ${token}`
  });

  try {
    const response = await this.http.get<Score[]>("http://localhost:8081/userScores/all", { headers }).toPromise();
    
    // Check if response is defined and assign to userScores
    this.userScores = response || [];
    console.log(this.userScores);

    // Initialize users array and rank
    this.users = [];
    this.rank = 1; // Adjust starting rank as needed

    // Fetch user details and levels in order
    for (const element of this.userScores) {
      const ScoreLevelUrl = `http://localhost:8081/scoreboardLevels/levelName/${element.score}`;
      const userUrl = `http://localhost:8080/users/${element.id}`;

      try {
        // Fetch level name
        const levelResponse = await this.http.get<{ levelName: string }>(ScoreLevelUrl, { headers }).toPromise();
        const scoreLevel = levelResponse?.levelName; 
        if (!scoreLevel) {
          console.error('No score level found for score:', element.score);
          continue; 
        }
        console.log('Level name:', scoreLevel);

        // Fetch user details
        const userResponse = await this.http.get<UserDTO>(userUrl, { headers }).toPromise();
        if (!userResponse) {
          console.error('No user found for ID:', element.id);
          continue; 
        }
        console.log('User details:', userResponse);

        const user = {
          rank: this.rank,
          profilePicture: 'https://via.placeholder.com/50',
          name: `${userResponse.firstName} ${userResponse.lastName}`,
          position: userResponse.title.name,
          score: element.score,
          scoreLevel: scoreLevel 
        };

        this.users.push(user);
        this.rank++;
      } catch (error) {
        console.error('Error occurred while fetching level name or user:', error);
      }
    }
  } catch (error) {
    console.error('Error occurred while fetching scores:', error);
  }

  console.log('ScoreboardListComponent initialized with users:', this.users);
}



}