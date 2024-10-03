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

  // GET REQUEST FROMBACKEND TO GET THE BOOSTER THEN ADD 
  applyActiveBooster: ActiveBooster[] = [];
  responseBooster: boosterForm[] = [];
 

    constructor(private router: Router, private fb: FormBuilder,private http: HttpClient,private cookieService: CookieService) {
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

        console.log(this.responseBooster); // To check the transformed data
      },
      (error) => {
        console.error('Error occurred:', error);
      }
    );
  }

 

  onSubmitApplyActiveBooster(){
    const token = this.cookieService.get('authToken');
    const headers = new HttpHeaders({
      'Authorization': `Bearer ${token}`
    });
    this.responseBooster = this.responseBooster.map((booster) => {
      const updatedBooster = this.applyActiveBooster.find(ab => ab.name === booster.name);
      return {
        ...booster, // Spread operator to keep the existing properties
        active: updatedBooster ? updatedBooster.isActive : booster.isActive // Update isActive if found, otherwise keep original
      };
    });
    this.http.put<{updateBoosterActivity: string}>('http://localhost:8081/boosters/updateBoosterActivity',this.responseBooster, { headers }).subscribe(
      (response) => {
        console.log(this.applyActiveBooster);
        console.log(this.responseBooster);
        console.log(response.updateBoosterActivity); // To check the transformed data
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
