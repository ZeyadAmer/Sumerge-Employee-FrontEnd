import { CommonModule } from '@angular/common';
import { Component } from '@angular/core';
import { Router } from '@angular/router';
import { AuthService } from '../services/auth.service';
import { AuthRole } from '../app.authRole';
import { Observable } from 'rxjs';
import { AuthManager } from '../app.authManager';
@Component({
  selector: 'app-header',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './header.component.html',
  styleUrl: './header.component.css'
})
export class HeaderComponent {
  admin: boolean = false;
  showDropdown = false;
  private dropdownTimer: any;
  constructor(private router: Router, private authService: AuthService,private authRole: AuthRole){}

  ngOnInit(){
    this.ifAdmin();
  }
  ifAdmin(): boolean{
    this.authRole.canActivate().subscribe(
      (isAdmin) => {
        if (isAdmin) {
          console.log("User is an admin.");
          this.admin = true;
        } else {
          console.log("User is not an admin.");
          this.admin = false;
        }
      },
      (error) => {
        console.error("Error occurred while checking role:", error);
        this.admin = false;
      }
    );
    return this.admin;
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

  goToCareerPackage(){
    this.router.navigate(['/career-package']);
  }

  onMouseEnter() {
    // Clear any existing timer
    if (this.dropdownTimer) {
      clearTimeout(this.dropdownTimer);
    }
    this.showDropdown = true;
  }

  onMouseLeave() {
    // Set a timer to hide the dropdown after 3 seconds
    this.dropdownTimer = setTimeout(() => {
      this.showDropdown = false;
    }, 300);
  }

  goToLearnings(){
    this.router.navigate(['/learnings']);
  }
}
