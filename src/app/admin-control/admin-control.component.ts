import { CommonModule } from '@angular/common';
import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators, FormsModule, ReactiveFormsModule } from '@angular/forms';
import { Router } from '@angular/router';
import { HeaderComponent } from "../header/header.component";
import { boosterForm, scoreboardLevelForm } from './admin-controls.model';
import { BoosterFormComponent } from "./booster-form/booster-form.component";
import { ScoreboardFormComponent } from "./scoreboard-form/scoreboard-form.component";

@Component({
  selector: 'app-admin-control',
  standalone: true,
  imports: [ReactiveFormsModule, CommonModule, FormsModule, HeaderComponent, BoosterFormComponent, ScoreboardFormComponent],
  templateUrl: './admin-control.component.html',
  styleUrls: ['./admin-control.component.css']  
})
export class AdminControlComponent {
  
  
}
