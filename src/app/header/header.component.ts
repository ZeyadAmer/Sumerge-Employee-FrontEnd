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
  manager: boolean = false;
  showDropdown = false;
  private dropdownTimer: any;
  showLearningsDropdown = false;
  showBlogsDropdown = false;
  private timers: { [key: string]: any } = {};
  constructor(private router: Router, private authService: AuthService,private authRole: AuthRole, private authManager: AuthManager){}

  ngOnInit(){
    this.ifAdmin();
    this.ifManager();
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

  ifManager(): boolean{
    this.authManager.canActivate().subscribe(
      (isManager) => {
        if (isManager) {
          console.log("User is a manager.");
          this.manager = true;
        } else {
          console.log("User is not a manager.");
          this.manager = false;
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

  onMouseEnter(dropdown: string) {
    // Clear existing timer for the specific dropdown
    if (this.timers[dropdown]) {
      clearTimeout(this.timers[dropdown]);
    }

    if (dropdown === 'learnings') {
      this.showLearningsDropdown = true;
    } else if (dropdown === 'blogs') {
      this.showBlogsDropdown = true;
    }
  }

  onMouseLeave(dropdown: string) {
    // Set a timer to hide the dropdown after 300ms
    this.timers[dropdown] = setTimeout(() => {
      if (dropdown === 'learnings') {
        this.showLearningsDropdown = false;
      } else if (dropdown === 'blogs') {
        this.showBlogsDropdown = false;
      }
    }, 300);
  }

  goToLearnings(){
    this.router.navigate(['/learnings']);
  }

  goToSubmitLearnings(){
    this.router.navigate(['/submit-learning']);
  }

  goToReviewLearnings(){
    this.router.navigate(['/approve-learning']);
  }

  goToBlogs(){
    this.router.navigate(['/blogs']);
  }

  goToBlogsApproval(){
    this.router.navigate(['/blogs-approval']);
  }
}
