import { Component } from '@angular/core';
import { ScoreboardListComponent } from '../scoreboard-list/scoreboard-list.component';
import { I } from '@angular/cdk/keycodes';
import { UserCarouselComponent } from "./user-carousel/user-carousel.component";

@Component({
  selector: 'app-home',
  standalone: true,
  imports: [ScoreboardListComponent, UserCarouselComponent],
  templateUrl: './home.component.html',
  styleUrl: './home.component.css'
})
export class HomeComponent {

  currentImage:string = 'platform3.png';
  currentText1: string = "Welcome to ";
  currentText2: string = "Sumerge\'s Platform";

  imageTextMap: { [key: string]: { text1: string, text2: string } } = {
    'platform3.png': { text1: 'Welcome to ', text2: 'Sumerge\'s Platform' },
    'package2.png': { text1: 'Submit your ', text2: 'Career Package' },
    'learning2.png': { text1: 'Complete your ', text2: 'Learnings' }
  };

  changeImage(image: string) {
    this.currentImage = image;
    this.currentText1 = this.imageTextMap[image].text1; 
    this.currentText2 = this.imageTextMap[image].text2; 
  }
}
