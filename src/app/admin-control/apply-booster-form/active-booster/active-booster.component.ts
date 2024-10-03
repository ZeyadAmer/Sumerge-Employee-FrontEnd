import { Component, EventEmitter, Input, Output } from '@angular/core';

@Component({
  selector: 'app-active-booster',
  standalone: true,
  imports: [],
  templateUrl: './active-booster.component.html',
  styleUrl: './active-booster.component.css'
})
export class ActiveBoosterComponent {
  @Input({ required: true }) activeName!: string;
  @Input({ required: true }) isActive!: boolean;

  @Output() isActiveChange = new EventEmitter<boolean>();

  toggleActive(event: Event) {
    const isChecked = (event.target as HTMLInputElement).checked;
    this.isActiveChange.emit(isChecked); // Emit the new state to the parent
  }
}
