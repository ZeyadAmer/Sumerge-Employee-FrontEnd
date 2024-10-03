import { Injectable } from '@angular/core';
import { ScoreboardItemComponent } from '../scoreboard-list/scoreboard-item/scoreboard-item.component';
import { User , Score, UserDTO, ScoreboardLevel } from '../scoreboard-list/user.model'; // Import the User model
import { CommonModule } from '@angular/common';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { CookieService } from 'ngx-cookie-service';

@Injectable({
  providedIn: 'root'
})
export class AuthService {
  userScores: Score[] = [];
  rank: number = 1;
  numberOfSlides: number = 1;
  scoreboardLevels: string[] = [];
    scoreLevel: string="";
  users: User[] = [];
  constructor(private http: HttpClient,private cookieService: CookieService) { }


   logout(){
    this.cookieService.delete('authToken');

   }
async retrieveNumberOfSlides():Promise<number>{
  try {
    const token = this.cookieService.get('authToken');
    const headers = new HttpHeaders({
      'Authorization': `Bearer ${token}`
    });
    
    const response = await this.http.get<{ levels: number; }>("http://localhost:8081/scoreboardLevels/count", { headers }).toPromise();
    console.log(response?.levels);
    this.numberOfSlides = response?.levels ?? 1; 
} catch (error) {
    console.error('Error fetching levels:', error);
    this.numberOfSlides = 1; 
}
return this.numberOfSlides;
}
async retrieveScoreBoardLevels():Promise<string[]>{
  const token = this.cookieService.get('authToken');
  const headers = new HttpHeaders({
    'Authorization': `Bearer ${token}`
  });
  
  try {
    const response = await this.http.get<ScoreboardLevel[]>("http://localhost:8081/scoreboardLevels/all", { headers }).toPromise();

    if (response && Array.isArray(response)) {
      this.scoreboardLevels = response.map(level => level.levelName);
  } else {
      console.warn('Response is not defined or is not an array:', response);
  }
    console.log(this.scoreboardLevels); // Log the extracted level names
} catch (error) {
    console.error('Error fetching scoreboard levels:', error);
}
return this.scoreboardLevels;
}

  async retrieveUserLearning(): Promise<User[]> {
    this.users = [];
    const token = this.cookieService.get('authToken');
    const headers = new HttpHeaders({
      'Authorization': `Bearer ${token}`
    });
    
 
    
    
  
    try {
      const response = await this.http.get<Score[]>("http://localhost:8081/userScores/all", { headers }).toPromise();
      
      // Check if response is defined and assign to userScores
      this.userScores = response || [];
      console.log(this.userScores);
  
      // Initialize users array and rank
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
  
          // Create a user object with rank, profile, and other details
          const user: User = {
            rank: this.rank,
            profilePicture: 'https://via.placeholder.com/50',
            name: `${userResponse.firstName} ${userResponse.lastName}`,
            position: userResponse.title.name,
            score: element.score,
            scoreLevel: scoreLevel 
          };
  
          // Add user to the users array
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
    return this.users;
  }

  //onn submit admin controls add booster

  // on submit admin controls add scoreboard level
  
  
}
