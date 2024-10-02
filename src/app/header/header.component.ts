import { CommonModule } from '@angular/common';
import { Component } from '@angular/core';
import { Router } from '@angular/router';

@Component({
  selector: 'app-header',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './header.component.html',
  styleUrl: './header.component.css'
})
export class HeaderComponent {

  constructor(private router: Router){}

  ifAdmin(): boolean{
    // send request to backend tro get the tokena nd check if it is admin or no
    return true;
  }

  goToAdmin() {
    this.router.navigate(['/admin-controls']);
  }

  goToHome(){
    this.router.navigate(['/home']);
  }
}
