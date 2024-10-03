import { Component, SimpleChanges } from '@angular/core';
import { FormBuilder, FormGroup, FormsModule, ReactiveFormsModule, Validators } from '@angular/forms';
import { Router } from '@angular/router';
import { ActiveBooster, boosterForm } from '../admin-controls.model';
import { CommonModule } from '@angular/common';
import { ActiveBoosterComponent } from "./active-booster/active-booster.component";
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { CookieService } from 'ngx-cookie-service'; 
@Component({
  selector: 'app-apply-booster-form',
  standalone: true,
  imports: [ReactiveFormsModule, FormsModule, CommonModule, ActiveBoosterComponent],
  templateUrl: './apply-booster-form.component.html',
  styleUrl: './apply-booster-form.component.css'
})
export class ApplyBoosterFormComponent {
  applyActiveBoosterForm: FormGroup;
  applyActiveBooster: ActiveBooster[] = [];
  responseBooster: boosterForm[] = [];
 

  constructor(private router: Router, private fb: FormBuilder, private http: HttpClient, private cookieService: CookieService) {
    this.applyActiveBoosterForm = this.fb.group({
      boosterName: ['', Validators.required],
      isActive: [false],
    });
  }

  ngOnInit() {
    const token = this.cookieService.get('authToken');
    const headers = new HttpHeaders({
      'Authorization': `Bearer ${token}`
    });

    this.http.get<any[]>('http://localhost:8081/boosters/all', { headers }).subscribe(
      (response) => {
        this.responseBooster = response;
        this.applyActiveBooster = response.map((booster) => ({
          name: booster.name,
          isActive: booster.active
        }));
      },
      (error) => {
        console.error('Error occurred:', error);
      }
    );
  }

  onActiveChange(activeName: string, isActive: boolean) {
    const booster = this.applyActiveBooster.find(b => b.name === activeName);
    if (booster) {
      booster.isActive = isActive;
    }
  }

  onSubmitApplyActiveBooster() {
    const token = this.cookieService.get('authToken');
    const headers = new HttpHeaders({
      'Authorization': `Bearer ${token}`
    });

    this.responseBooster = this.responseBooster.map((booster) => {
      const updatedBooster = this.applyActiveBooster.find(ab => ab.name === booster.name);
      return {
        ...booster,
        active: updatedBooster ? updatedBooster.isActive : booster.isActive
      };
    });

    this.http.put<{ updateBoosterActivity: string }>('http://localhost:8081/boosters/updateBoosterActivity', this.responseBooster, { headers }).subscribe(
      (response) => {
        console.log(response.updateBoosterActivity);
      },
      (error) => {
        console.error('Error occurred:', error);
      }
    );
  }

  // // active booster
  // applyActiveBooster!: ActiveBooster[];


  // onSubmitApplyBooster() {
  //   if (this.applyBoosterForm.valid) {
  //     const boosterData = {
  //       name: this.applyBoosterForm.get('boosterName')?.value,
  //       isActive: this.applyBoosterForm.get('isActive')?.value,
  //     };

  //     console.log("Booster Form Data:", boosterData);
  //     this.resetBoosterFields();
  //   } else {
  //     console.log('Booster Form is invalid');
  //   }
  // }

  // private resetBoosterFields() {
  //   this.applyBoosterForm.reset({ isActive: false });
  // }


}
