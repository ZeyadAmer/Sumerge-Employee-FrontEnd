import { CommonModule } from '@angular/common';
import { Component } from '@angular/core';
import { FormBuilder, FormGroup, FormsModule, ReactiveFormsModule, Validators } from '@angular/forms';
import { Router } from '@angular/router';
import { scoreboard } from '../admin-controls.model';
import { SCROLL_LOCK } from '@angular/cdk/keycodes';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { CookieService } from 'ngx-cookie-service'
@Component({
  selector: 'app-scoreboard-form',
  standalone: true,
  imports: [ReactiveFormsModule, CommonModule, FormsModule],
  templateUrl: './scoreboard-form.component.html',
  styleUrl: './scoreboard-form.component.css'
})
export class ScoreboardFormComponent {
  scoreboardLevelForm: FormGroup;

  constructor(private router: Router, private fb: FormBuilder,private http: HttpClient,private cookieService: CookieService) {

    this.scoreboardLevelForm = this.fb.group({
      scoreboardLevelName: ['', Validators.required],
      minScore: [0, [Validators.required, Validators.min(0)]],
      image1: [null, Validators.required],
      image2: [null, Validators.required],
      lineImage: [null, Validators.required],
    });
  }

  ngOnInit() {}

  onSubmitAddScoreboardLevel() {
    const token = this.cookieService.get('authToken');
    const headers = new HttpHeaders({
      'Authorization': `Bearer ${token}`
    });
    if (this.scoreboardLevelForm.valid) {
      const formData = this.scoreboardLevelForm.value;
  
      const image1Rename = '1.png';
      const image2Rename = '2.png';
      const lineImageRename = 'line.png';
  
      const image1File = new File([formData.image1], image1Rename, { type: formData.image1.type });
      const image2File = new File([formData.image2], image2Rename, { type: formData.image2.type });
      const lineImageFile = new File([formData.lineImage], lineImageRename, { type: formData.lineImage.type });
  
      console.log('Scoreboard Level Form Data:', {
        ...formData,
        image1: image1File,
        image2: image2File,
        lineImage: lineImageFile,
      });

      const scoreboardForm: scoreboard = {
          levelName: this.scoreboardLevelForm.value.scoreboardLevelName,
          minScore: this.scoreboardLevelForm.value.minScore
      }
      this.http.post<{created:string}>('http://localhost:8081/scoreboardLevels',scoreboardForm ,{ headers }).subscribe(
        (response) => {
          console.log(response.created);
        },
        (error) => {
          console.error('Error occurred:', error);
        }
      );

      console.log("SENT SCOREBAORD: ", scoreboardForm);


    } else {
      console.log('Scoreboard Level Form is invalid');
    }
  }

  onFileChange(event: Event, fileType: string) {
    const input = event.target as HTMLInputElement;
    if (input.files && input.files.length > 0) {
      const file = input.files[0];
      switch (fileType) {
        case 'image1':
          this.scoreboardLevelForm.patchValue({ image1: file });
          break;
        case 'image2':
          this.scoreboardLevelForm.patchValue({ image2: file });
          break;
        case 'lineImage':
          this.scoreboardLevelForm.patchValue({ lineImage: file });
          break;
      }
      console.log(`${fileType} selected:`, file);
    }
  }
  
}
