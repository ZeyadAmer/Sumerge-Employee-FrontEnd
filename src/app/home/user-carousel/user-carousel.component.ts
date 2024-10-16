import { CommonModule } from '@angular/common';
import { Component, Input, SimpleChanges } from '@angular/core';
import { User } from '../../scoreboard-list/user.model';
import { AuthService } from '../../services/auth.service';
import { ScoreboardListComponent } from '../../scoreboard-list/scoreboard-list.component';

@Component({
  selector: 'app-user-carousel',
  standalone: true,
  imports: [CommonModule,ScoreboardListComponent],
  templateUrl: './user-carousel.component.html',
  styleUrl: './user-carousel.component.css'
})
export class UserCarouselComponent {

  slides: any[] = [];
  userLevels: { [key: string]: User[] } = {}; 

  startImage: string = "1.png";
  endImage: string = "2.png";
  overlayImage: string = "line.png";
  maxScore: number = 100; 
  constructor(private authService: AuthService){}
  @Input() users!: User[] ;
  @Input() numberOfSlides!:number;
  @Input() scoreboardLevels!: string[] ;


  ngOnChanges(changes: SimpleChanges) {
    if (changes['users'] && this.users.length > 0) {
      console.log(this.users.length)
      console.log("number of slides" + this.numberOfSlides);
      this.splitUsers();
    }
    if (changes['scoreboardLevels'] && this.scoreboardLevels.length > 0 ) {
      console.log(this.users.length)
      console.log("number of slides" + this.numberOfSlides);
      this.splitUsers();
      this.generateSlides();
    }

  }

  splitUsers() {

    this.userLevels = {};

    for (const user of this.users) {
      if (!this.userLevels[user.scoreLevel]) {
        this.userLevels[user.scoreLevel] = [];
      }
      this.userLevels[user.scoreLevel].push(user);
    }
  }

  generateSlides() {
    for (let i = 0; i < this.numberOfSlides-1; i++) {
      this.slides.push({
        startImage: this.getStartImage(i),
        finishImage: this.getFinishImage(i),
        users: this.getUsers(this.getLevel(i + 1))
      });
    }
  }

  getUsers(level: string): User[] {
    return this.userLevels[level] || [];
  }

  getStartImage(index: number): string {
    return `${index}/${this.startImage}`;
  }

  getFinishImage(index: number): string {
    return `${index}/${this.endImage}`;
  }

  getLevel(index: number): string {
    if (index >= 1 && index <= this.scoreboardLevels.length) {
        return this.scoreboardLevels[index - 1]; 
    }

    return '';
  }

  getLine(index: number): string {
    return `${index}/line.png`;
  }

  calculatePosition(score: number): string {
    const startCircleWidth = 100; 
    const startPosition = 0; 
    const endPosition = 80; 

    let positionPercentage: number;

    if (score === 0) {
        positionPercentage = startPosition;
    } else if (score >= endPosition) {
        positionPercentage = endPosition; 
    } else {
        positionPercentage = startPosition + ((score / this.maxScore) * (endPosition - startPosition));
    }

    return `${positionPercentage}%`;
  }
}
