import { Component, Input } from '@angular/core';

@Component({
  selector: 'app-active-booster',
  standalone: true,
  imports: [],
  templateUrl: './active-booster.component.html',
  styleUrl: './active-booster.component.css'
})
export class ActiveBoosterComponent {
  @Input({required: true}) activeName!: string;
  @Input({required: true}) isActive!: boolean;
}
