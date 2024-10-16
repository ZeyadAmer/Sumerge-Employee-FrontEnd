import { Injectable } from '@angular/core';
import { User, Score, UserDTO, ScoreboardLevel } from '../scoreboard-list/user.model';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { CookieService } from 'ngx-cookie-service';
import { Router } from '@angular/router';
import { catchError, map, of, forkJoin, Observable, switchMap } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class AuthService {
  userScores: Score[] = [];
  rank: number = 1;
  numberOfSlides: number = 1;
  scoreboardLevels: string[] = [];
  users: User[] = [];

  private baseUrl = 'http://localhost:8081';

  constructor(private http: HttpClient, private cookieService: CookieService, private router: Router) {}

  logout(): void {
    this.cookieService.delete('authToken');
    this.router.navigate(['/login']);
  }

  retrieveNumberOfSlides() {
    const token = this.cookieService.get('authToken');
    const headers = new HttpHeaders({
      'Authorization': `Bearer ${token}`
    });

    return this.http.get<{ levels: number }>(`${this.baseUrl}/scoreboardLevels/count`, { headers }).pipe(
      map(response => {
        this.numberOfSlides = response?.levels ?? 1;
        console.log(this.numberOfSlides);
        return this.numberOfSlides;
      }),
      catchError(error => {
        console.error('Error fetching levels:', error);
        this.numberOfSlides = 1; 
        return of(this.numberOfSlides);
      })
    );
  }

  retrieveScoreBoardLevels() {
    const token = this.cookieService.get('authToken');
    const headers = new HttpHeaders({
      'Authorization': `Bearer ${token}`
    });

    return this.http.get<ScoreboardLevel[]>(`${this.baseUrl}/scoreboardLevels/all`, { headers }).pipe(
      map(response => {
        this.scoreboardLevels = Array.isArray(response) ? response.map(level => level.levelName) : [];
        console.log(this.scoreboardLevels);
        return this.scoreboardLevels;
      }),
      catchError(error => {
        console.error('Error fetching scoreboard levels:', error);
        return of([]);
      })
    );
  }

  retrieveUserLearning(): Observable<User[]> {
    this.users = [];
    const token = this.cookieService.get('authToken');
    const headers = new HttpHeaders({
      'Authorization': `Bearer ${token}`
    });
  
    return this.http.get<Score[]>('http://localhost:8081/userScores/all', { headers }).pipe(
      switchMap(response => {
        this.userScores = response || [];
        console.log(this.userScores);
        
        this.rank = 1;
  
        return forkJoin(this.userScores.map((element) => {
          const ScoreLevelUrl = `http://localhost:8081/scoreboardLevels/levelName/${element.score}`;
          const userUrl = `http://localhost:8080/users/${element.id}`;
  
          return this.http.get<{ levelName: string }>(ScoreLevelUrl, { headers }).pipe(
            switchMap(levelResponse => {
              const scoreLevel = levelResponse?.levelName;
  
              if (!scoreLevel) {
                console.error('No score level found for score:', element.score);
                return of(null);
              }
  
              return this.http.get<UserDTO>(userUrl, { headers }).pipe(
                map(userResponse => {
                  if (!userResponse) {
                    console.error('No user found for ID:', element.id);
                    return null; 
                  }
  
                  return {
                    rank: this.rank,
                    profilePicture: 'https://via.placeholder.com/50',
                    name: `${userResponse.firstName} ${userResponse.lastName}`,
                    position: userResponse.title.name,
                    score: element.score,
                    scoreLevel: scoreLevel
                  } as User;
                })
              );
            }),
            catchError(error => {
              console.error('Error occurred while fetching level name or user:', error);
              return of(null);
            })
          );
        })).pipe(
          map(users => users.filter(user => user !== null) as User[])
        );
      })
    );
  }
  
}
