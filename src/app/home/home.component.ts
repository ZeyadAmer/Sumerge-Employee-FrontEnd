import { Component } from '@angular/core';
import { ScoreboardListComponent } from '../scoreboard-list/scoreboard-list.component';
import { I } from '@angular/cdk/keycodes';
import { UserCarouselComponent } from "./user-carousel/user-carousel.component";
import { CommonModule } from '@angular/common';
import { Route, Router, RouterOutlet } from '@angular/router';
import { AuthService } from '../services/auth.service';
import { User } from '../scoreboard-list/user.model';
import { HeaderComponent } from "../header/header.component";
import { AuthRole } from '../app.authRole';

@Component({
  selector: 'app-home',
  standalone: true,
  imports: [ScoreboardListComponent, UserCarouselComponent, CommonModule, HeaderComponent],
  templateUrl: './home.component.html',
  styleUrl: './home.component.css'
})
export class HomeComponent {

  constructor(private router: Router, private authService: AuthService,private authRole: AuthRole){}
  users: User[] = [];
  numberOfSlides:number = 1;
  scoreboardLevels: string[] = [];
  admin: boolean = false;

  currentImage:string = 'platform3.png';
  currentText1: string = "Welcome to ";
  currentText2: string = "Sumerge\'s Platform";

  imageTextMap: { [key: string]: { text1: string, text2: string } } = {
    'platform3.png': { text1: 'Welcome to ', text2: 'Sumerge\'s Platform' },
    'package2.png': { text1: 'Submit your ', text2: 'Career Package' },
    'learning2.png': { text1: 'Complete your ', text2: 'Learnings' }
  };
  
  async ngOnInit() {
    this.users = await this.authService.retrieveUserLearning();
    this.numberOfSlides = await this.authService.retrieveNumberOfSlides();
    this.scoreboardLevels = await this.authService.retrieveScoreBoardLevels();
    this.ifAdmin();
    
  }

  changeImage(image: string) {
    this.currentImage = image;
    this.currentText1 = this.imageTextMap[image].text1; 
    this.currentText2 = this.imageTextMap[image].text2; 
  }

  ifAdmin(): boolean{
    this.authRole.canActivate().subscribe(
      (isAdmin) => {
        if (isAdmin) {
          console.log("User is an admin.");
          this.admin = true;
        } else {
          console.log("User is not an admin.");
          this.admin = false;
        }
      },
      (error) => {
        console.error("Error occurred while checking role:", error);
        this.admin = false;
      }
    );
    return this.admin;
  }

  goToAdmin() {
    this.router.navigate(['/admin-controls']);
  }


  goToHome(){
    this.router.navigate(['/home']);
  }

  onClickLogout(){
    this.authService.logout();
  }
}
