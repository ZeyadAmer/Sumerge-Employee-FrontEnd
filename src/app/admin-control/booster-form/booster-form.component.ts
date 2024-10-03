import { CommonModule } from '@angular/common';
import { Component } from '@angular/core';
import { FormBuilder, FormGroup, FormsModule, ReactiveFormsModule, Validators } from '@angular/forms';
import { Router } from '@angular/router';
import { boosterForm } from '../admin-controls.model';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { CookieService } from 'ngx-cookie-service'; 

@Component({
  selector: 'app-booster-form',
  standalone: true,
  imports: [ReactiveFormsModule, CommonModule, FormsModule],
  templateUrl: './booster-form.component.html',
  styleUrl: './booster-form.component.css'
})
export class BoosterFormComponent {

  

  constructor(private router: Router, private fb: FormBuilder,private http: HttpClient,private cookieService: CookieService) {
    this.boosterForm = this.fb.group({
      boosterName: ['', Validators.required],
      boosterTypeName: ['', Validators.required],
      boosterTypeValue: [0, [Validators.required, Validators.min(0)]],
      isActive: [false],
    });
  }
  boosterForm: FormGroup;
 
  onSubmitAddBooster() {
    const token = this.cookieService.get('authToken');
    const headers = new HttpHeaders({
      'Authorization': `Bearer ${token}`
    });
    if (this.boosterForm.valid) {
      const boosterData: boosterForm = {
        name: this.boosterForm.get('boosterName')?.value,
        boosterType: {
          name: this.boosterForm.get('boosterTypeName')?.value,
          value: this.boosterForm.get('boosterTypeValue')?.value,
        },
        isActive: this.boosterForm.get('isActive')?.value,
      };

      console.log("Booster Form Data:", boosterData);
      this.http.post('http://localhost:8081/boosters', boosterData, { headers }).subscribe(
        (response) => {
          console.log(response);
          
        },
        error => {
          console.error('Error occurred:', error);
        }
      );
      this.resetBoosterFields();
    } else {
      console.log('Booster Form is invalid');
    }
  }

  private resetBoosterFields() {
    this.boosterForm.reset({ isActive: false });
  }
}
