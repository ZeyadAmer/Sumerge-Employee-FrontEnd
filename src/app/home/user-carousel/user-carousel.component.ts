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
  numberOfSlides: number = 4; // Adjust this number as needed

  scoreboardLevels = ["Explorer", "Dynamo", "Pioneer", "Legend", "Guru"]; // Define your levels here

  slides: any[] = [];
  userLevels: { [key: string]: User[] } = {}; // Dynamic storage for user levels

  startImage: string = "1.png";
  endImage: string = "2.png";
  overlayImage: string = "line.png";
  maxScore: number = 100; // Assuming max score is 100 for scaling
  constructor(private authService: AuthService){}
  @Input() users!: User[] ;

  ngOnChanges(changes: SimpleChanges) {
    if (changes['users'] && this.users.length > 0) {
      console.log(this.users.length)
      this.splitUsers();
      this.generateSlides();
    }

  }

  splitUsers() {
    // Reset userLevels object for fresh categorization
    this.userLevels = {};

    // Split users based on their score level dynamically
    for (const user of this.users) {
      // Initialize the array for the score level if it doesn't exist
      if (!this.userLevels[user.scoreLevel]) {
        this.userLevels[user.scoreLevel] = [];
      }
      // Add user to the appropriate score level
      this.userLevels[user.scoreLevel].push(user);
    }
  }

  generateSlides() {
    for (let i = 0; i < this.numberOfSlides; i++) {
      this.slides.push({
        startImage: this.getStartImage(i),
        finishImage: this.getFinishImage(i),
        users: this.getUsers(this.getLevel(i + 1))
      });
    }
  }

  getUsers(level: string): User[] {
    // Return users based on their score level
    return this.userLevels[level] || []; // Return an empty array if level doesn't exist
  }

  getStartImage(index: number): string {
    return `${index}/${this.startImage}`;
  }

  getFinishImage(index: number): string {
    return `${index}/${this.endImage}`;
  }

  getLevel(index: number): string {
    // Check if the index is within the valid range
    if (index >= 1 && index <= this.scoreboardLevels.length) {
        return this.scoreboardLevels[index - 1]; // Return level based on index
    }

    return ''; // Return an empty string for invalid index
  }

  getLine(index: number): string {
    return `${index}/line.png`;
  }

  // calculatePosition(score: number): string {
  //   const positionPercentage = (score / this.maxScore) * 100; // Calculate position based on score
  //   return `${positionPercentage}%`; // Convert to percentage
  // }

  calculatePosition(score: number): string {
    const startCircleWidth = 100; // Width of the start circle in pixels
    const startPosition = 0; // Center of the start circle in percentage
    const endPosition = 80; // Position for the end of the street line (70%)

    // Calculate the position percentage based on the score
    let positionPercentage: number;

    if (score === 0) {
        positionPercentage = startPosition; // If score is 0, place at start position
    } else if (score >= endPosition) {
        positionPercentage = endPosition; // If score is 100, place at 70%
    } else {
        // Scale the score to fill the space between the start and end positions
        positionPercentage = startPosition + ((score / this.maxScore) * (endPosition - startPosition));
    }

    return `${positionPercentage}%`; // Convert to percentage
  }
}
