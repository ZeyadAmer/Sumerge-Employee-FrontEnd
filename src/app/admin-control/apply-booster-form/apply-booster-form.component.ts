import { Component } from '@angular/core';
import { FormBuilder, FormGroup, FormsModule, ReactiveFormsModule, Validators } from '@angular/forms';
import { Router } from '@angular/router';
import { ActiveBooster, boosterForm } from '../admin-controls.model';
import { CommonModule } from '@angular/common';
import { ActiveBoosterComponent } from "./active-booster/active-booster.component";

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
  applyActiveBooster: ActiveBooster[] = [
    { name: 'Booster 1', isActive: false },
    { name: 'Booster 2', isActive: true },
    { name: 'Booster 3', isActive: true }
    // Add more boosters as needed
  ];

    constructor(private router: Router, private fb: FormBuilder) {
    this.applyActiveBoosterForm = this.fb.group({
      boosterName: ['', Validators.required],
      isActive: [false],
    });
  }



  onSubmitApplyActiveBooster(){
      // post request
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
