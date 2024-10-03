// scoreboard-list.component.ts
import { Component, Input, OnInit, ViewChild } from '@angular/core';
import { ScoreboardItemComponent } from './scoreboard-item/scoreboard-item.component';
import { CommonModule } from '@angular/common';
import { AuthService } from '../services/auth.service';
import { User } from './user.model';
import {UserCarouselComponent} from '../home/user-carousel/user-carousel.component';




@Component({
  selector: 'app-scoreboard-list',
  standalone: true,
  imports: [ScoreboardItemComponent, CommonModule],
  templateUrl: './scoreboard-list.component.html',
  styleUrls: ['./scoreboard-list.component.css']
})
export class ScoreboardListComponent{

@ViewChild(UserCarouselComponent) userCarousel!: UserCarouselComponent;

constructor(private authService: AuthService) {}
@Input() users!: User[] ;

}