import { CommonModule } from '@angular/common';
import { Component, OnInit } from '@angular/core';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { HeaderComponent } from "../header/header.component";
import { BoosterFormComponent } from "./booster-form/booster-form.component";
import { ScoreboardFormComponent } from "./scoreboard-form/scoreboard-form.component";
import { SignupComponent } from './signup/signup.component';
import { ScoreboardListComponent } from "../scoreboard-list/scoreboard-list.component";

@Component({
  selector: 'app-admin-control',
  standalone: true,
  imports: [ReactiveFormsModule, CommonModule, FormsModule, HeaderComponent, BoosterFormComponent, ScoreboardFormComponent, SignupComponent, ScoreboardListComponent],
  templateUrl: './admin-control.component.html',
  styleUrls: ['./admin-control.component.css']  
})
export class AdminControlComponent {
  
  
}
