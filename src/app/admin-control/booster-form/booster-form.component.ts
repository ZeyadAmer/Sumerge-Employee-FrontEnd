import { CommonModule } from '@angular/common';
import { Component } from '@angular/core';
import { FormBuilder, FormGroup, FormsModule, ReactiveFormsModule, Validators } from '@angular/forms';
import { Router } from '@angular/router';
import { boosterForm } from '../admin-controls.model';

@Component({
  selector: 'app-booster-form',
  standalone: true,
  imports: [ReactiveFormsModule, CommonModule, FormsModule],
  templateUrl: './booster-form.component.html',
  styleUrl: './booster-form.component.css'
})
export class BoosterFormComponent {

  boosterForm: FormGroup;

  constructor(private router: Router, private fb: FormBuilder) {
    this.boosterForm = this.fb.group({
      boosterName: ['', Validators.required],
      boosterTypeName: ['', Validators.required],
      boosterTypeValue: [0, [Validators.required, Validators.min(0)]],
      isActive: [false],
    });
  }

  onSubmitAddBooster() {
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
      this.resetBoosterFields();
    } else {
      console.log('Booster Form is invalid');
    }
  }

  private resetBoosterFields() {
    this.boosterForm.reset({ isActive: false });
  }
}
