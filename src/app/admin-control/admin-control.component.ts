import { CommonModule } from '@angular/common';
import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormsModule, ReactiveFormsModule } from '@angular/forms';
import { Router } from '@angular/router';
import { HeaderComponent } from "../header/header.component";
import { boosterForm, scoreboardLevelForm } from './admin-controls.model';

@Component({
  selector: 'app-admin-control',
  standalone: true,
  imports: [ReactiveFormsModule, CommonModule, FormsModule, HeaderComponent],
  templateUrl: './admin-control.component.html',
  styleUrls: ['./admin-control.component.css']  
})
export class AdminControlComponent {


// scoreboardlevel
  scoreboardLevelName: string = '';
  minScore: number = 0;
  image1: File = new File([], ''); // Empty file with no content and name
  image2: File = new File([], ''); // Empty file with no content and name
  lineImage: File = new File([], ''); // Empty file with no content and name
  
// booster
  boosterName: string = '';
  boosterTypeName: string = '';
  boosterTypeValue: number = 0;
  isActive: boolean = false;

  constructor(private router: Router, private fb: FormBuilder) {}

  goToAdmin() {
    this.router.navigate(['/admin-controls']);
  }

  onSubmitAddScoreboardLevel() {

    // change file names accordingly --> create a backend request to send the files and create a folder with the new scoreboard level
    const image1Rename = '1.png'; 
    const image2Rename = '2.png';
    const lineImageRename = 'line.png';
    this.image1 = new File([this.image1], image1Rename, { type: this.image1.type });
    this.image2 = new File([this.image2], image2Rename, { type: this.image2.type });
    this.lineImage = new File([this.lineImage], lineImageRename, { type: this.lineImage.type });


    const scoreboardLevelForm: scoreboardLevelForm = {
        scoreboardLevelName: this.scoreboardLevelName,
        minScore: this.minScore,
        image1: this.image1,
        image2: this.image2,
        lineImage: this.lineImage
    };

    console.log(scoreboardLevelForm);
}

  onSubmitAddBooster() {

    const boosterForm: boosterForm = {
      name: this.boosterName,
      boosterType: {
        name: this.boosterTypeName,
        value: this.boosterTypeValue,
      },
      isActive: this.isActive
    };

    console.log("Booster Form Data:", boosterForm);

    this.resetBoosterFields();
  }

  private resetBoosterFields() {
    this.isActive = false;
    this.boosterName = this.boosterTypeName = "";
    this.boosterTypeValue = 0;
  }

  onFileChange(event: Event, fileType: string) {
    const input = event.target as HTMLInputElement;
    if (input.files && input.files.length > 0) {
      const file = input.files[0]; // Get the first selected file
      switch (fileType) {
        case 'image1':
          this.image1 = file;
          break;
        case 'image2':
          this.image2 = file;
          break;
        case 'lineImage':
          this.lineImage = file;
          break;
      }
      console.log(`${fileType} selected:`, file);
    }
  }
}
