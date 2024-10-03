import { CommonModule } from '@angular/common';
import { Component } from '@angular/core';
import { Router } from '@angular/router';
import { AuthService } from '../services/auth.service';

@Component({
  selector: 'app-header',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './header.component.html',
  styleUrl: './header.component.css'
})
export class HeaderComponent {

  constructor(private router: Router, private authService: AuthService){}

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

  onClickLogout(){
    this.authService.logout();
  }
}
