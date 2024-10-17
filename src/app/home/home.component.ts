import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { AuthService } from '../services/auth.service';
import { User } from '../scoreboard-list/user.model';
import { HeaderComponent } from "../header/header.component";
import { UserCarouselComponent } from "./user-carousel/user-carousel.component";
import { ScoreboardListComponent } from '../scoreboard-list/scoreboard-list.component';
import { AuthRole } from '../app.authRole';
import { CommonModule } from '@angular/common';
import { forkJoin, of } from 'rxjs'; // Import 'of' here
import { catchError } from 'rxjs/operators';

@Component({
  selector: 'app-home',
  standalone: true,
  imports: [ScoreboardListComponent, UserCarouselComponent, CommonModule, HeaderComponent],
  templateUrl: './home.component.html',
  styleUrls: ['./home.component.css']
})
export class HomeComponent implements OnInit {
  users: User[] = [];
  numberOfSlides: number = 1;
  scoreboardLevels: string[] = [];
  admin: boolean = false;

  currentImage: string = 'platform3.png';
  currentText1: string = "Welcome to ";
  currentText2: string = "Sumerge's Platform";

  imageTextMap: { [key: string]: { text1: string, text2: string } } = {
    'platform3.png': { text1: 'Welcome to ', text2: 'Sumerge\'s Platform' },
    'package2.png': { text1: 'Submit your ', text2: 'Career Package' },
    'learning2.png': { text1: 'Complete your ', text2: 'Learnings' }
  };

  constructor(private router: Router, private authService: AuthService, private authRole: AuthRole) {}

  ngOnInit() {
    this.loadData();
    this.checkIfAdmin();
  }

  private loadData(): void {
    forkJoin([
      this.authService.retrieveUserLearning().pipe(catchError(error => {
        console.error('Error loading users:', error);
        return of([]); 
      })),
      this.authService.retrieveNumberOfSlides().pipe(catchError(error => {
        console.error('Error loading number of slides:', error);
        return of(1);
      })),
      this.authService.retrieveScoreBoardLevels().pipe(catchError(error => {
        console.error('Error loading scoreboard levels:', error);
        return of([]);
      }))
    ]).subscribe(([users, slides, levels]) => {
      this.users = users; 
      this.numberOfSlides = slides; 
      this.scoreboardLevels = levels;
    });
  }
  
  

  changeImage(image: string): void {
    if (this.imageTextMap[image]) {
      this.currentImage = image;
      this.currentText1 = this.imageTextMap[image].text1;
      this.currentText2 = this.imageTextMap[image].text2;
    }
  }

  private checkIfAdmin(): void {
    this.authRole.canActivate().subscribe(
      (isAdmin) => {
        this.admin = isAdmin;
      },
      (error) => {
        console.error("Error occurred while checking role:", error);
        this.admin = false;
      }
    );
  }

  goToAdmin(): void {
    this.router.navigate(['/admin-controls']);
  }

  goToHome(): void {
    this.router.navigate(['/home']);
  }

  goToCareerPackage(): void {
    this.router.navigate(['/career-package']);
  }

  onClickLogout(): void {
    this.authService.logout();
  }
}
